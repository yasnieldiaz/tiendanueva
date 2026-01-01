import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Mapping of product names/slugs to real image URLs
const imageMapping: Record<string, string> = {
  // DJI Mavic 3 Pro
  "dron-dji-mavic-3-pro": "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3UpperVi.jpg",
  "dron-dji-mavic-3-pro-fly-more-combo": "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3UpperVi.jpg",
  "dron-dji-mavic-3-pro-cine-premium-combo": "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3UpperVi.jpg",

  // DJI Mavic 3 Classic
  "dron-dji-mavic-3-classic": "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",
  "dron-dji-mavic-3-classic-fly-more-combo": "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",

  // DJI Mini 4 Pro
  "dron-dji-mini-4-pro": "https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProMiddle.jpg",
  "dron-dji-mini-4-pro-fly-more-combo-dji-rc-2": "https://drone-partss.com/wp-content/uploads/2024/06/Mini4ProMiddle.jpg",
  "dji-mini-4-pro-dji-care-refresh-1-rok": "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg",
  "dji-mini-4-pro-dji-care-refresh-2-lata": "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg",

  // DJI Mini 5 Pro
  "dji-mini-5-pro-dji-care-refresh-1-rok": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp",
  "dji-mini-5-pro-dji-care-refresh-2-lata": "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp",

  // DJI Avata 2
  "dji-avata-2": "https://drone-partss.com/wp-content/uploads/2024/06/Avata1.jpg",
  "dji-avata-2-fly-more-combo": "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg",
  "dji-avata-2-akumulator": "https://drone-partss.com/wp-content/uploads/2025/09/pol_pl_Akumulator-bateria-DJI-Avata-2-42205_3.jpg",

  // DJI FPV
  "dji-fpv-combo": "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPVUpper.jpg",
  "dji-fpv-akumulator": "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPV.jpg",
  "dji-fpv-motion-controller": "https://drone-partss.com/wp-content/uploads/2024/01/FPVJostick.jpg",

  // DJI Neo
  "dji-neo": "https://drone-partss.com/wp-content/uploads/2025/03/NeoMotions.jpg",
  "dji-neo-fly-more-combo": "https://drone-partss.com/wp-content/uploads/2025/03/NeoMotions.jpg",

  // DJI Flip
  "dji-flip": "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg",
  "dji-flip-fly-more-combo": "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg",

  // DJI Goggles
  "dji-goggles-3": "https://drone-partss.com/wp-content/uploads/2024/06/Avata2Anticollitin.jpg",

  // DJI Controllers
  "dji-rc-2-kontroler": "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg",
  "dji-rc-pro-2-kontroler": "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg",
  "dji-rc-pro-enterprise-kontroler": "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg",

  // DJI Matrice 30
  "dji-matrice-30-bs30-stacja-ladujaca": "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg",
  "dji-matrice-30-dji-care-enterprise-plus": "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg",

  // DJI Mavic 3 Enterprise
  "dji-mavic-3-enterprise-battery-kit-3x-bateria-hub": "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",

  // DJI Mavic 3 Accessories
  "dji-mavic-3-akumulator": "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg",
  "dji-mavic-3-ladowarka-hub-200w": "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg",

  // DJI Care
  "dji-care-refresh-mavic-4-pro": "https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg",

  // Autel
  "autel-alpha": "https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png",
  "autel-evo-max-4t-multi-charger-hub": "https://drone-partss.com/wp-content/uploads/2023/12/AutelMax.jpg",
  "autel-evo-max-smiglo-2-szt": "https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png",

  // SD Cards
  "karta-microsd-sandisk-extreme-pro-256gb": "https://drone-partss.com/wp-content/uploads/2024/01/Landing75.jpg",
  "karta-microsd-sandisk-extreme-pro-512gb": "https://drone-partss.com/wp-content/uploads/2024/01/Landing75.jpg",

  // Backpack
  "plecak-na-drona-dji": "https://drone-partss.com/wp-content/uploads/2024/01/Landing110.jpg",
};

async function main() {
  console.log("Updating product images...\n");

  let updated = 0;

  for (const [slug, imageUrl] of Object.entries(imageMapping)) {
    // Find the product by slug
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    });

    if (!product) {
      console.log(`Product not found: ${slug}`);
      continue;
    }

    // Check if product has an image with the logo fallback
    const logoImage = product.images.find(img => img.url.includes("LogoDrone"));

    if (logoImage) {
      // Update the image
      await prisma.productImage.update({
        where: { id: logoImage.id },
        data: { url: imageUrl }
      });
      console.log(`✅ Updated: ${product.name}`);
      updated++;
    } else {
      console.log(`⏭️ Skipped (already has image): ${product.name}`);
    }
  }

  console.log(`\n✅ Updated ${updated} product images`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
