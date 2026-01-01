import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// Helper function to convert brutto to netto (remove 23% VAT)
const toNetto = (brutto: number) => Math.round((brutto / 1.23) * 100) / 100;

// All products from drone-partss.com organized by category
const products = [
  // ==================== XAG ====================
  {
    category: "XAG",
    categorySlug: "xag",
    brand: "XAG",
    items: [
      { name: "XAG P100 Pro Dron Rolniczy", price: 37058, sku: "09-007-00136", stock: 5, description: "Profesjonalny dron rolniczy XAG P100 Pro do precyzyjnego oprysków i rozsiewania nawozów." },
      { name: "XAG P100 Pro Kompletny zestaw 6 Bateria", price: 81073, sku: "XAG-P100-SET6", stock: 2, description: "Kompletny zestaw XAG P100 Pro z 6 bateriami i akcesoriami." },
      { name: "XAG P150 Max Dron Rolniczy", price: 52999, sku: "XAG-P150-MAX", stock: 3, description: "Największy dron rolniczy XAG P150 Max z podwyższoną pojemnością zbiornika." },
      { name: "XAG B13960S Akumulator", price: 6199, sku: "09-017-00025", stock: 10, description: "Akumulator o wysokiej pojemności do dronów XAG." },
      { name: "XAG GC4000+ Agregat", price: 6148, sku: "09-020-00016", stock: 8, description: "Stacja szybkiego ładowania Super Charging dla akumulatorów XAG." },
      { name: "XAG ARC3 Pro z RTK", price: 5062, sku: "09-016-00053", stock: 6, description: "Kontroler zdalnego sterowania z modułem RTK, bateria wewnętrzna, port ładowania." },
      { name: "XAG RevoSpray P3 Moduł opryskiwacza", price: 6370, sku: "09-023-00025", stock: 5, description: "Moduł opryskiwacza do precyzyjnego rozpylania środków ochrony roślin." },
      { name: "XAG RevoCast P3 Moduł rozsiewacza", price: 11472, sku: "09-023-00023", stock: 4, description: "Moduł rozsiewacza do nawozów granulowanych i nasion." },
      { name: "XAG XRTK4 Baza RTK", price: 6199, sku: "XAG-XRTK4", stock: 5, description: "Stacja bazowa RTK do precyzyjnej nawigacji dronów XAG." },
      { name: "XAG Statyw stacji", price: 890, sku: "XAG-STATYW", stock: 10, description: "Statyw do stacji bazowej RTK XAG." },
    ]
  },

  // ==================== DJI Mavic 4 ====================
  {
    category: "DJI Mavic 4",
    categorySlug: "dji-mavic-4",
    brand: "DJI",
    items: [
      { name: "Dron DJI Mavic 4 Pro", price: 9899, sku: "DJI-M4P", stock: 15, description: "Flagowy dron DJI Mavic 4 Pro z zaawansowaną kamerą Hasselblad." },
      { name: "Dron DJI Mavic 4 Pro Fly More Combo (DJI RC 2)", price: 12699, sku: "DJI-M4P-FMC", stock: 8, description: "Zestaw DJI Mavic 4 Pro z kontrolerem RC 2 i dodatkowymi akcesoriami." },
      { name: "Dron DJI Mavic 4 Pro 512GB Creator Combo (DJI RC Pro 2)", price: 16599, sku: "DJI-M4P-CC", stock: 0, description: "Zestaw Creator Combo z kontrolerem RC Pro 2 i 512GB pamięci." },
      { name: "DJI Mavic 4 Pro Akumulator", price: 959, sku: "DJI-M4P-BAT", stock: 0, description: "Oryginalny akumulator do DJI Mavic 4 Pro." },
      { name: "DJI Care Refresh Mavic 4 Pro", price: 1149, sku: "DJI-M4P-CARE", stock: 50, description: "Ubezpieczenie DJI Care Refresh dla Mavic 4 Pro." },
    ]
  },

  // ==================== DJI Mini 5 Pro ====================
  {
    category: "DJI Mini 5 Pro",
    categorySlug: "dji-mini-5-pro",
    brand: "DJI",
    items: [
      { name: "Dron DJI Mini 5 Pro", price: 3999, sku: "DJI-M5P", stock: 10, description: "Ultralekki dron DJI Mini 5 Pro poniżej 249g z zaawansowaną kamerą." },
      { name: "Dron DJI Mini 5 Pro Fly More Combo (DJI RC2)", price: 4800, sku: "DJI-M5P-FMC", stock: 8, description: "Zestaw Fly More Combo z kontrolerem RC2 i dodatkowymi bateriami." },
      { name: "Inteligentny akumulator DJI Mini 5 Pro", price: 359, sku: "DJI-M5P-BAT", stock: 20, description: "Oryginalny inteligentny akumulator do DJI Mini 5 Pro." },
      { name: "DJI Mini 5 Pro DJI Care Refresh (1 rok)", price: 399, sku: "DJI-M5P-CARE1", stock: 50, description: "Roczne ubezpieczenie DJI Care Refresh." },
      { name: "DJI Mini 5 Pro DJI Care Refresh (2 lata)", price: 649, sku: "DJI-M5P-CARE2", stock: 50, description: "Dwuletnie ubezpieczenie DJI Care Refresh." },
    ]
  },

  // ==================== DJI Mini 4 Pro ====================
  {
    category: "DJI Mini 4 Pro",
    categorySlug: "dji-mini-4-pro",
    brand: "DJI",
    items: [
      { name: "Dron DJI Mini 4 Pro", price: 3499, sku: "DJI-M4P-MINI", stock: 12, description: "Ultralekki dron DJI Mini 4 Pro z zaawansowanymi funkcjami unikania przeszkód." },
      { name: "Dron DJI Mini 4 Pro Fly More Combo (DJI RC 2)", price: 4599, sku: "DJI-M4P-MINI-FMC", stock: 6, description: "Zestaw Fly More Combo z kontrolerem RC 2." },
      { name: "DJI Mini 4 Pro DJI Care Refresh (1 rok)", price: 425, sku: "DJI-M4P-CARE1", stock: 0, description: "Roczne ubezpieczenie DJI Care Refresh." },
      { name: "DJI Mini 4 Pro DJI Care Refresh (2 lata)", price: 699, sku: "DJI-M4P-CARE2", stock: 50, description: "Dwuletnie ubezpieczenie DJI Care Refresh." },
      { name: "DJI Mini 4 Pro Obudowa Środkowa", price: 50, sku: "DJI-M4P-MID", stock: 15, description: "Część zamienna - obudowa środkowa." },
      { name: "DJI Mini 4 Pro Taśma ESC", price: 84, sku: "DJI-M4P-ESC", stock: 10, description: "Część zamienna - taśma ESC." },
      { name: "DJI Mini 4 Pro Tylna lewa oś", price: 75, sku: "DJI-M4P-AXIS", stock: 12, description: "Część zamienna - tylna lewa oś." },
    ]
  },

  // ==================== DJI Mavic 3 Enterprise ====================
  {
    category: "DJI Mavic 3 Enterprise",
    categorySlug: "dji-mavic-3-enterprise",
    brand: "DJI",
    items: [
      { name: "DJI Mavic 3 Enterprise + dwuletnie ubezpieczenie (DJI Care)", price: 16199, sku: "DJI-M3E-CARE", stock: 3, description: "Profesjonalny dron enterprise z dwuletnim ubezpieczeniem DJI Care." },
      { name: "DJI Mavic 3 Multispectral + DJI Care 2 lata", price: 21299, sku: "DJI-M3M-CARE", stock: 2, description: "Dron multispektralny do rolnictwa precyzyjnego z ubezpieczeniem." },
      { name: "DJI Mavic 3 Enterprise Battery Kit (3x bateria, hub)", price: 2729, sku: "DJI-M3E-BATKIT", stock: 0, description: "Zestaw 3 baterii z hubem ładującym." },
      { name: "DJI RC Pro Enterprise Kontroler", price: 4784, sku: "DJI-RCPRO-E", stock: 0, description: "Profesjonalny kontroler RC Pro Enterprise." },
      { name: "LKTOP KL340 SpotLight dla Mavic 3 Enterprise", price: 2980, sku: "LKTOP-KL340", stock: 0, description: "Reflektor LKTOP do operacji nocnych." },
    ]
  },

  // ==================== DJI Matrice 30 ====================
  {
    category: "DJI Matrice 30",
    categorySlug: "dji-m30t",
    brand: "DJI",
    items: [
      { name: "DJI Matrice 30T z kamerą termowizyjną", price: 42599, sku: "DJI-M30T", stock: 2, description: "Profesjonalny dron enterprise z kamerą termowizyjną do misji SAR i inspekcji." },
      { name: "TB30 DJI Matrice 30 Bateria akumulator", price: 1599, sku: "DJI-M30-BAT", stock: 8, description: "Oryginalny akumulator TB30 do DJI Matrice 30." },
      { name: "DJI Matrice 30 DJI Care Enterprise Plus", price: 5999, sku: "DJI-M30-CARE", stock: 10, description: "Rozszerzone ubezpieczenie enterprise." },
      { name: "DJI Matrice 30 BS30 Stacja ładująca", price: 4299, sku: "DJI-M30-BS30", stock: 3, description: "Inteligentna stacja ładująca BS30." },
    ]
  },

  // ==================== DJI Mavic 3 Classic ====================
  {
    category: "DJI Mavic 3 Classic",
    categorySlug: "dji-mavic-3-classic",
    brand: "DJI",
    items: [
      { name: "Dron DJI Mavic 3 Classic", price: 6499, sku: "DJI-M3C", stock: 5, description: "DJI Mavic 3 Classic z kamerą Hasselblad 4/3 CMOS." },
      { name: "Dron DJI Mavic 3 Classic Fly More Combo", price: 7999, sku: "DJI-M3C-FMC", stock: 3, description: "Zestaw Fly More Combo z dodatkowymi bateriami i akcesoriami." },
      { name: "DJI Mavic 3 Akumulator", price: 699, sku: "DJI-M3-BAT", stock: 15, description: "Oryginalny akumulator do serii DJI Mavic 3." },
      { name: "DJI Mavic 3 Ładowarka Hub 200W", price: 650, sku: "DJI-M3-HUB", stock: 0, description: "Hub ładujący 200W do szybkiego ładowania baterii." },
    ]
  },

  // ==================== DJI Mavic 3 Pro ====================
  {
    category: "DJI Mavic 3 Pro",
    categorySlug: "dji-mavic-3-pro",
    brand: "DJI",
    items: [
      { name: "Dron DJI Mavic 3 Pro", price: 8999, sku: "DJI-M3PRO", stock: 4, description: "DJI Mavic 3 Pro z potrójną kamerą Hasselblad." },
      { name: "Dron DJI Mavic 3 Pro Fly More Combo", price: 10999, sku: "DJI-M3PRO-FMC", stock: 2, description: "Zestaw Fly More Combo z kontrolerem i bateriami." },
      { name: "Dron DJI Mavic 3 Pro Cine Premium Combo", price: 14999, sku: "DJI-M3PRO-CINE", stock: 1, description: "Zestaw Cine Premium z SSD 1TB i Apple ProRes." },
    ]
  },

  // ==================== Autel Robotics ====================
  {
    category: "Autel Robotics",
    categorySlug: "autel-robotics",
    brand: "Autel",
    items: [
      { name: "EVO MAX 4T Standard Bundle", price: 42500, sku: "AUTEL-MAX4T", stock: 0, description: "Profesjonalny dron Autel EVO MAX 4T z kamerą termowizyjną i zoom 640x." },
      { name: "EVO MAX 4T Standard Bundle Public Safe Version", price: 42500, sku: "AUTEL-MAX4T-PS", stock: 0, description: "Wersja Public Safety dla służb ratunkowych." },
      { name: "Autel Alpha", price: 90209, sku: "AUTEL-ALPHA", stock: 1, description: "Flagowy dron Autel Alpha do profesjonalnych zastosowań." },
      { name: "Autel Max 4T Bateria Akumulator", price: 1699, sku: "AUTEL-MAX-BAT", stock: 0, description: "Oryginalny akumulator do Autel EVO MAX 4T." },
      { name: "Autel Max Ładowarka", price: 555, sku: "AUTEL-MAX-CHAR", stock: 5, description: "Ładowarka do akumulatorów Autel MAX." },
      { name: "Autel EVO Max Śmigło (2 szt.)", price: 99, sku: "AUTEL-MAX-PROP", stock: 0, description: "Zestaw 2 śmigieł do Autel EVO MAX." },
      { name: "Autel EVO Max 4T Multi Charger Hub", price: 1199, sku: "AUTEL-MAX-HUB", stock: 0, description: "Hub do ładowania wielu baterii jednocześnie." },
    ]
  },

  // ==================== DJI Avata 2 ====================
  {
    category: "DJI Avata 2",
    categorySlug: "dji-avata-2",
    brand: "DJI",
    items: [
      { name: "DJI Avata 2", price: 2199, sku: "DJI-AVATA2", stock: 8, description: "Dron FPV DJI Avata 2 do immersyjnych lotów." },
      { name: "DJI Avata 2 Fly More Combo", price: 3299, sku: "DJI-AVATA2-FMC", stock: 5, description: "Zestaw Fly More Combo z goglami i kontrolerem." },
      { name: "DJI Goggles 3", price: 2499, sku: "DJI-GOGGLES3", stock: 6, description: "Gogle FPV DJI Goggles 3 z ekranami Micro-OLED." },
      { name: "DJI Avata 2 Akumulator", price: 459, sku: "DJI-AVATA2-BAT", stock: 20, description: "Oryginalny akumulator do DJI Avata 2." },
    ]
  },

  // ==================== DJI FPV ====================
  {
    category: "DJI FPV",
    categorySlug: "dji-fpv",
    brand: "DJI",
    items: [
      { name: "DJI FPV Combo", price: 4999, sku: "DJI-FPV-COMBO", stock: 3, description: "Zestaw DJI FPV z goglami V2 i kontrolerem." },
      { name: "DJI FPV Motion Controller", price: 599, sku: "DJI-FPV-MC", stock: 10, description: "Kontroler ruchu do intuicyjnego sterowania." },
      { name: "DJI FPV Akumulator", price: 649, sku: "DJI-FPV-BAT", stock: 15, description: "Oryginalny akumulator do DJI FPV." },
    ]
  },

  // ==================== DJI Neo ====================
  {
    category: "DJI Neo",
    categorySlug: "dji-neo",
    brand: "DJI",
    items: [
      { name: "DJI Neo", price: 899, sku: "DJI-NEO", stock: 15, description: "Kompaktowy dron do selfie i vlogów z kontrolą gestami." },
      { name: "DJI Neo Fly More Combo", price: 1299, sku: "DJI-NEO-FMC", stock: 10, description: "Zestaw Fly More z dodatkowymi bateriami i akcesoriami." },
    ]
  },

  // ==================== DJI Flip ====================
  {
    category: "DJI Flip",
    categorySlug: "dji-flip",
    brand: "DJI",
    items: [
      { name: "DJI Flip", price: 2199, sku: "DJI-FLIP", stock: 8, description: "Składany dron DJI Flip z osłonami śmigieł." },
      { name: "DJI Flip Fly More Combo", price: 2999, sku: "DJI-FLIP-FMC", stock: 5, description: "Zestaw Fly More Combo z dodatkowymi bateriami." },
    ]
  },

  // ==================== Akcesoria ====================
  {
    category: "Akcesoria",
    categorySlug: "akcesoria",
    brand: null,
    items: [
      { name: "DJI RC 2 Kontroler", price: 1299, sku: "DJI-RC2", stock: 10, description: "Kontroler DJI RC 2 z wbudowanym ekranem." },
      { name: "DJI RC Pro 2 Kontroler", price: 2999, sku: "DJI-RCPRO2", stock: 5, description: "Profesjonalny kontroler DJI RC Pro 2." },
      { name: "Karta microSD SanDisk Extreme PRO 256GB", price: 199, sku: "SDXC-256", stock: 30, description: "Karta pamięci do dronów i kamer." },
      { name: "Karta microSD SanDisk Extreme PRO 512GB", price: 349, sku: "SDXC-512", stock: 20, description: "Karta pamięci wysokiej pojemności." },
      { name: "Lądowisko do dronów 75cm", price: 129, sku: "LANDING-75", stock: 25, description: "Składane lądowisko o średnicy 75cm." },
      { name: "Lądowisko do dronów 110cm", price: 199, sku: "LANDING-110", stock: 15, description: "Duże składane lądowisko o średnicy 110cm." },
      { name: "Plecak na drona DJI", price: 599, sku: "DJI-BACKPACK", stock: 10, description: "Oficjalny plecak DJI na drona i akcesoria." },
      { name: "Filtry ND dla DJI Mavic 4 Pro (zestaw 4 szt.)", price: 399, sku: "ND-M4P-SET", stock: 12, description: "Zestaw filtrów ND8/16/32/64." },
      { name: "Filtry ND dla DJI Mini 4 Pro (zestaw 4 szt.)", price: 299, sku: "ND-M4PMINI-SET", stock: 15, description: "Zestaw filtrów ND8/16/32/64." },
    ]
  },

  // ==================== Części zamienne DJI Mavic 3 ====================
  {
    category: "Części DJI Mavic 3",
    categorySlug: "czesci-dji-mavic-3",
    brand: "DJI",
    items: [
      { name: "DJI Mavic 3 Aircraft Rear Cover", price: 35, sku: "YC.JG.ZS001379.05", stock: 7, description: "Tylna pokrywa drona." },
      { name: "DJI Mavic 3 Cine Przednie lewe ramię z silnikiem", price: 190, sku: "BC.MA.SS000415.01", stock: 0, description: "Część zamienna - ramię z silnikiem." },
      { name: "DJI Mavic 3 Górna obudowa", price: 89, sku: "BC.MA.SS000410.01", stock: 0, description: "Część zamienna - górna obudowa." },
      { name: "DJI Mavic 3 Środkowa obudowa", price: 83, sku: "BC.MA.SS000411.01", stock: 0, description: "Część zamienna - środkowa obudowa." },
      { name: "DJI Mavic 3 Oś Przedniego Ramienia Prawa", price: 49, sku: "YC.JG.HG000008.03", stock: 5, description: "Część zamienna - oś przedniego ramienia." },
      { name: "DJI Mavic 3 Oś Tylnego Ramienia", price: 59, sku: "YC.JG.HG0000009.04", stock: 4, description: "Część zamienna - oś tylnego ramienia." },
    ]
  },
];

