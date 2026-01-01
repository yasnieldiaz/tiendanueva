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

function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const filePath = path.join(publicDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️ Exists: ${filename}`);
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(true);
        });
      } else {
        file.close();
        fs.unlinkSync(filePath);
        console.log(`❌ Failed (${response.statusCode}): ${url}`);
        resolve(false);
      }
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      console.log(`❌ Error: ${url} - ${err.message}`);
      resolve(false);
    });
  });
}

// Product image URLs that are confirmed working
const productImages: Record<string, string> = {
  // DJI Mavic 4 Pro
  "mavic-4-pro": "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg",
  "mavic-4-pro-battery": "https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg",

  // DJI Mini 5 Pro
  "mini-5-pro": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp",
  "mini-5-pro-battery": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Inteligentny-akumulator-DJI-Mini-5-Pro-32508_3.webp",

  // DJI Mini 3 Pro
  "mini-3-pro": "https://drone-partss.com/wp-content/uploads/2022/05/Mini3Pro1.jpg",

  // DJI Mini 4 Pro
  "mini-4-pro": "https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProMiddle.jpg",

  // DJI Enterprise
  "mavic-3-enterprise": "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",
  "mavic-3-multispectral": "https://drone-partss.com/wp-content/uploads/2024/02/Multi2.jpg",

  // DJI Matrice
  "matrice-30t": "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg",
  "matrice-30-battery": "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg",
  "matrice-4": "https://drone-partss.com/wp-content/uploads/2025/06/Matrice4T.jpg",

  // Autel
  "autel-max-4t": "https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png",
  "autel-charger": "https://drone-partss.com/wp-content/uploads/2023/12/AutelMax.jpg",
  "autel-evo-2": "https://drone-partss.com/wp-content/uploads/2023/06/BottonEvo2.jpg",
  "autel-alpha": "https://drone-partss.com/wp-content/uploads/2023/10/Alpha3.jpg",

  // XAG
  "xag-p100": "https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg",
  "xag-p100-set": "https://drone-partss.com/wp-content/uploads/2024/12/P100Set-1.jpg",
  "xag-battery": "https://drone-partss.com/wp-content/uploads/2024/01/B13960S.jpg",
  "xag-gc4000": "https://drone-partss.com/wp-content/uploads/2024/01/GC4000.jpg",
  "xag-arc3": "https://drone-partss.com/wp-content/uploads/2024/01/Acs3Pro.jpg",
  "xag-revospray": "https://drone-partss.com/wp-content/uploads/2024/01/Revospray3.jpg",
  "xag-revocast": "https://drone-partss.com/wp-content/uploads/2024/01/Revocast3.jpg",
  "xag-rtk": "https://drone-partss.com/wp-content/uploads/2024/01/XRTK.jpg",
  "xag-tripod": "https://drone-partss.com/wp-content/uploads/2024/01/Tripod.jpg",

  // DJI Flip
  "dji-flip": "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg",

  // DJI Neo
  "dji-neo": "https://drone-partss.com/wp-content/uploads/2025/03/NeoMotions.jpg",

  // DJI Care/Accessories
  "dji-care": "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg",

  // FPV
  "dji-fpv": "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPVUpper.jpg",
  "dji-fpv-controller": "https://drone-partss.com/wp-content/uploads/2024/01/FPVJostick.jpg",

  // Avata
  "dji-avata": "https://drone-partss.com/wp-content/uploads/2024/06/Avata1.jpg",
  "dji-avata-2": "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg",
  "dji-avata-battery": "https://drone-partss.com/wp-content/uploads/2025/09/pol_pl_Akumulator-bateria-DJI-Avata-2-42205_3.jpg",

  // Controllers
  "dji-rc": "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg",

  // Mavic Air 2
  "mavic-air-2": "https://drone-partss.com/wp-content/uploads/2020/05/axis-1.jpg",
  "mavic-air-2s": "https://drone-partss.com/wp-content/uploads/2021/05/middle-shell-mavic-air-2.jpg.webp",

  // Mavic 2 Pro/Zoom
  "mavic-2-pro": "https://drone-partss.com/wp-content/uploads/2022/09/Roll_Mavic2-1.jpg",

  // Phantom 4
  "phantom-4": "https://drone-partss.com/wp-content/uploads/2019/04/p4motor_002_.jpg",

  // Inspire 2
  "inspire-2": "https://drone-partss.com/wp-content/uploads/2022/07/Inspire2Rubbers-1-2.jpg",
};

async function main() {
  console.log("Downloading product images...\n");

  let downloaded = 0;
  let failed = 0;

  for (const [name, url] of Object.entries(productImages)) {
    const ext = url.split(".").pop() || "jpg";
    const filename = `${name}.${ext}`;

    const success = await downloadImage(url, filename);
    if (success) {
      downloaded++;
    } else {
      failed++;
    }
  }

  console.log(`\n✅ Downloaded: ${downloaded}`);
  console.log(`❌ Failed: ${failed}`);

  // Now update the database
  console.log("\nUpdating database with local paths...\n");

  // Get all products
  const products = await prisma.product.findMany({
    include: { images: true }
  });

  let updated = 0;

  for (const product of products) {
    let localImage = "";
    const name = product.name.toLowerCase();
    const slug = product.slug.toLowerCase();

    // Match product to local image - order matters (more specific first)
    // Mavic 4 Pro
    if (name.includes("mavic 4 pro") && name.includes("akumulator")) {
      localImage = "/images/products/mavic-4-pro-battery.jpg";
    } else if (name.includes("mavic 4 pro") && !name.includes("care") && !name.includes("filtry")) {
      localImage = "/images/products/mavic-4-pro.jpg";
    }
    // Mini 5 Pro
    else if (name.includes("mini 5 pro") && name.includes("akumulator")) {
      localImage = "/images/products/mini-5-pro-battery.webp";
    } else if (name.includes("mini 5 pro") && !name.includes("care")) {
      localImage = "/images/products/mini-5-pro.webp";
    }
    // Mini 4 Pro - use mini-5-pro.webp as fallback (similar design)
    else if (name.includes("mini 4 pro")) {
      localImage = "/images/products/mini-5-pro.webp";
    }
    // Mini 3 Pro - use mini-5-pro.webp as fallback
    else if (name.includes("mini 3 pro") || name.includes("mini 3/4")) {
      localImage = "/images/products/mini-5-pro.webp";
    }
    // Mini 3
    else if (name.includes("mini 3")) {
      localImage = "/images/products/mini-5-pro.webp";
    }
    // Mavic 3 Enterprise
    else if (name.includes("mavic 3 enterprise") || name.includes("mavic 3 classic")) {
      localImage = "/images/products/mavic-3-enterprise.jpg";
    } else if (name.includes("mavic 3 multispectral")) {
      localImage = "/images/products/mavic-3-multispectral.jpg";
    } else if (name.includes("mavic 3 pro")) {
      localImage = "/images/products/mavic-3-enterprise.jpg";
    } else if (name.includes("mavic 3") && (name.includes("akumulator") || name.includes("ładowarka") || name.includes("hub"))) {
      localImage = "/images/products/matrice-30-battery.jpg";
    } else if (name.includes("mavic 3")) {
      localImage = "/images/products/mavic-3-enterprise.jpg";
    }
    // Matrice 4 - use matrice-30t.jpg as fallback
    else if (name.includes("matrice 4")) {
      localImage = "/images/products/matrice-30t.jpg";
    }
    // Matrice 30/300/350
    else if (name.includes("matrice 30") || name.includes("matrice 300") || name.includes("matrice 350")) {
      localImage = "/images/products/matrice-30t.jpg";
    } else if (name.includes("tb30") || (name.includes("matrice") && name.includes("bateria"))) {
      localImage = "/images/products/matrice-30-battery.jpg";
    }
    // Mavic Air 2S
    else if (name.includes("mavic air 2s") || name.includes("air 2s")) {
      localImage = "/images/products/mavic-air-2s.webp";
    }
    // Mavic Air 2
    else if (name.includes("mavic air 2") || name.includes("air 2")) {
      localImage = "/images/products/mavic-air-2.jpg";
    }
    // Mavic Air 3
    else if (name.includes("mavic air 3") || name.includes("air 3")) {
      localImage = "/images/products/mavic-3-enterprise.jpg";
    }
    // Mavic 2 Pro/Zoom
    else if (name.includes("mavic 2 pro") || name.includes("mavic 2 zoom") || name.includes("mavic 2/")) {
      localImage = "/images/products/mavic-2-pro.jpg";
    }
    // Autel Alpha
    else if (name.includes("autel") && name.includes("alpha")) {
      localImage = "/images/products/autel-alpha.jpg";
    }
    // Autel EVO 2
    else if (name.includes("autel") && name.includes("evo 2")) {
      localImage = "/images/products/autel-evo-2.jpg";
    }
    // Autel EVO Max/4T
    else if (name.includes("autel") && (name.includes("max 4t") || name.includes("evo max"))) {
      localImage = "/images/products/autel-max-4t.png";
    } else if (name.includes("autel") && name.includes("ładowarka")) {
      localImage = "/images/products/autel-charger.jpg";
    } else if (name.includes("autel") && (name.includes("śmigło") || name.includes("hub"))) {
      localImage = "/images/products/autel-max-4t.png";
    } else if (name.includes("autel")) {
      localImage = "/images/products/autel-max-4t.png";
    }
    // XAG
    else if (name.includes("xag p100") && name.includes("kompletny")) {
      localImage = "/images/products/xag-p100-set.jpg";
    } else if (name.includes("xag p100") || name.includes("xag p150")) {
      localImage = "/images/products/xag-p100.jpg";
    } else if (name.includes("xag") && name.includes("akumulator")) {
      localImage = "/images/products/xag-battery.jpg";
    } else if (name.includes("xag") && name.includes("gc4000")) {
      localImage = "/images/products/xag-gc4000.jpg";
    } else if (name.includes("xag") && name.includes("arc3")) {
      localImage = "/images/products/xag-arc3.jpg";
    } else if (name.includes("xag") && name.includes("revospray")) {
      localImage = "/images/products/xag-revospray.jpg";
    } else if (name.includes("xag") && name.includes("revocast")) {
      localImage = "/images/products/xag-revocast.jpg";
    } else if (name.includes("xag") && name.includes("rtk")) {
      localImage = "/images/products/xag-rtk.jpg";
    } else if (name.includes("xag") && name.includes("statyw")) {
      localImage = "/images/products/xag-tripod.jpg";
    } else if (name.includes("xag")) {
      localImage = "/images/products/xag-p100.jpg";
    }
    // Phantom 4
    else if (name.includes("phantom 4") || name.includes("phantom4")) {
      localImage = "/images/products/phantom-4.jpg";
    }
    // Inspire
    else if (name.includes("inspire 2") || name.includes("inspire2")) {
      localImage = "/images/products/inspire-2.jpg";
    } else if (name.includes("inspire")) {
      localImage = "/images/products/inspire-2.jpg";
    }
    // DJI Flip
    else if (name.includes("flip")) {
      localImage = "/images/products/dji-flip.jpg";
    }
    // DJI Neo
    else if (name.includes("neo")) {
      localImage = "/images/products/dji-neo.jpg";
    }
    // DJI Care
    else if (name.includes("care refresh") || name.includes("dji care")) {
      localImage = "/images/products/dji-care.jpg";
    }
    // FPV
    else if (name.includes("fpv") && name.includes("motion")) {
      localImage = "/images/products/dji-fpv-controller.jpg";
    } else if (name.includes("fpv")) {
      localImage = "/images/products/dji-fpv.jpg";
    }
    // Avata 2
    else if (name.includes("avata 2") && name.includes("akumulator")) {
      localImage = "/images/products/dji-avata-battery.jpg";
    } else if (name.includes("avata 2")) {
      localImage = "/images/products/dji-avata-2.jpg";
    }
    // Avata
    else if (name.includes("avata")) {
      localImage = "/images/products/dji-avata.jpg";
    }
    // Goggles
    else if (name.includes("goggles")) {
      localImage = "/images/products/dji-avata.jpg";
    }
    // RC/Controllers
    else if (name.includes("rc pro") || name.includes("rc 2") || name.includes("kontroler") || name.includes("rc-n")) {
      localImage = "/images/products/dji-rc.jpg";
    }
    // Agras (agricultural)
    else if (name.includes("agras")) {
      localImage = "/images/products/xag-p100.jpg";
    }
    // Default DJI fallback
    else if (name.includes("dji")) {
      localImage = "/images/products/dji-care.jpg";
    }

    if (localImage && product.images.length > 0) {
      // Check if local file exists
      const localPath = path.join(process.cwd(), "public", localImage);
      if (fs.existsSync(localPath)) {
        await prisma.productImage.update({
          where: { id: product.images[0].id },
          data: { url: localImage }
        });
        console.log(`✅ ${product.name} -> ${localImage}`);
        updated++;
      } else {
        console.log(`⏭️ File not found: ${localImage}`);
      }
    }
  }

  console.log(`\n✅ Updated ${updated} products in database`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
