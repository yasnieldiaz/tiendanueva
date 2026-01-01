import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

function createPrismaClient() {
  const adapter = new PrismaLibSql({ url: "file:./dev.db" });
  return new PrismaClient({ adapter });
}

let prisma = createPrismaClient();

const publicDir = path.join(process.cwd(), "public", "images", "products");

// Size of the fallback/duplicate image we need to replace
const FALLBACK_SIZE = 139938;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

function fetchPage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);

      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        }
      };

      const request = https.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const fullUrl = redirectUrl.startsWith("http")
              ? redirectUrl
              : `https://${urlObj.host}${redirectUrl}`;
            fetchPage(fullUrl).then(resolve);
            return;
          }
        }

        if (response.statusCode !== 200) {
          resolve(null);
          return;
        }

        let data = "";
        response.on("data", (chunk) => { data += chunk; });
        response.on("end", () => { resolve(data); });
      });

      request.on("error", () => { resolve(null); });
      request.setTimeout(15000, () => { request.destroy(); resolve(null); });
    } catch {
      resolve(null);
    }
  });
}

function extractImageUrl(html: string): string | null {
  // Multiple patterns to find product images
  const patterns = [
    // og:image meta tag
    /property="og:image"\s+content="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/i,
    /content="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"\s+property="og:image"/i,
    // Schema.org image
    /"image"\s*:\s*\[\s*"(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /"image"\s*:\s*"(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    // WooCommerce gallery
    /data-large_image="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /data-thumb="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    // Main product image
    /class="[^"]*wp-post-image[^"]*"[^>]*src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/,
    // Any image in uploads directory
    /src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"]+\.(jpg|jpeg|png|webp))"/i,
    /href="(https:\/\/drone-partss\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"]+\.(jpg|jpeg|png|webp))"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Clean the URL - remove size suffixes
      let url = match[1];
      url = url.replace(/-\d+x\d+(\.[^.]+)$/, "$1");
      return url;
    }
  }

  return null;
}

function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const filePath = path.join(publicDir, filename);
    const tempPath = filePath + ".tmp";

    const file = fs.createWriteStream(tempPath);

    const makeRequest = (requestUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        file.close();
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        resolve(false);
        return;
      }

      try {
        const urlObj = new URL(requestUrl);

        const options = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
          }
        };

        const request = https.get(options, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => {
              file.close();
              const stats = fs.statSync(tempPath);

              // Check if this is NOT the fallback image
              if (stats.size > 1000 && stats.size !== FALLBACK_SIZE) {
                // Valid new image, replace existing
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                fs.renameSync(tempPath, filePath);
                resolve(true);
              } else {
                // Same fallback image or too small, discard
                fs.unlinkSync(tempPath);
                resolve(false);
              }
            });
          } else if (response.statusCode === 301 || response.statusCode === 302) {
            file.close();
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              const fullUrl = redirectUrl.startsWith("http")
                ? redirectUrl
                : `https://${urlObj.host}${redirectUrl}`;
              const newFile = fs.createWriteStream(tempPath);
              file.on("close", () => {
                makeRequest(fullUrl, redirectCount + 1);
              });
            } else {
              resolve(false);
            }
          } else {
            file.close();
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            resolve(false);
          }
        });

        request.on("error", () => {
          file.close();
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          resolve(false);
        });

        request.setTimeout(20000, () => {
          request.destroy();
          resolve(false);
        });
      } catch {
        file.close();
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        resolve(false);
      }
    };

    makeRequest(url);
  });
}

async function main() {
  console.log("=== Downloading Real Product Images ===\n");

  // Get all products
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { name: "asc" }
  });

  console.log(`Total products: ${products.length}\n`);

  // First, identify products with fallback images
  const productsNeedingImages: typeof products = [];

  for (const product of products) {
    if (product.images.length > 0) {
      const imageUrl = product.images[0].url;
      const filename = imageUrl.replace("/images/products/", "");
      const filePath = path.join(publicDir, filename);

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size === FALLBACK_SIZE) {
          productsNeedingImages.push(product);
        }
      } else {
        productsNeedingImages.push(product);
      }
    } else {
      productsNeedingImages.push(product);
    }
  }

  console.log(`Products needing real images: ${productsNeedingImages.length}\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < productsNeedingImages.length; i++) {
    const product = productsNeedingImages[i];
    const progress = `[${i + 1}/${productsNeedingImages.length}]`;

    // Reconnect to database every 50 products to avoid timeout
    if (i > 0 && i % 50 === 0) {
      await prisma.$disconnect();
      prisma = createPrismaClient();
      console.log("(reconnected to database)");
    }

    // Try multiple URL patterns
    const urlPatterns = [
      `https://drone-partss.com/product/${product.slug}/`,
      `https://drone-partss.com/${product.slug}/`,
    ];

    let imageFound = false;

    for (const productUrl of urlPatterns) {
      if (imageFound) break;

      const html = await fetchPage(productUrl);

      if (!html) continue;

      const imageUrl = extractImageUrl(html);

      if (imageUrl) {
        const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
        const filename = `${slugify(product.name)}.${ext}`;

        const success = await downloadImage(imageUrl, filename);

        if (success) {
          const localPath = `/images/products/${filename}`;

          try {
            if (product.images.length > 0) {
              await prisma.productImage.update({
                where: { id: product.images[0].id },
                data: { url: localPath }
              });
            } else {
              await prisma.productImage.create({
                data: {
                  productId: product.id,
                  url: localPath,
                  alt: product.name,
                  position: 0
                }
              });
            }

            console.log(`${progress} ✅ ${product.name}`);
            updated++;
            imageFound = true;
          } catch (dbError) {
            console.log(`${progress} ⚠️ ${product.name} (db error, retrying...)`);
            // Reconnect and retry
            await prisma.$disconnect();
            prisma = createPrismaClient();

            try {
              if (product.images.length > 0) {
                await prisma.productImage.update({
                  where: { id: product.images[0].id },
                  data: { url: localPath }
                });
              } else {
                await prisma.productImage.create({
                  data: {
                    productId: product.id,
                    url: localPath,
                    alt: product.name,
                    position: 0
                  }
                });
              }
              console.log(`${progress} ✅ ${product.name} (retry succeeded)`);
              updated++;
              imageFound = true;
            } catch {
              console.log(`${progress} ❌ ${product.name} (db error persisted)`);
              failed++;
            }
          }
        }
      }
    }

    if (!imageFound) {
      console.log(`${progress} ⏭️ ${product.name}`);
      failed++;
    }

    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n=== Complete ===`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️ Skipped: ${failed}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
