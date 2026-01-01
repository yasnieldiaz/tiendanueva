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
const FALLBACK_SIZE = 139938;

// Mapping of products to their likely image sources
const imageSourceMap: Record<string, string> = {
  "dji-mini-5-pro": "dji-mini-4-pro",
  "dji-mini-5-pro-fly-more-combo-dji-rc-n3": "dji-mini-4-pro-fly-more-combo",
  "dji-mini-5-pro-fly-more-combo-dji-rc2": "dji-mini-4-pro-fly-more-combo",
  "inteligentny-akumulator-dji-mini-5-pro": "dji-akumulator-do-mini-3-pro",
  "dji-care-refresh-mavic-4-pro": "dji-care-refresh",
};

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
        }
      };

      const request = https.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            fetchPage(redirectUrl.startsWith("http") ? redirectUrl : `https://${urlObj.host}${redirectUrl}`).then(resolve);
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

function extractAnyImageUrl(html: string, productName: string): string | null {
  // Extract keywords from product name
  const keywords = productName.toLowerCase()
    .split(/[\s\-\/]+/)
    .filter(k => k.length > 2 && !["the", "and", "for", "pro", "szt", "com"].includes(k));

  // Find all image URLs
  const imagePattern = /https:\/\/drone-partss\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^"'\s]+\.(jpg|jpeg|png|webp))/gi;
  const matches = [...html.matchAll(imagePattern)];

  // Score images based on filename matching keywords
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const match of matches) {
    const imageUrl = match[0].replace(/-\d+x\d+(\.[^.]+)$/, "$1");
    const filename = match[1].toLowerCase();

    let score = 0;
    for (const keyword of keywords) {
      if (filename.includes(keyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = imageUrl;
    }
  }

  // If no matching image, try to get the first product image
  if (!bestMatch) {
    const firstImage = html.match(/https:\/\/drone-partss\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s]+\.(jpg|jpeg|png|webp)/i);
    if (firstImage) {
      bestMatch = firstImage[0].replace(/-\d+x\d+(\.[^.]+)$/, "$1");
    }
  }

  return bestMatch;
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
        const request = https.get({
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          headers: { "User-Agent": "Mozilla/5.0" }
        }, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => {
              file.close();
              const stats = fs.statSync(tempPath);
              if (stats.size > 1000 && stats.size !== FALLBACK_SIZE) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                fs.renameSync(tempPath, filePath);
                resolve(true);
              } else {
                fs.unlinkSync(tempPath);
                resolve(false);
              }
            });
          } else if (response.statusCode === 301 || response.statusCode === 302) {
            file.close();
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              makeRequest(redirectUrl.startsWith("http") ? redirectUrl : `https://${urlObj.host}${redirectUrl}`, redirectCount + 1);
            } else {
              resolve(false);
            }
          } else {
            file.close();
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            resolve(false);
          }
        });
        request.on("error", () => { file.close(); if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); resolve(false); });
        request.setTimeout(20000, () => { request.destroy(); resolve(false); });
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
  console.log("=== Fixing Final Images ===\n");

  // Get products with fallback images
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { name: "asc" }
  });

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
      }
    }
  }

  console.log(`Products needing images: ${productsNeedingImages.length}\n`);

  let updated = 0;
  let useAlternative = 0;

  for (let i = 0; i < productsNeedingImages.length; i++) {
    const product = productsNeedingImages[i];
    const progress = `[${i + 1}/${productsNeedingImages.length}]`;
    const productSlug = slugify(product.name);

    // Check if we have a manual mapping
    const alternativeSlug = imageSourceMap[productSlug];
    if (alternativeSlug) {
      // Try to copy from alternative source
      const altExt = ["jpg", "jpeg", "png", "webp"];
      for (const ext of altExt) {
        const altPath = path.join(publicDir, `${alternativeSlug}.${ext}`);
        if (fs.existsSync(altPath)) {
          const stats = fs.statSync(altPath);
          if (stats.size !== FALLBACK_SIZE) {
            const destPath = path.join(publicDir, `${productSlug}.${ext}`);
            fs.copyFileSync(altPath, destPath);
            console.log(`${progress} ✅ ${product.name} (from ${alternativeSlug})`);
            updated++;
            useAlternative++;
            break;
          }
        }
      }
      continue;
    }

    // Try broader searches
    const searchTerms = [
      product.name.replace(/\(.*\)/g, "").trim(),
      product.name.split(/[-\/]/).slice(0, 2).join(" "),
      product.name.replace(/DJI\s*/i, "").trim(),
    ];

    let imageFound = false;

    for (const term of searchTerms) {
      if (imageFound) break;

      const searchUrl = `https://drone-partss.com/?s=${encodeURIComponent(term)}&post_type=product`;
      const html = await fetchPage(searchUrl);

      if (!html) continue;

      const imageUrl = extractAnyImageUrl(html, product.name);

      if (imageUrl) {
        const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
        const filename = `${productSlug}.${ext}`;

        const success = await downloadImage(imageUrl, filename);

        if (success) {
          console.log(`${progress} ✅ ${product.name}`);
          updated++;
          imageFound = true;
        }
      }

      await new Promise(r => setTimeout(r, 150));
    }

    if (!imageFound) {
      console.log(`${progress} ⏭️ ${product.name}`);
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`✅ Updated: ${updated} (${useAlternative} from alternatives)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
