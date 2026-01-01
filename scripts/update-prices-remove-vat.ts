import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching all products...");

  const products = await prisma.product.findMany({
    select: { id: true, price: true, name: true }
  });

  console.log(`Found ${products.length} products to update\n`);

  const VAT_RATE = 1.23;
  let updated = 0;

  for (const product of products) {
    // Calculate net price (without VAT)
    const netPrice = Math.round((product.price / VAT_RATE) * 100) / 100;

    console.log(`${product.name}`);
    console.log(`  Old price (brutto): ${product.price.toFixed(2)} PLN`);
    console.log(`  New price (netto):  ${netPrice.toFixed(2)} PLN`);
    console.log(`  VAT saved:          ${(product.price - netPrice).toFixed(2)} PLN\n`);

    // Update product price
    await prisma.product.update({
      where: { id: product.id },
      data: { price: netPrice }
    });

    updated++;
  }

  console.log(`\n✅ Successfully updated ${updated} products!`);
  console.log("All prices are now NET (without VAT 23%)");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
