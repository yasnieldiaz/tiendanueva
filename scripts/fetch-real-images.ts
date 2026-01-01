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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filePath);
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filename).then(resolve);
        } else {
          resolve(false);
        }
      } else {
        file.close();
        fs.unlinkSync(filePath);
        resolve(false);
      }
    });

    request.on("error", () => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      resolve(false);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function fetchProductPage(slug: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://drone-partss.com/${slug}/`;

    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        resolve(data);
      });
    });

    request.on("error", () => {
      resolve(null);
    });

    request.setTimeout(15000, () => {
      request.destroy();
      resolve(null);
    });
  });
}

function extractImageUrl(html: string): string | null {
  // Try to find the main product image from schema.org or og:image
  const patterns = [
    /"image"\s*:\s*"(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /og:image"\s+content="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /data-large_image="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"/,
    /src="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"[^>]*class="[^"]*wp-post-image/,
    /href="(https:\/\/drone-partss\.com\/wp-content\/uploads\/[^"]+)"[^>]*data-rel="prettyPhoto/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Map of product name keywords to known working image URLs
const knownImageUrls: Record<string, string> = {
  // DJI Mavic 4 Pro
  "mavic 4 pro": "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg",
  "mavic 4 pro akumulator": "https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg",

  // DJI Mini 5 Pro
  "mini 5 pro": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp",
  "akumulator dji mini 5": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Inteligentny-akumulator-DJI-Mini-5-Pro-32508_3.webp",

  // DJI Mini 4 Pro
  "mini 4 pro": "https://drone-partss.com/wp-content/uploads/2023/10/Mini4Pro.jpg",

  // DJI Mini 3 Pro
  "mini 3 pro": "https://drone-partss.com/wp-content/uploads/2022/05/Mini3Pro.jpg",

  // DJI Mavic 3 Enterprise
  "mavic 3 enterprise": "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",
  "mavic 3 multispectral": "https://drone-partss.com/wp-content/uploads/2024/02/Multi2.jpg",
  "mavic 3 classic": "https://drone-partss.com/wp-content/uploads/2022/11/Classic1.jpg",

  // DJI Mavic 3 Pro
  "mavic 3 pro": "https://drone-partss.com/wp-content/uploads/2023/04/Mavic3Pro.jpg",

  // DJI Matrice
  "matrice 30t": "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg",
  "matrice 30 bateria": "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg",
  "matrice 350": "https://drone-partss.com/wp-content/uploads/2023/03/M350.jpg",
  "matrice 300": "https://drone-partss.com/wp-content/uploads/2020/07/M300-1.jpg",
  "matrice 4t": "https://drone-partss.com/wp-content/uploads/2024/11/Matrice4T.jpg",
  "matrice 4e": "https://drone-partss.com/wp-content/uploads/2024/11/Matrice4E.jpg",

  // Autel
  "evo max 4t": "https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png",
  "autel alpha": "https://drone-partss.com/wp-content/uploads/2023/10/Alpha3.jpg",
  "autel evo 2": "https://drone-partss.com/wp-content/uploads/2020/03/Evo2-1.jpg",
  "autel evo lite": "https://drone-partss.com/wp-content/uploads/2021/10/Lite1.jpg",
  "autel evo nano": "https://drone-partss.com/wp-content/uploads/2021/10/Nano1.jpg",
  "autel dragonfish": "https://drone-partss.com/wp-content/uploads/2023/05/Dragonfish.jpg",

  // XAG
  "xag p100": "https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg",
  "xag p150": "https://drone-partss.com/wp-content/uploads/2024/12/P150.jpg",
  "xag b13960": "https://drone-partss.com/wp-content/uploads/2024/01/B13960S.jpg",
  "xag gc4000": "https://drone-partss.com/wp-content/uploads/2024/01/GC4000.jpg",
  "xag arc3": "https://drone-partss.com/wp-content/uploads/2024/01/Acs3Pro.jpg",
  "xag revospray": "https://drone-partss.com/wp-content/uploads/2024/01/Revospray3.jpg",
  "xag revocast": "https://drone-partss.com/wp-content/uploads/2024/01/Revocast3.jpg",
  "xag xrtk": "https://drone-partss.com/wp-content/uploads/2024/01/XRTK.jpg",
  "xag statyw": "https://drone-partss.com/wp-content/uploads/2024/01/Tripod.jpg",
  "xag realterra": "https://drone-partss.com/wp-content/uploads/2024/01/RealTerra.jpg",

  // DJI FPV
  "fpv combo": "https://drone-partss.com/wp-content/uploads/2021/03/FPV1.jpg",
  "fpv motion": "https://drone-partss.com/wp-content/uploads/2024/01/FPVJostick.jpg",
  "fpv akumulator": "https://drone-partss.com/wp-content/uploads/2021/03/FPVBat.jpg",
  "fpv górna obudowa": "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPVUpper.jpg",
  "fpv dolna obudowa": "https://drone-partss.com/wp-content/uploads/2021/11/FPVBottom.jpg",

  // DJI Avata
  "avata 2 fly more": "https://drone-partss.com/wp-content/uploads/2024/04/Avata2FMC.jpg",
  "dron dji avata 2": "https://drone-partss.com/wp-content/uploads/2024/04/Avata2.jpg",
  "avata 2 akumulator": "https://drone-partss.com/wp-content/uploads/2025/09/pol_pl_Akumulator-bateria-DJI-Avata-2-42205_3.jpg",
  "goggles 3": "https://drone-partss.com/wp-content/uploads/2024/04/Goggles3.jpg",
  "avata akumulator": "https://drone-partss.com/wp-content/uploads/2022/08/AvataBat.jpg",
  "avata górna": "https://drone-partss.com/wp-content/uploads/2024/06/Avata1.jpg",

  // DJI Neo
  "neo motion fly more": "https://drone-partss.com/wp-content/uploads/2024/09/NeoFMC.jpg",
  "dji neo": "https://drone-partss.com/wp-content/uploads/2025/03/NeoMotions.jpg",

  // DJI Flip
  "flip fly more": "https://drone-partss.com/wp-content/uploads/2025/01/FlipFMC.jpg",
  "dji flip": "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg",

  // Mavic Air
  "mavic air 2s": "https://drone-partss.com/wp-content/uploads/2021/04/Air2S.jpg",
  "mavic air 2 górna": "https://drone-partss.com/wp-content/uploads/2020/05/Air2Upper.jpg",
  "mavic air 2 dolna": "https://drone-partss.com/wp-content/uploads/2020/05/Air2Bottom.jpg",
  "mavic air 3": "https://drone-partss.com/wp-content/uploads/2023/07/Air3.jpg",

  // Mavic 2
  "mavic 2 pro": "https://drone-partss.com/wp-content/uploads/2018/08/Mavic2Pro.jpg",
  "mavic 2 zoom": "https://drone-partss.com/wp-content/uploads/2018/08/Mavic2Zoom.jpg",

  // DJI Mini
  "mavic mini przednie": "https://drone-partss.com/wp-content/uploads/2020/01/MiniArm.jpg",
  "mavic mini płytka": "https://drone-partss.com/wp-content/uploads/2020/01/MiniESC.jpg",
  "mini 2 środkowa": "https://drone-partss.com/wp-content/uploads/2020/11/Mini2Middle.jpg",

  // Phantom
  "phantom 4 pro": "https://drone-partss.com/wp-content/uploads/2017/01/P4Pro.jpg",
  "phantom 4 dolna": "https://drone-partss.com/wp-content/uploads/2019/04/P4Bottom.jpg",
  "phantom 4 silnik": "https://drone-partss.com/wp-content/uploads/2019/04/p4motor_002_.jpg",

  // Inspire
  "inspire 2": "https://drone-partss.com/wp-content/uploads/2017/01/Inspire2.jpg",
  "inspire 1": "https://drone-partss.com/wp-content/uploads/2015/01/Inspire1.jpg",

  // Controllers
  "rc 2 kontroler": "https://drone-partss.com/wp-content/uploads/2022/09/RC2.jpg",
  "rc pro 2": "https://drone-partss.com/wp-content/uploads/2024/05/RCPro2.jpg",
  "rc pro remote": "https://drone-partss.com/wp-content/uploads/2022/01/RCPro.jpg",
  "rc pro enterprise": "https://drone-partss.com/wp-content/uploads/2023/01/RCProEnt.jpg",

  // DJI Care
  "care refresh": "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg",
  "dji care": "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg",

  // Agras
  "agras t30": "https://drone-partss.com/wp-content/uploads/2021/01/T30.jpg",
  "agras t40": "https://drone-partss.com/wp-content/uploads/2022/09/T40.jpg",

  // Zenmuse
  "zenmuse l2": "https://drone-partss.com/wp-content/uploads/2023/10/L2.jpg",
  "zenmuse h30": "https://drone-partss.com/wp-content/uploads/2024/04/H30.jpg",
};

