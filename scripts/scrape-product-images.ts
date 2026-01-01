import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const publicDir = path.join(process.cwd(), "public", "images", "products");

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

function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const filePath = path.join(publicDir, filename);

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(filePath);

    const makeRequest = (requestUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        resolve(false);
        return;
      }

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
            resolve(true);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const fullUrl = redirectUrl.startsWith("http")
              ? redirectUrl
              : `https://${urlObj.host}${redirectUrl}`;
            makeRequest(fullUrl, redirectCount + 1);
          } else {
            resolve(false);
          }
        } else {
          file.close();
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          resolve(false);
        }
      });

      request.on("error", () => {
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(false);
      });

      request.setTimeout(20000, () => {
        request.destroy();
        resolve(false);
      });
    };

    makeRequest(url);
  });
}

function fetchPage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9"
      }
    };

    const request = https.get(options, (response) => {
      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = "";
      response.on("data", (chunk) => { data += chunk; });
      response.on("end", () => { resolve(data); });
    });

    request.on("error", () => { resolve(null); });
    request.setTimeout(20000, () => { request.destroy(); resolve(null); });
  });
}

function extractProductImageUrl(html: string): string | null {
  // Multiple patterns to find product images
  const patterns = [
    // Schema.org image
    /"image"\s*:\s*\[\s*"(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /"image"\s*:\s*"(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    // Open Graph
    /property="og:image"\s+content="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /content="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"\s+property="og:image"/,
    // WooCommerce gallery
    /data-large_image="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /data-src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"[^>]*class="[^"]*wp-post-image/,
    // Direct image in gallery
    /href="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|webp))"/i,
    // Any product image
    /src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"[^>]*alt="[^"]*"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Clean the URL
      let url = match[1];
      // Remove size suffixes like -300x300
      url = url.replace(/-\d+x\d+(\.[^.]+)$/, "$1");
      return url;
    }
  }

  return null;
}

async function main() {
  console.log("=== Scraping real product images from drone-partss.com ===\n");

  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { name: "asc" }
  });

  console.log(`Found ${products.length} products\n`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    // Construct the product URL
    const productUrl = `https://drone-partss.com/${product.slug}/`;

    // Fetch the product page
    const html = await fetchPage(productUrl);

    if (!html) {
      console.log(`${progress} ❌ ${product.name} (page not found)`);
      failed++;
      continue;
    }

    // Extract image URL
    const imageUrl = extractProductImageUrl(html);

    if (!imageUrl) {
      console.log(`${progress} ⚠️ ${product.name} (no image found)`);
      failed++;
      continue;
    }

    // Download the image
    const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const filename = `${slugify(product.name)}.${ext}`;

    const success = await downloadImage(imageUrl, filename);

    if (success) {
      const localPath = `/images/products/${filename}`;

      // Update or create image record
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
    } else {
      console.log(`${progress} ❌ ${product.name} (download failed)`);
      failed++;
    }

    // Small delay to not overwhelm the server
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n=== Complete ===`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
