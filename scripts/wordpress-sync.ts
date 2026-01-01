import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as querystring from "querystring";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const publicDir = path.join(process.cwd(), "public", "images", "products");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const WP_URL = "drone-partss.com";
const WP_USER = "admin@drone-partss.com";
const WP_PASS = "Fisheryou1983";

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
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
      } catch (e) {
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(false);
      }
    };

    makeRequest(url);
  });
}

// Login to WordPress and get session cookie
async function wpLogin(): Promise<string | null> {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      log: WP_USER,
      pwd: WP_PASS,
      "wp-submit": "Log In",
      redirect_to: "https://drone-partss.com/wp-admin/",
      testcookie: "1"
    });

    const options = {
      hostname: WP_URL,
      path: "/wp-login.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "Mozilla/5.0",
        "Cookie": "wordpress_test_cookie=WP%20Cookie%20check"
      }
    };

    const req = https.request(options, (res) => {
      const cookies = res.headers["set-cookie"];
      if (cookies) {
        const sessionCookies = cookies.map(c => c.split(";")[0]).join("; ");
        console.log("Login successful!");
        resolve(sessionCookies);
      } else {
        console.log("Login response:", res.statusCode);
        resolve(null);
      }
    });

    req.on("error", (e) => {
      console.log("Login error:", e.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

// Fetch products from WordPress API with authentication
async function fetchProductsFromWP(cookies: string, page: number = 1): Promise<any[]> {
  return new Promise((resolve) => {
    const options = {
      hostname: WP_URL,
      path: `/wp-json/wc/v3/products?page=${page}&per_page=100`,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookies,
        "Accept": "application/json"
      }
    };

    const req = https.get(options, (res) => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        try {
          const products = JSON.parse(data);
          if (Array.isArray(products)) {
            resolve(products);
          } else {
            console.log("API response (not array):", data.substring(0, 200));
            resolve([]);
          }
        } catch (e) {
          console.log("Parse error:", data.substring(0, 200));
          resolve([]);
        }
      });
    });

    req.on("error", () => resolve([]));
    req.setTimeout(30000, () => { req.destroy(); resolve([]); });
  });
}

// Fetch product list from wp-admin
async function fetchProductListFromAdmin(cookies: string): Promise<any[]> {
  return new Promise((resolve) => {
    const options = {
      hostname: WP_URL,
      path: "/wp-admin/edit.php?post_type=product&posts_per_page=500",
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookies
      }
    };

    const req = https.get(options, (res) => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        // Parse HTML to extract products
        const products: any[] = [];

        // Look for product rows in the admin table
        const rowRegex = /post-(\d+).*?<strong><a[^>]*>([^<]+)<\/a><\/strong>.*?src="([^"]+)"/gs;
        let match;

        while ((match = rowRegex.exec(data)) !== null) {
          products.push({
            id: match[1],
            name: match[2].trim(),
            image: match[3]
          });
        }

        console.log(`Found ${products.length} products in admin`);
        resolve(products);
      });
    });

    req.on("error", () => resolve([]));
    req.setTimeout(60000, () => { req.destroy(); resolve([]); });
  });
}

// Scrape shop page for products with images
async function scrapeShopPage(page: number = 1): Promise<any[]> {
  return new Promise((resolve) => {
    const options = {
      hostname: WP_URL,
      path: `/shop/page/${page}/`,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      }
    };

    const req = https.get(options, (res) => {
      if (res.statusCode === 404) {
        resolve([]);
        return;
      }

      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        const products: any[] = [];

        // Pattern to match product items
        // Look for li.product elements with links, titles, and images
        const productPattern = /<li[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<img[^>]*data-src="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>[\s\S]*?<span[^>]*class="woocommerce-Price-amount[^"]*">([^<]+)<\/span>/gi;

        let match;
        while ((match = productPattern.exec(data)) !== null) {
          products.push({
            url: match[1],
            image: match[2],
            name: match[3].trim(),
            price: match[4].replace(/[^\d,]/g, "").replace(",", ".")
          });
        }

        // Alternative pattern if first doesn't work
        if (products.length === 0) {
          const altPattern = /<a[^>]*href="(https:\/\/drone-partss\.com\/[^\/]+\/)"[^>]*class="[^"]*woocommerce-LoopProduct[^"]*"[^>]*>[\s\S]*?<img[^>]*(?:data-src|src)="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>/gi;

          while ((match = altPattern.exec(data)) !== null) {
            products.push({
              url: match[1],
              image: match[2],
              name: match[3].trim()
            });
          }
        }

        resolve(products);
      });
    });

    req.on("error", () => resolve([]));
    req.setTimeout(30000, () => { req.destroy(); resolve([]); });
  });
}

