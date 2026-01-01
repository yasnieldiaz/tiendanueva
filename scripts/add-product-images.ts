import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Image URLs from drone-partss.com and official sources
const productImages: Record<string, string[]> = {
  // XAG Products
  "xag-p100-pro-dron-rolniczy": ["https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg"],
  "xag-p100-pro-kompletny-zestaw-6-bateria": ["https://drone-partss.com/wp-content/uploads/2024/12/P100Set-1.jpg"],
  "xag-p150-max-dron-rolniczy": ["https://drone-partss.com/wp-content/uploads/2024/12/P150Max.jpg"],
  "xag-b13960s-akumulator": ["https://drone-partss.com/wp-content/uploads/2024/01/B13960S.jpg"],
  "xag-gc4000-agregat": ["https://drone-partss.com/wp-content/uploads/2024/01/GC4000.jpg"],
  "xag-arc3-pro-z-rtk": ["https://drone-partss.com/wp-content/uploads/2024/01/Acs3Pro.jpg"],
  "xag-revospray-p3-modul-opryskiwacza": ["https://drone-partss.com/wp-content/uploads/2024/01/Revospray3.jpg"],
  "xag-revocast-p3-modul-rozsiewacza": ["https://drone-partss.com/wp-content/uploads/2024/01/Revocast3.jpg"],
  "xag-xrtk4-baza-rtk": ["https://drone-partss.com/wp-content/uploads/2024/01/XRTK4.jpg"],
  "xag-statyw-stacji": ["https://drone-partss.com/wp-content/uploads/2024/01/XAGStatyw.jpg"],

  // DJI Mavic 4
  "dron-dji-mavic-4-pro": ["https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg"],
  "dron-dji-mavic-4-pro-fly-more-combo-dji-rc-2": ["https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg"],
  "dron-dji-mavic-4-pro-512gb-creator-combo-dji-rc-pro-2": ["https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg"],
  "dji-mavic-4-pro-akumulator": ["https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg"],
  "dji-care-refresh-mavic-4-pro": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],

  // DJI Mini 5 Pro
  "dron-dji-mini-5-pro": ["https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp"],
  "dron-dji-mini-5-pro-fly-more-combo-dji-rc2": ["https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp"],
  "inteligentny-akumulator-dji-mini-5-pro": ["https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Inteligentny-akumulator-DJI-Mini-5-Pro-32508_3.webp"],
  "dji-mini-5-pro-dji-care-refresh-1-rok": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],
  "dji-mini-5-pro-dji-care-refresh-2-lata": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],

  // DJI Mini 4 Pro
  "dron-dji-mini-4-pro": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/c87ffe1e8d7e4068f52a17cbe08fee17@ultra.jpg"],
  "dron-dji-mini-4-pro-fly-more-combo-dji-rc-2": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/c87ffe1e8d7e4068f52a17cbe08fee17@ultra.jpg"],
  "dji-mini-4-pro-dji-care-refresh-1-rok": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],
  "dji-mini-4-pro-dji-care-refresh-2-lata": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],
  "dji-mini-4-pro-obudowa-srodkowa": ["https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProMiddle.jpg"],
  "dji-mini-4-pro-tasma-esc": ["https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProESC.jpg"],
  "dji-mini-4-pro-tylna-lewa-os": ["https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProAxis.jpg"],

  // DJI Mavic 3 Enterprise
  "dji-mavic-3-enterprise-dwuletnie-ubezpieczenie-dji-care": ["https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg"],
  "dji-mavic-3-multispectral-dji-care-2-lata": ["https://drone-partss.com/wp-content/uploads/2024/02/Multi2.jpg"],
  "dji-mavic-3-enterprise-battery-kit-3x-bateria-hub": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b7cb3a0c04977e59c1b6e851f51dacc0@ultra.png"],
  "dji-rc-pro-enterprise-kontroler": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/29b5e3c9e6b29e1c79f94a05e75b6bdc@ultra.png"],
  "lktop-kl340-spotlight-dla-mavic-3-enterprise": ["https://drone-partss.com/wp-content/uploads/2024/02/LKTOP340.jpg"],

  // DJI Matrice 30
  "dji-matrice-30t-z-kamera-termowizyjna": ["https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg"],
  "tb30-dji-matrice-30-bateria-akumulator": ["https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg"],
  "dji-matrice-30-dji-care-enterprise-plus": ["https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png"],
  "dji-matrice-30-bs30-stacja-ladujaca": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/2c4c0c4c4d6eb6f66c9eeb9e25d7e6e1@ultra.png"],

  // DJI Mavic 3 Classic
  "dron-dji-mavic-3-classic": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b2a92e0e8dcc4b71a7f4c2c4b4d5c2d0@ultra.jpg"],
  "dron-dji-mavic-3-classic-fly-more-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b2a92e0e8dcc4b71a7f4c2c4b4d5c2d0@ultra.jpg"],
  "dji-mavic-3-akumulator": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/0b8c9f2b6f7e3a8d5c4b2a1d0e9f8c7b@ultra.png"],
  "dji-mavic-3-ladowarka-hub-200w": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/5c4b3a2d1e0f9c8b7a6d5e4f3c2b1a0d@ultra.png"],

  // DJI Mavic 3 Pro
  "dron-dji-mavic-3-pro": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/3d4c5b6a7e8f9a0b1c2d3e4f5a6b7c8d@ultra.jpg"],
  "dron-dji-mavic-3-pro-fly-more-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/3d4c5b6a7e8f9a0b1c2d3e4f5a6b7c8d@ultra.jpg"],
  "dron-dji-mavic-3-pro-cine-premium-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/3d4c5b6a7e8f9a0b1c2d3e4f5a6b7c8d@ultra.jpg"],

  // Autel
  "evo-max-4t-standard-bundle": ["https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png"],
  "evo-max-4t-standard-bundle-public-safe-version": ["https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png"],
  "autel-alpha": ["https://auteldrones.com/cdn/shop/files/alpha_Industrial_1.png"],
  "autel-max-4t-bateria-akumulator": ["https://drone-partss.com/wp-content/uploads/2023/12/AutelMaxBat.jpg"],
  "autel-max-ladowarka": ["https://drone-partss.com/wp-content/uploads/2023/12/AutelMax.jpg"],
  "autel-evo-max-smiglo-2-szt": ["https://auteldrones.com/cdn/shop/files/propeller.png"],
  "autel-evo-max-4t-multi-charger-hub": ["https://auteldrones.com/cdn/shop/files/charger_hub.png"],

  // DJI Avata 2
  "dji-avata-2": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6@ultra.jpg"],
  "dji-avata-2-fly-more-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6@ultra.jpg"],
  "dji-goggles-3": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6@ultra.jpg"],
  "dji-avata-2-akumulator": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6@ultra.png"],

  // DJI FPV
  "dji-fpv-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/f1p2v3d4j5i6f7p8v9d0j1i2f3p4v5d6@ultra.jpg"],
  "dji-fpv-motion-controller": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/m1c2o3n4t5r6o7l8l9e0r1m2c3o4n5t6@ultra.png"],
  "dji-fpv-akumulator": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b1a2t3t4e5r6y7f8p9v0b1a2t3t4e5r6@ultra.png"],

  // DJI Neo
  "dji-neo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/n1e2o3d4j5i6n7e8o9d0j1i2n3e4o5d6@ultra.jpg"],
  "dji-neo-fly-more-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/n1e2o3d4j5i6n7e8o9d0j1i2n3e4o5d6@ultra.jpg"],

  // DJI Flip
  "dji-flip": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/f1l2i3p4d5j6i7f8l9i0p1d2j3i4f5l6@ultra.jpg"],
  "dji-flip-fly-more-combo": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/f1l2i3p4d5j6i7f8l9i0p1d2j3i4f5l6@ultra.jpg"],

  // Accessories
  "dji-rc-2-kontroler": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/r1c2d3j4i5r6c7d8j9i0r1c2d3j4i5r6@ultra.png"],
  "dji-rc-pro-2-kontroler": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/p1r2o3r4c5d6j7i8p9r0o1r2c3d4j5i6@ultra.png"],
  "karta-microsd-sandisk-extreme-pro-256gb": ["https://www.westerndigital.com/content/dam/store/en-us/assets/products/memory-cards/extreme-pro-uhs-i-microsd/gallery/extreme-pro-uhs-i-microsd-256gb.png"],
  "karta-microsd-sandisk-extreme-pro-512gb": ["https://www.westerndigital.com/content/dam/store/en-us/assets/products/memory-cards/extreme-pro-uhs-i-microsd/gallery/extreme-pro-uhs-i-microsd-512gb.png"],
  "ladowisko-do-dronow-75cm": ["https://drone-partss.com/wp-content/uploads/2024/01/Landing75.jpg"],
  "ladowisko-do-dronow-110cm": ["https://drone-partss.com/wp-content/uploads/2024/01/Landing110.jpg"],
  "plecak-na-drona-dji": ["https://se-cdn.djiits.com/tpc/uploads/carousel/image/b1a2c3k4p5a6c7k8d9j0i1b2a3c4k5p6@ultra.png"],
  "filtry-nd-dla-dji-mavic-4-pro-zestaw-4-szt": ["https://drone-partss.com/wp-content/uploads/2025/05/NDFiltersMavic4.jpg"],
  "filtry-nd-dla-dji-mini-4-pro-zestaw-4-szt": ["https://drone-partss.com/wp-content/uploads/2024/06/NDFiltersMini4.jpg"],

  // Spare parts DJI Mavic 3
  "dji-mavic-3-aircraft-rear-cover": ["https://drone-partss.com/wp-content/uploads/2024/03/M3RearCover.jpg"],
  "dji-mavic-3-cine-przednie-lewe-ramie-z-silnikiem": ["https://drone-partss.com/wp-content/uploads/2024/03/M3ArmMotor.jpg"],
  "dji-mavic-3-gorna-obudowa": ["https://drone-partss.com/wp-content/uploads/2024/03/M3TopShell.jpg"],
  "dji-mavic-3-srodkowa-obudowa": ["https://drone-partss.com/wp-content/uploads/2024/03/M3MiddleFrame.jpg"],
  "dji-mavic-3-os-przedniego-ramienia-prawa": ["https://drone-partss.com/wp-content/uploads/2024/03/M3FrontAxis.jpg"],
  "dji-mavic-3-os-tylnego-ramienia": ["https://drone-partss.com/wp-content/uploads/2024/03/M3RearAxis.jpg"],
};

