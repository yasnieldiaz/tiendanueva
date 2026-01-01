import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Products that should be featured (main drones)
const featuredProducts = [
  "Dron DJI Mavic 4 Pro",
  "Dron DJI Mavic 4 Pro Fly More Combo",
  "Dron DJI Mini 5 Pro",
  "Dron DJI Mini 5 Pro Fly More Combo",
  "DJI Mini 4 Pro",
  "DJI Mini 4 Pro Fly More Combo",
  "Dron DJI Mavic 3 Pro",
  "DJI Mavic 3 Enterprise",
  "EVO MAX 4T Standard Bundle",
  "Autel Alpha",
  "XAG P100 Pro Dron Rolniczy",
  "XAG P150 Max Dron Rolniczy",
  "DJI FPV Combo",
  "Dron DJI Avata 2",
  "DJI Neo",
  "DJI Flip",
  "DJI Matrice 30T",
  "Dron DJI Matrice 350 RTK",
];

async function main() {
  console.log("Updating featured products...\n");

  // First, unfeatured all products
  await prisma.product.updateMany({
    data: { isFeatured: false }
  });

  // Then, feature specific products
  for (const name of featuredProducts) {
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: name
        }
      }
    });

    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { isFeatured: true }
      });
      console.log(`✅ Featured: ${product.name}`);
    } else {
      console.log(`⏭️ Not found: ${name}`);
    }
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
