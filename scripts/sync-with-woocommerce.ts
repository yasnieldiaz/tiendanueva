import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const publicDir = path.join(process.cwd(), "public", "images", "products");

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// WordPress credentials
const WP_URL = "https://drone-partss.com";
const WP_USER = "admin@drone-partss.com";
const WP_PASS = "Fisheryou1983";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
}

function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const filePath = path.join(publicDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(filePath);

    const makeRequest = (requestUrl: string) => {
      const urlObj = new URL(requestUrl);

      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
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
            const fullRedirectUrl = redirectUrl.startsWith("http")
              ? redirectUrl
              : `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
            makeRequest(fullRedirectUrl);
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

      request.setTimeout(15000, () => {
        request.destroy();
        resolve(false);
      });
    };

    makeRequest(url);
  });
}

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  images: Array<{ id: number; src: string; name: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  stock_quantity: number | null;
  stock_status: string;
}

async function fetchWooCommerceProducts(page: number = 1, perPage: number = 100): Promise<WooProduct[]> {
  return new Promise((resolve) => {
    const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

    const options = {
      hostname: "drone-partss.com",
      path: `/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&status=publish`,
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    };

    const request = https.get(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const products = JSON.parse(data);
          if (Array.isArray(products)) {
            resolve(products);
          } else {
            console.log("API Response:", data.substring(0, 500));
            resolve([]);
          }
        } catch (e) {
          console.log("Parse error, response:", data.substring(0, 500));
          resolve([]);
        }
      });
    });

    request.on("error", (e) => {
      console.log("Request error:", e.message);
      resolve([]);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      resolve([]);
    });
  });
}

async function fetchAllWooProducts(): Promise<WooProduct[]> {
  const allProducts: WooProduct[] = [];
  let page = 1;
  const perPage = 100;

  console.log("Fetching products from WooCommerce API...\n");

  while (true) {
    console.log(`Fetching page ${page}...`);
    const products = await fetchWooCommerceProducts(page, perPage);

    if (products.length === 0) {
      break;
    }

    allProducts.push(...products);
    console.log(`  Got ${products.length} products (total: ${allProducts.length})`);

    if (products.length < perPage) {
      break;
    }

    page++;

    // Small delay to not overwhelm the server
    await new Promise(r => setTimeout(r, 500));
  }

  return allProducts;
}

async function main() {
  console.log("=== Syncing products with WooCommerce ===\n");

  // Fetch all products from WooCommerce
  const wooProducts = await fetchAllWooProducts();

  if (wooProducts.length === 0) {
    console.log("No products fetched from WooCommerce. Check credentials.");
    return;
  }

  console.log(`\nTotal products from WooCommerce: ${wooProducts.length}\n`);

  // Clear existing products
  console.log("Clearing existing products...");
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Create categories from WooCommerce
  const categoryMap = new Map<string, string>();
  const categories = new Set<string>();

  for (const product of wooProducts) {
    for (const cat of product.categories) {
      categories.add(JSON.stringify({ name: cat.name, slug: cat.slug }));
    }
  }

  console.log(`Creating ${categories.size} categories...`);

  for (const catJson of categories) {
    const cat = JSON.parse(catJson);
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug
      }
    });
    categoryMap.set(cat.slug, created.id);
  }

  // Get or create brands
  let djiBrand = await prisma.brand.findFirst({ where: { slug: "dji" } });
  let xagBrand = await prisma.brand.findFirst({ where: { slug: "xag" } });
  let autelBrand = await prisma.brand.findFirst({ where: { slug: "autel" } });
  let fimiBrand = await prisma.brand.findFirst({ where: { slug: "fimi" } });

  if (!djiBrand) {
    djiBrand = await prisma.brand.create({
      data: { name: "DJI", slug: "dji", description: "World's leading drone manufacturer" }
    });
  }
  if (!xagBrand) {
    xagBrand = await prisma.brand.create({
      data: { name: "XAG", slug: "xag", description: "Agricultural drone specialist" }
    });
  }
  if (!autelBrand) {
    autelBrand = await prisma.brand.create({
      data: { name: "Autel", slug: "autel", description: "Professional drones and cameras" }
    });
  }
  if (!fimiBrand) {
    fimiBrand = await prisma.brand.create({
      data: { name: "FIMI", slug: "fimi", description: "Xiaomi drone brand" }
    });
  }

  console.log("\nCreating products and downloading images...\n");

  let created = 0;
  let imagesDownloaded = 0;

  for (let i = 0; i < wooProducts.length; i++) {
    const wooProduct = wooProducts[i];
    const progress = `[${i + 1}/${wooProducts.length}]`;

    // Determine brand
    const nameLower = wooProduct.name.toLowerCase();
    let brandId = djiBrand.id;
    if (nameLower.includes("xag")) brandId = xagBrand.id;
    else if (nameLower.includes("autel")) brandId = autelBrand.id;
    else if (nameLower.includes("fimi")) brandId = fimiBrand.id;

    // Get category
    const categorySlug = wooProduct.categories[0]?.slug || "accesorios";
    let categoryId = categoryMap.get(categorySlug);

    if (!categoryId) {
      const defaultCat = await prisma.category.findFirst({ where: { slug: "accesorios" } });
      if (!defaultCat) {
        const newCat = await prisma.category.create({
          data: { name: "Accesorios", slug: "accesorios" }
        });
        categoryId = newCat.id;
        categoryMap.set("accesorios", categoryId);
      } else {
        categoryId = defaultCat.id;
      }
    }

    // Parse price (convert brutto to netto)
    const bruttoPrice = parseFloat(wooProduct.regular_price || wooProduct.price || "0");
    const nettoPrice = Math.round((bruttoPrice / 1.23) * 100) / 100;

    // Create product
    const product = await prisma.product.create({
      data: {
        name: wooProduct.name,
        slug: wooProduct.slug,
        description: `${wooProduct.name} - Oryginalna część zamienna od drone-partss.com`,
        price: nettoPrice,
        stock: wooProduct.stock_quantity || (wooProduct.stock_status === "instock" ? 5 : 0),
        isActive: true,
        isFeatured: i < 20, // First 20 products are featured
        categoryId,
        brandId
      }
    });

    created++;

    // Download and save image
    if (wooProduct.images && wooProduct.images.length > 0) {
      const imageUrl = wooProduct.images[0].src;
      const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
      const filename = `${slugify(wooProduct.name)}.${ext}`;

      const success = await downloadImage(imageUrl, filename);

      if (success) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `/images/products/${filename}`,
            alt: wooProduct.name,
            position: 0
          }
        });
        imagesDownloaded++;
        console.log(`${progress} ✅ ${wooProduct.name}`);
      } else {
        // Use fallback image
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: "/images/products/dji-care.jpg",
            alt: wooProduct.name,
            position: 0
          }
        });
        console.log(`${progress} ⚠️ ${wooProduct.name} (fallback image)`);
      }
    } else {
      // No image available
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: "/images/products/dji-care.jpg",
          alt: wooProduct.name,
          position: 0
        }
      });
      console.log(`${progress} ⚠️ ${wooProduct.name} (no image)`);
    }
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`Products created: ${created}`);
  console.log(`Images downloaded: ${imagesDownloaded}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
