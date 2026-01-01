import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// All broken URLs will be replaced with the logo fallback
// since most external CDN URLs are blocked

// Default fallback for any remaining broken images
const defaultFallback = "https://drone-partss.com/wp-content/uploads/2024/11/LogoDrone.png";

async function main() {
  console.log("Fixing broken image URLs...\n");

  // Get all images with problematic URLs
  const images = await prisma.productImage.findMany({
    where: {
      OR: [
        { url: { contains: "djicdn" } },
        { url: { contains: "se-cdn.djiits" } },
        { url: { contains: "auteldrones" } },
        { url: { contains: "westerndigital" } },
      ]
    },
    include: {
      product: true
    }
  });

  console.log(`Found ${images.length} images to fix\n`);

  let fixed = 0;

  for (const image of images) {
    await prisma.productImage.update({
      where: { id: image.id },
      data: { url: defaultFallback }
    });

    console.log(`Fixed: ${image.product.name}`);
    fixed++;
  }

  console.log(`✅ Fixed ${fixed} image URLs`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
