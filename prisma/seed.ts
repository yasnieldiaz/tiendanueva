import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing products and images
  await prisma.productImage.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  console.log("🗑️ Cleared existing data");

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
    prisma.brand.create({
      data: { name: "DJI", slug: "dji", description: "World's leading drone manufacturer" },
    }),
    prisma.brand.create({
      data: { name: "Autel Robotics", slug: "autel", description: "Professional imaging solutions" },
    }),
    prisma.brand.create({
      data: { name: "XAG", slug: "xag", description: "Agricultural drone solutions" },
    }),
  ]);
  console.log("✅ Brands created:", brands.length);

  // Create categories matching drone-partss.com
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "DJI Mavic 4", slug: "dji-mavic-4", description: "DJI Mavic 4 Series" },
    }),
    prisma.category.create({
      data: { name: "DJI Mini 5 Pro", slug: "dji-mini-5-pro", description: "DJI Mini 5 Pro Series" },
    }),
    prisma.category.create({
      data: { name: "DJI Mavic 3 Enterprise", slug: "dji-mavic-3-enterprise", description: "DJI Enterprise drones" },
    }),
    prisma.category.create({
      data: { name: "DJI M30T", slug: "dji-m30t", description: "DJI Matrice 30T Series" },
    }),
    prisma.category.create({
      data: { name: "Autel Max 4T", slug: "autel-max-4t", description: "Autel EVO Max 4T Series" },
    }),
    prisma.category.create({
      data: { name: "XAG", slug: "xag", description: "XAG Agricultural Drones" },
    }),
    prisma.category.create({
      data: { name: "Akcesoria", slug: "akcesoria", description: "Accessories" },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Products from drone-partss.com with PLN prices
  const products = [
    // DJI Mavic 4 Series
    {
      name: "Dron DJI Mavic 4 Pro",
      slug: "dron-dji-mavic-4-pro",
      description: "Profesjonalny dron z kamerą Hasselblad 100 MP, podwójnymi teleobiektywami z dużymi matrycami CMOS i innowacyjnym gimbalem 360° Infinity. Główna kamera: 4/3 CMOS, 100 MP, wideo 6K/60FPS HDR. Średni teleobiektyw: 48 MP, matryca 1/1.3\", f/2.8, 70mm. Teleobiektyw: 50 MP, matryca 1/1.5\", f/2.8. Maksymalny czas lotu: 51 minut. Prędkość maksymalna: 90 km/h. Zasięg: do 15 km (O4+). ActiveTrack 360° z rozszerzonym widzeniem nocnym (do 0.1 lux). Wbudowana pamięć 64 GB. Wi-Fi 6 do 80 MB/s.",
      price: 9899,
      sku: "6937224109933",
      stock: 62,
      brandSlug: "dji",
      categorySlug: "dji-mavic-4",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg",
      ],
    },
    {
      name: "Dron DJI Mavic 4 Pro Fly More Combo (DJI RC 2)",
      slug: "dron-dji-mavic-4-pro-fly-more-combo",
      description: "Kompletny zestaw Mavic 4 Pro z kontrolerem DJI RC 2, dodatkowymi bateriami, hubem ładującym i walizką transportową. Kamera Hasselblad 100MP, gimbal 360°, 51-minutowy czas lotu. Zawiera: dron, kontroler DJI RC 2, 3 baterie, hub do ładowania 3 baterii, zasilacz 100W, filtry ND, torba na ramię.",
      price: 12699,
      sku: "6937224109940",
      stock: 25,
      brandSlug: "dji",
      categorySlug: "dji-mavic-4",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg",
      ],
    },
    {
      name: "DJI Mavic 4 Pro Akumulator",
      slug: "dji-mavic-4-pro-akumulator",
      description: "Inteligentny akumulator do DJI Mavic 4 Pro - niezawodne rozwiązanie dla wymagających twórców. Pojemność 6654 mAh zapewnia około 51 minut lotu. Szybkie ładowanie z adapterem DJI Mavic 240W: pojedynczy akumulator w ok. 51 minut, trzy akumulatory w ok. 90 minut (200-240V) lub 110 minut (100-127V).",
      price: 959,
      sku: "6937224109872",
      stock: 0,
      brandSlug: "dji",
      categorySlug: "dji-mavic-4",
      images: [
        "https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg",
      ],
    },
    {
      name: "DJI Care Refresh Mavic 4 Pro",
      slug: "dji-care-refresh-mavic-4-pro",
      description: "Dwuletni kompleksowy plan ochrony dla DJI Mavic 4 Pro. Obejmuje przypadkowe uszkodzenia, uszkodzenia wodne i ochronę przed utratą drona.",
      price: 1149,
      sku: "6937224109728",
      stock: 100,
      brandSlug: "dji",
      categorySlug: "dji-mavic-4",
      images: [],
    },
    // DJI Mini 5 Pro Series
    {
      name: "Dron DJI Mini 5 Pro Fly More Combo (DJI RC2)",
      slug: "dron-dji-mini-5-pro-fly-more-combo-rc2",
      description: "Kompaktowy, składany dron z matrycą 1-calową CMOS 50MP. Nagrywanie 4K/60FPS HDR, 4K/120FPS slow-motion. Do 36 minut lotu. Wielokierunkowe wykrywanie przeszkód z trybem nocnym. Waga poniżej 249g (klasa C0 - bez specjalnych zezwoleń). Gimbal 225° obrotu. Pamięć wewnętrzna 42 GB. GNSS dual-band L1 + L5. Zasięg transmisji do 10 km (O4+).",
      price: 4800,
      comparePrice: 4999,
      sku: "6937224123212",
      stock: 1,
      brandSlug: "dji",
      categorySlug: "dji-mini-5-pro",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp",
      ],
    },
    {
      name: "Inteligentny akumulator DJI Mini 5 Pro",
      slug: "inteligentny-akumulator-dji-mini-5-pro",
      description: "Dzięki inteligentnemu akumulatorowi do DJI Mini 5 Pro możesz cieszyć się lotem trwającym nawet 36 minut. Pojemność 2788 mAh, typ Li-ion. Zakres temperatury ładowania: 5°C do 40°C. Model: BWXNN5-2788-7.0.",
      price: 359,
      sku: "CP.MA.00000918.01",
      stock: 50,
      brandSlug: "dji",
      categorySlug: "dji-mini-5-pro",
      images: [
        "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Inteligentny-akumulator-DJI-Mini-5-Pro-32508_3.webp",
      ],
    },
    // DJI Enterprise
    {
      name: "DJI Mavic 3 Enterprise + dwuletnie ubezpieczenie (DJI Care)",
      slug: "dji-mavic-3-enterprise",
      description: "Dron korporacyjny z migawką mechaniczną, kamerą z 56x zoomem hybrydowym i opcjonalnym modułem RTK dla precyzji na poziomie centymetrów. Szerokokątna kamera 4/3 CMOS 20MP z 24mm. Teleobiektyw 12MP z 162mm, 56x zoom. Czas lotu do 45 minut, zawieszenie do 38 minut. Zasięg 8km (CE). Waga 915g. Odporność na wiatr do 12 m/s. Temperatura pracy -10° do 40°C.",
      price: 16199,
      sku: "6941565944177",
      stock: 1,
      brandSlug: "dji",
      categorySlug: "dji-mavic-3-enterprise",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg",
      ],
    },
    {
      name: "DJI Mavic 3 Multispectral + DJI Care 2 lata",
      slug: "dji-mavic-3-multispectral",
      description: "Dron rolniczy łączący kamerę RGB 20MP z czterema matrycami multispektralnymi 5MP (zielona, czerwona, red-edge, bliska podczerwień). Precyzyjne badania lotnicze, monitoring wzrostu upraw. Pozycjonowanie RTK dla dokładności centymetrowej. Mapowanie do 200 hektarów na lot przy 43-minutowym czasie lotu. Zestaw zawiera: dron z modułem RTK, DJI Care Enterprise Basic (2 lata), DJI SmartFarm Platform (1 rok), DJI Terra (3 miesiące), kontroler RC Pro Enterprise, baterie, ładowarkę, zapasowe śmigła, kartę SD, walizkę.",
      price: 21299,
      sku: "20230811069",
      stock: 1,
      brandSlug: "dji",
      categorySlug: "dji-mavic-3-enterprise",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/02/Multi2.jpg",
      ],
    },
    // DJI M30T
    {
      name: "DJI Matrice 30T z kamerą termowizyjną",
      slug: "dji-matrice-30t",
      description: "Dron korporacyjny z kamerą termowizyjną. Łączy kamerę szerokokątną, zoom i termowizję z dalmierzem laserowym. Praca w trudnych warunkach (-20°C do 50°C), IP55. Czas lotu 41 minut, pułap do 7000m. Kamera termowizyjna: 640×512, 40mm, dokładność ±2°C, 30fps. Kamera zoom: 48MP, 5x-16x zoom optyczny, 200x hybrydowy, foto 8K. Kamera szeroka: 12MP, 84° FOV, 4K/30fps. Dalmierz laserowy: 3-1200m, dokładność ±(0.2m + D×0.15%). Prędkość max 23 m/s, wiatr do 15 m/s, zasięg 8km.",
      price: 42599,
      sku: "8596450039322",
      stock: 0,
      brandSlug: "dji",
      categorySlug: "dji-m30t",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg",
      ],
    },
    {
      name: "TB30 DJI Matrice 30 Bateria akumulator",
      slug: "tb30-dji-matrice-30-bateria",
      description: "Inteligentny akumulator TB30 o pojemności 5880 mAh z funkcją hot-swap umożliwiającą wymianę bez wyłączania drona. Baterie pracują parami dla bezpieczeństwa - w razie awarii jednej dron może bezpiecznie wylądować. Dwa akumulatory zapewniają około 41 minut lotu. Minimum 400 cykli ładowania. Wbudowany system samopodgrzewania (aktywuje się poniżej 10°C). Kompatybilny z DJI Matrice 30 i DJI Matrice 30T.",
      price: 1599,
      sku: "6941565927620",
      stock: 0,
      brandSlug: "dji",
      categorySlug: "dji-m30t",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg",
      ],
    },
    // Autel Max 4T
    {
      name: "EVO MAX 4T Standard Bundle",
      slug: "evo-max-4t-standard-bundle",
      description: "Profesjonalny dron z potrójnym systemem kamer: szerokokątna 50MP (matryca 1/1.28\" CMOS), zoom 48MP (10x optyczny, 160x hybrydowy) i termowizyjna 640x512 z zasięgiem 1.2km. 42-minutowy czas lotu, 19.9km zasięg transmisji. Klasa IP43, wideo 8K. Pułap 7km, odporność na wiatr do 43 km/h. Autonomiczne planowanie lotu, nawigacja bez GPS, unikanie przeszkód z radarem milimetrowym.",
      price: 42500,
      sku: "AUTEL-MAX-4T-001",
      stock: 0,
      brandSlug: "autel",
      categorySlug: "autel-max-4t",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2023/01/Max4t1-1.png",
      ],
    },
    {
      name: "Autel Max Ładowarka",
      slug: "autel-max-ladowarka",
      description: "Oryginalna ładowarka do akumulatorów serii Autel EVO Max. Technologia szybkiego ładowania z zabezpieczeniami.",
      price: 555,
      sku: "AUTEL-MAX-CHG-001",
      stock: 1,
      brandSlug: "autel",
      categorySlug: "autel-max-4t",
      images: [
        "https://drone-partss.com/wp-content/uploads/2023/12/AutelMax.jpg",
      ],
    },
    {
      name: "Autel Max 4T Bateria Akumulator",
      slug: "autel-max-4t-bateria",
      description: "Wysokowydajny inteligentny akumulator do Autel EVO Max 4T. Zoptymalizowany pod kątem wydłużonego czasu lotu do 42 minut.",
      price: 1699,
      sku: "AUTEL-MAX-BAT-001",
      stock: 0,
      brandSlug: "autel",
      categorySlug: "autel-max-4t",
      images: [],
    },
    // XAG Agricultural
    {
      name: "XAG P100 Pro Dron Rolniczy",
      slug: "xag-p100-pro-dron-rolniczy",
      description: "Konstrukcja z dzieloną platformą, z podwójnymi klamrami zabezpieczającymi i szybką wymianą modułów. Maksymalny przepływ oprysku: 22 L/min. Zakres wielkości cząstek: 60-400 mikronów. Efektywna szerokość oprysku: 5-10m. Ładowność: 50kg. Zbiornik: 50L. 80% większy przepływ niż P100. Ochrona IPX6K. Składany - redukcja objętości o ~62%.",
      price: 37058,
      sku: "09-007-00136",
      stock: 8,
      brandSlug: "xag",
      categorySlug: "xag",
      isFeatured: true,
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg",
      ],
    },
    {
      name: "XAG P100 Pro Kompletny zestaw 6 Bateria",
      slug: "xag-p100-pro-kompletny-zestaw-6-bateria",
      description: "Kompletny zestaw rolniczy do profesjonalnego oprysku i siewu. Zawiera: 1x Dron P100 Pro z systemem RevoSpray, 6x Akumulatory B1396S, 2x Ładowarki GC4000+, 1x XRTK Rover ze statywem, 1x Zbiorniki chłodzące, 1x Revocast, Oprogramowanie: Sora, STS 01-02, Tablet. System oprysku Rui 3: przepływ max 22l/min, cząstki 60-400 mikronów, szerokość 5-10m, zbiornik 50L.",
      price: 81073,
      sku: "XAG-P100-SET-6BAT",
      stock: 15,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/12/P100Set-1.jpg",
      ],
    },
    {
      name: "XAG B13960S Akumulator",
      slug: "xag-b13960s-akumulator",
      description: "Inteligentny akumulator do dronów rolniczych XAG (P40, P80, P100, V40). 13 ogniw litowo-polimerowych, 20000 mAh, 962 Wh. Zintegrowany BMS z ochroną przed przeładowaniem i awaryjnym wyłączeniem. Wymiary: 189×139×317mm. Waga: ~6.7kg. Napięcie wyjściowe: 48.1V / 120A. Temperatura pracy: 10°C do 45°C. Temperatura ładowania: 10°C do 40°C. Napięcie ładowania: 56.55V. Klasa IP65. Gwarancja 6 miesięcy.",
      price: 6199,
      sku: "09-017-00025",
      stock: 21,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/B13960S.jpg",
      ],
    },
    {
      name: "XAG GC4000+ Agregat",
      slug: "xag-gc4000-agregat",
      description: "Stacja ładowania polowa przekształcająca energię chemiczną w elektryczną. Moc nominalna 3400W. Ładowanie 2 akumulatorów jednocześnie. Statystyki paliwa w czasie rzeczywistym i alerty konserwacyjne. Zabezpieczenia przed przegrzaniem, zwarciem, przetężeniem i przepięciem.",
      price: 6148,
      sku: "09-020-00016",
      stock: 30,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/GC4000.jpg",
      ],
    },
    {
      name: "XAG ARC3 Pro z RTK",
      slug: "xag-arc3-pro-z-rtk",
      description: "Przyjazny dla użytkownika kontroler zdalny do dronów XAG. Kompatybilny z XAG P100, P100 PRO, V50 i R150 (2023+). Zestaw zawiera: jednostkę RC, akumulator wewnętrzny, złącze ładowania i moduł RTK dla precyzyjnego pozycjonowania.",
      price: 5062,
      sku: "09-016-00053",
      stock: 1,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/Acs3Pro.jpg",
      ],
    },
    {
      name: "XAG RevoSpray P3 Moduł opryskiwacza",
      slug: "xag-revospray-p3-modul-opryskiwacza",
      description: "RevoSpray 3.0 - najbardziej zaawansowane rozwiązanie w historii. Zbiornik 50L z inteligentnym czujnikiem poziomu cieczy. Duże podwójne porty do szybkiego napełniania. Wiodące w branży podwójne inteligentne pompy perystaltyczne (wydajność 5.8 GPM). Szybka wymiana ładunku - zmiana z oprysku na siew lub mapowanie w mniej niż 90 sekund. Kompatybilny z XAG P100 PRO.",
      price: 6370,
      sku: "09-023-00025",
      stock: 20,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/Revospray3.jpg",
      ],
    },
    {
      name: "XAG RevoCast P3 Moduł rozsiewacza",
      slug: "xag-revocast-p3-modul-rozsiewacza",
      description: "Moduł do rozsiewu granulatu kompatybilny z dronem XAG P100 Pro. Inteligentny system przenośnika ślimakowego. Pojemność zbiornika: 80L. Nominalna ładowność: 50kg. Maksymalna prędkość rozsiewu: 150 kg/min (pomiar laboratoryjny z mocznikiem). Odpowiednia wielkość granulatu: 1-6mm (tylko suche i stałe). Temperatura przechowywania i pracy: 0-40°C. Tarcza odśrodkowa z zasięgiem rozpraszania 3-7m.",
      price: 11472,
      sku: "09-023-00023",
      stock: 10,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/Revocast3.jpg",
      ],
    },
    {
      name: "XAG XRTK4 Baza RTK",
      slug: "xag-xrtk4-baza-rtk",
      description: "Stacja bazowa RTK (Real-Time Kinematic) do precyzyjnego pozycjonowania satelitarnego. Technologia GNSS RTK dla precyzji centymetrowej i odporności na zakłócenia elektromagnetyczne. Idealna do trudnych środowisk jak tereny górnicze i linie wysokiego napięcia. Bateria B4100 Li-Po: 45×45×1166mm, 1.2kg, 7500mAh, 14.4V. Temperatura pracy: -10°C do 45°C.",
      price: 6199,
      sku: "09-010-00036",
      stock: 20,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/XRTK.jpg",
      ],
    },
    {
      name: "XAG Statyw stacji",
      slug: "xag-statyw-stacji",
      description: "Profesjonalny statyw do stacji bazowej XAG RTK. Stabilna konstrukcja z regulowaną wysokością dla optymalnego odbioru sygnału.",
      price: 890,
      sku: "13-001-00056",
      stock: 20,
      brandSlug: "xag",
      categorySlug: "xag",
      images: [
        "https://drone-partss.com/wp-content/uploads/2024/01/Tripod.jpg",
      ],
    },
    // XAG P150 Max - najnowszy model
    {
      name: "XAG P150 Max Dron Rolniczy",
      slug: "xag-p150-max-dron-rolniczy",
      description: "Inteligentny, Wydajny, Zawsze Niezawodny. XAG P150 Max to najnowocześniejszy dron rolniczy zaprojektowany z myślą o najwyższej wydajności operacji polowych. Wykonuje w pełni autonomiczne opryski, rozsiewy, mapowanie terenu i transport materiałów, radząc sobie nawet z najbardziej wymagającymi zadaniami. Ładowność do 80 kg. Prędkość lotu do 20 m/s. Mapowanie do 20 hektarów na jeden lot. Zbiornik cieczy 80L z przepływem 46 L/min (4 dysze). Pojemnik na granulat 115L z prędkością rozsiewu 300 kg/min. Szybkie ładowanie akumulatora w zaledwie 7 minut. System SuperX 5 Ultra Intelligent Control zapewnia unikanie przeszkód dzięki radarowi obrazowania 4D, tryb lotu 3D bez map oraz pozycjonowanie PPP-AR z dokładnością centymetrową bez stacji naziemnych. Sterowanie przez aplikację XAG One 7.0 i kontroler SRC 5 Smart Remote umożliwia autonomiczne planowanie tras, operacje wielopolowe i kontrolę roju dwóch dronów jednocześnie. Zastosowania: kukurydza, ryż, bawełna, cytrusy, smoczy owoc, ziemniaki, banany i róże.",
      price: 52999,
      sku: "XAG-P150-MAX-001",
      stock: 5,
      brandSlug: "xag",
      categorySlug: "xag",
      isFeatured: true,
      images: [
        "https://mma.prnewswire.com/media/2830549/XAG_P150_Max_agricultural_drone_delivers_precision_spraying_with_high_efficiency.jpg",
        "https://mma.prnewswire.com/media/2822246/XAG_P150_Max_agricultural_drone_operation.jpg",
        "https://www.pegasusrobotics.com/cdn/shop/files/p150-header_1_1800x1800.png",
        "https://www.pegasusrobotics.com/cdn/shop/files/2_1800x1800.png",
        "https://raptordynamic.com/cdn/shop/files/P150-removebg-preview.png",
        "https://www.pegasusrobotics.com/cdn/shop/files/ruibo-fixed-item_1800x1800.png",
        "https://www.pegasusrobotics.com/cdn/shop/files/navigation-control_1800x1800.png",
        "https://www.pegasusrobotics.com/cdn/shop/files/battery-system2_1800x1800.png",
      ],
    },
  ];

  for (const product of products) {
    const brand = brands.find(b => b.slug === product.brandSlug);
    const category = categories.find(c => c.slug === product.categorySlug);

    const createdProduct = await prisma.product.create({
      data: {
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

    // Create product images
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: product.images[i],
            alt: product.name,
            position: i,
          },
        });
      }
    }
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
