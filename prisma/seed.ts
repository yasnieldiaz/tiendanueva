import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@drone-partss.com" },
    update: {},
    create: {
      email: "admin@drone-partss.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "dji" },
      update: {},
      create: { name: "DJI", slug: "dji", description: "World's leading drone manufacturer" },
    }),
    prisma.brand.upsert({
      where: { slug: "autel" },
      update: {},
      create: { name: "Autel Robotics", slug: "autel", description: "Professional imaging solutions" },
    }),
    prisma.brand.upsert({
      where: { slug: "xag" },
      update: {},
      create: { name: "XAG", slug: "xag", description: "Agricultural drone solutions" },
    }),
    prisma.brand.upsert({
      where: { slug: "fimi" },
      update: {},
      create: { name: "FIMI", slug: "fimi", description: "Affordable professional drones" },
    }),
  ]);
  console.log("✅ Brands created:", brands.length);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "batteries" },
      update: {},
      create: { name: "Batteries", slug: "batteries", description: "Drone batteries and chargers" },
    }),
    prisma.category.upsert({
      where: { slug: "propellers" },
      update: {},
      create: { name: "Propellers", slug: "propellers", description: "Replacement propellers" },
    }),
    prisma.category.upsert({
      where: { slug: "motors" },
      update: {},
      create: { name: "Motors", slug: "motors", description: "Drone motors and ESCs" },
    }),
    prisma.category.upsert({
      where: { slug: "cameras" },
      update: {},
      create: { name: "Cameras & Gimbals", slug: "cameras", description: "Cameras and gimbal systems" },
    }),
    prisma.category.upsert({
      where: { slug: "controllers" },
      update: {},
      create: { name: "Controllers", slug: "controllers", description: "Remote controllers" },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories", description: "Bags, filters, and more" },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Create products
  const products = [
    // DJI Products
    {
      name: "DJI Mavic 3 Intelligent Flight Battery",
      slug: "dji-mavic-3-battery",
      description: "5000 mAh LiPo 4S battery for DJI Mavic 3 series. Up to 46 minutes of flight time.",
      price: 199,
      comparePrice: 229,
      sku: "DJI-M3-BAT-001",
      stock: 50,
      brandSlug: "dji",
      categorySlug: "batteries",
      isFeatured: true,
    },
    {
      name: "DJI Mini 4 Pro Propellers (Set of 4)",
      slug: "dji-mini-4-pro-propellers",
      description: "Original replacement propellers for DJI Mini 4 Pro. Low noise design.",
      price: 29,
      sku: "DJI-M4P-PROP-001",
      stock: 100,
      brandSlug: "dji",
      categorySlug: "propellers",
    },
    {
      name: "DJI Mavic 3 Motor (CW)",
      slug: "dji-mavic-3-motor-cw",
      description: "Clockwise motor for DJI Mavic 3. Original replacement part.",
      price: 149,
      sku: "DJI-M3-MOT-CW",
      stock: 25,
      brandSlug: "dji",
      categorySlug: "motors",
    },
    {
      name: "DJI RC Controller",
      slug: "dji-rc-controller",
      description: "DJI RC with built-in 5.5-inch 1080p display. Compatible with Mavic 3 and Air series.",
      price: 299,
      comparePrice: 349,
      sku: "DJI-RC-001",
      stock: 30,
      brandSlug: "dji",
      categorySlug: "controllers",
      isFeatured: true,
    },
    {
      name: "DJI Mavic 3 Gimbal Camera Module",
      slug: "dji-mavic-3-gimbal-camera",
      description: "Complete gimbal camera assembly for DJI Mavic 3. Hasselblad camera system.",
      price: 599,
      sku: "DJI-M3-CAM-001",
      stock: 10,
      brandSlug: "dji",
      categorySlug: "cameras",
    },
    {
      name: "DJI ND Filter Set (ND4/8/16/32)",
      slug: "dji-nd-filter-set",
      description: "Professional ND filter set for DJI Mavic 3 and Air series.",
      price: 89,
      sku: "DJI-ND-SET-001",
      stock: 45,
      brandSlug: "dji",
      categorySlug: "accessories",
    },
    // Autel Products
    {
      name: "Autel EVO II Battery",
      slug: "autel-evo-ii-battery",
      description: "7100 mAh intelligent battery for Autel EVO II series. Up to 42 minutes flight time.",
      price: 179,
      sku: "AUT-E2-BAT-001",
      stock: 35,
      brandSlug: "autel",
      categorySlug: "batteries",
      isFeatured: true,
    },
    {
      name: "Autel EVO II Propellers (Pair)",
      slug: "autel-evo-ii-propellers",
      description: "Original propellers for Autel EVO II. Quick-release design.",
      price: 35,
      sku: "AUT-E2-PROP-001",
      stock: 60,
      brandSlug: "autel",
      categorySlug: "propellers",
    },
    {
      name: "Autel EVO II Motor Assembly",
      slug: "autel-evo-ii-motor",
      description: "Complete motor assembly with ESC for Autel EVO II.",
      price: 129,
      sku: "AUT-E2-MOT-001",
      stock: 20,
      brandSlug: "autel",
      categorySlug: "motors",
    },
    {
      name: "Autel Smart Controller SE",
      slug: "autel-smart-controller-se",
      description: "Smart controller with 6.4-inch AMOLED screen for Autel drones.",
      price: 449,
      sku: "AUT-SC-SE-001",
      stock: 15,
      brandSlug: "autel",
      categorySlug: "controllers",
    },
    // XAG Products
    {
      name: "XAG P100 Battery Pack",
      slug: "xag-p100-battery",
      description: "High-capacity battery for XAG P100 agricultural drone. 28000 mAh.",
      price: 899,
      sku: "XAG-P100-BAT-001",
      stock: 8,
      brandSlug: "xag",
      categorySlug: "batteries",
    },
    {
      name: "XAG P100 Propeller Set",
      slug: "xag-p100-propellers",
      description: "Industrial-grade propellers for XAG P100 series.",
      price: 149,
      sku: "XAG-P100-PROP-001",
      stock: 25,
      brandSlug: "xag",
      categorySlug: "propellers",
    },
    {
      name: "XAG Agricultural Spray System",
      slug: "xag-spray-system",
      description: "Complete spray system for XAG agricultural drones.",
      price: 599,
      sku: "XAG-SPRAY-001",
      stock: 12,
      brandSlug: "xag",
      categorySlug: "accessories",
    },
    // FIMI Products
    {
      name: "FIMI X8 SE Battery",
      slug: "fimi-x8-se-battery",
      description: "4500 mAh intelligent battery for FIMI X8 SE. Up to 35 minutes flight.",
      price: 79,
      comparePrice: 99,
      sku: "FIMI-X8-BAT-001",
      stock: 45,
      brandSlug: "fimi",
      categorySlug: "batteries",
      isFeatured: true,
    },
    {
      name: "FIMI X8 SE Propellers",
      slug: "fimi-x8-se-propellers",
      description: "Original propellers for FIMI X8 SE series. Set of 4.",
      price: 19,
      sku: "FIMI-X8-PROP-001",
      stock: 80,
      brandSlug: "fimi",
      categorySlug: "propellers",
    },
    {
      name: "FIMI X8 SE Gimbal Camera",
      slug: "fimi-x8-se-gimbal",
      description: "3-axis gimbal camera module for FIMI X8 SE. 4K video.",
      price: 249,
      sku: "FIMI-X8-CAM-001",
      stock: 18,
      brandSlug: "fimi",
      categorySlug: "cameras",
    },
  ];

  for (const product of products) {
    const brand = brands.find(b => b.slug === product.brandSlug);
    const category = categories.find(c => c.slug === product.categorySlug);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || null,
        sku: product.sku,
        stock: product.stock,
        brandId: brand?.id,
        categoryId: category?.id,
        isFeatured: product.isFeatured || false,
        isActive: true,
      },
    });
  }
  console.log("✅ Products created:", products.length);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