function findBestImageUrl(productName: string): string | null {
  const name = productName.toLowerCase();

  // Find the best matching key
  let bestMatch: string | null = null;
  let bestMatchLength = 0;

  for (const [key, url] of Object.entries(knownImageUrls)) {
    if (name.includes(key) && key.length > bestMatchLength) {
      bestMatch = url;
      bestMatchLength = key.length;
    }
  }

  return bestMatch;
}

async function main() {
  console.log("Fetching real product images from drone-partss.com...\n");

  // Get all products
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { name: "asc" }
  });

  console.log(`Found ${products.length} products to process\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    // First, try known image URLs based on product name
    const knownUrl = findBestImageUrl(product.name);

    if (knownUrl) {
      const ext = knownUrl.split(".").pop() || "jpg";
      const filename = `${slugify(product.name)}.${ext}`;

      const success = await downloadImage(knownUrl, filename);

      if (success) {
        const localPath = `/images/products/${filename}`;

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
        continue;
      }
    }

    // If no known URL, try to fetch from the product page
    const html = await fetchProductPage(product.slug);

    if (html) {
      const imageUrl = extractImageUrl(html);

      if (imageUrl) {
        const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
        const filename = `${slugify(product.name)}.${ext}`;

        const success = await downloadImage(imageUrl, filename);

        if (success) {
          const localPath = `/images/products/${filename}`;

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
          continue;
        }
      }
    }

    console.log(`${progress} ⏭️ ${product.name}`);
    skipped++;
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️ Skipped: ${skipped}`);
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