async function main() {
  console.log("Starting product import...\n");

  // First, ensure categories and brands exist
  const categoryMap = new Map<string, string>();
  const brandMap = new Map<string, string>();

  // Create/get brands
  const brandNames = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[];
  for (const brandName of brandNames) {
    const slug = brandName.toLowerCase().replace(/\s+/g, "-");
    let brand = await prisma.brand.findUnique({ where: { slug } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName, slug }
      });
      console.log(`Created brand: ${brandName}`);
    }
    brandMap.set(brandName, brand.id);
  }

  // Create/get categories
  for (const productGroup of products) {
    let category = await prisma.category.findUnique({ where: { slug: productGroup.categorySlug } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: productGroup.category, slug: productGroup.categorySlug }
      });
      console.log(`Created category: ${productGroup.category}`);
    }
    categoryMap.set(productGroup.categorySlug, category.id);
  }

  console.log("\nImporting products...\n");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const productGroup of products) {
    const categoryId = categoryMap.get(productGroup.categorySlug);
    const brandId = productGroup.brand ? brandMap.get(productGroup.brand) : null;

    for (const item of productGroup.items) {
      const slug = item.name
        .toLowerCase()
        .replace(/[ąàáâã]/g, "a")
        .replace(/[ęèéêë]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/[óòôõö]/g, "o")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ćç]/g, "c")
        .replace(/[ńñ]/g, "n")
        .replace(/[śş]/g, "s")
        .replace(/[źżž]/g, "z")
        .replace(/[łŁ]/g, "l")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const nettoPrice = toNetto(item.price);

      // Check if product already exists
      const existing = await prisma.product.findFirst({
        where: { OR: [{ slug }, { sku: item.sku }] }
      });

      if (existing) {
        // Update price if different
        if (existing.price !== nettoPrice || existing.stock !== item.stock) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              price: nettoPrice,
              stock: item.stock,
              categoryId,
              brandId,
            }
          });
          console.log(`Updated: ${item.name} - ${nettoPrice.toFixed(2)} zł netto`);
          updated++;
        } else {
          skipped++;
        }
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: item.name,
            slug,
            description: item.description,
            price: nettoPrice,
            sku: item.sku,
            stock: item.stock,
            isActive: true,
            categoryId,
            brandId,
          }
        });
        console.log(`Created: ${item.name} - ${nettoPrice.toFixed(2)} zł netto`);
        created++;
      }
    }
  }

  console.log(`\n✅ Import completed!`);
  console.log(`   Created: ${created} products`);
  console.log(`   Updated: ${updated} products`);
  console.log(`   Skipped: ${skipped} products (already up to date)`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