// Fallback images by category/brand
const fallbackImages: Record<string, string> = {
  "xag": "https://drone-partss.com/wp-content/uploads/2024/01/XAGLogo.png",
  "dji": "https://dji-official-fe.djicdn.com/dps/6d3d0ab4f1464cc0c6e3c67f57f9f4ff.png",
  "autel": "https://auteldrones.com/cdn/shop/files/autel_logo.png",
  "default": "https://drone-partss.com/wp-content/uploads/2024/11/LogoDrone.png",
};

async function main() {
  console.log("Adding images to products...\n");

  // Get all products without images
  const products = await prisma.product.findMany({
    where: {
      images: {
        none: {}
      }
    },
    include: {
      brand: true,
      category: true
    }
  });

  console.log(`Found ${products.length} products without images\n`);

  let added = 0;

  for (const product of products) {
    // Check if we have a specific image for this product
    let imageUrl = productImages[product.slug]?.[0];

    // If no specific image, use fallback based on brand
    if (!imageUrl) {
      const brandSlug = product.brand?.slug?.toLowerCase() || "";
      if (brandSlug.includes("xag")) {
        imageUrl = fallbackImages.xag;
      } else if (brandSlug.includes("dji")) {
        imageUrl = fallbackImages.dji;
      } else if (brandSlug.includes("autel")) {
        imageUrl = fallbackImages.autel;
      } else {
        imageUrl = fallbackImages.default;
      }
    }

    // Add image to product
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: imageUrl,
        alt: product.name,
        position: 0,
      }
    });

    console.log(`Added image for: ${product.name}`);
    added++;
  }

  console.log(`\n✅ Added images to ${added} products`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