// Fetch individual product page for image
async function fetchProductImage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
      };

      const req = https.get(options, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }

        let data = "";
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          // Look for main product image
          const patterns = [
            /data-large_image="([^"]+)"/,
            /"image"\s*:\s*"([^"]+wp-content\/uploads[^"]+)"/,
            /og:image[^>]+content="([^"]+wp-content\/uploads[^"]+)"/,
            /src="([^"]+wp-content\/uploads[^"]+)"[^>]*class="[^"]*wp-post-image/,
          ];

          for (const pattern of patterns) {
            const match = data.match(pattern);
            if (match && match[1]) {
              // Clean the URL (remove size suffix)
              let imgUrl = match[1].replace(/-\d+x\d+(\.[^.]+)$/, "$1");
              resolve(imgUrl);
              return;
            }
          }

          resolve(null);
        });
      });

      req.on("error", () => resolve(null));
      req.setTimeout(15000, () => { req.destroy(); resolve(null); });
    } catch {
      resolve(null);
    }
  });
}

async function main() {
  console.log("=== WordPress Product Sync ===\n");

  // First try to login
  console.log("Logging into WordPress...");
  const cookies = await wpLogin();

  if (cookies) {
    console.log("Trying WooCommerce API...");
    const products = await fetchProductsFromWP(cookies, 1);

    if (products.length > 0) {
      console.log(`Got ${products.length} products from API`);
      // Process products...
    } else {
      console.log("API didn't work, trying admin page...");
      const adminProducts = await fetchProductListFromAdmin(cookies);

      if (adminProducts.length > 0) {
        console.log(`Got ${adminProducts.length} products from admin`);
      }
    }
  }

  // Fallback: Scrape shop pages
  console.log("\nScraping shop pages for product images...\n");

  const allProducts: any[] = [];

  for (let page = 1; page <= 40; page++) {
    console.log(`Fetching page ${page}...`);
    const products = await scrapeShopPage(page);

    if (products.length === 0) {
      console.log("No more products found");
      break;
    }

    allProducts.push(...products);
    console.log(`  Found ${products.length} products (total: ${allProducts.length})`);

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nTotal products found: ${allProducts.length}`);

  if (allProducts.length === 0) {
    console.log("No products found from scraping. Fetching individual product pages...");

    // Get our products from database
    const dbProducts = await prisma.product.findMany({
      include: { images: true }
    });

    console.log(`Found ${dbProducts.length} products in database`);

    let updated = 0;

    for (let i = 0; i < dbProducts.length; i++) {
      const product = dbProducts[i];
      const progress = `[${i + 1}/${dbProducts.length}]`;

      // Try to find product on drone-partss.com
      const searchUrl = `https://drone-partss.com/?s=${encodeURIComponent(product.name)}&post_type=product`;

      const imageUrl = await fetchProductImage(searchUrl);

      if (imageUrl) {
        const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
        const filename = `${slugify(product.name)}.${ext}`;

        const success = await downloadImage(imageUrl, filename);

        if (success && product.images.length > 0) {
          await prisma.productImage.update({
            where: { id: product.images[0].id },
            data: { url: `/images/products/${filename}` }
          });
          console.log(`${progress} ✅ ${product.name}`);
          updated++;
        }
      } else {
        console.log(`${progress} ⏭️ ${product.name}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\nUpdated: ${updated} products`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
