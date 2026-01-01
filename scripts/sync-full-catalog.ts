import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
const publicDir = path.join(process.cwd(), "public", "images", "products");

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e").replace(/ł/g, "l")
    .replace(/ń/g, "n").replace(/ó/g, "o").replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toNetto(brutto: number): number {
  return Math.round((brutto / 1.23) * 100) / 100;
}

const defaultImg = "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg";

// Categories - ALL from drone-partss.com
const categories = [
  { name: "XAG", slug: "xag" },
  { name: "DJI Mavic 4 Pro", slug: "dji-mavic-4-pro" },
  { name: "DJI Mini 5 Pro", slug: "dji-mini-5-pro" },
  { name: "DJI Mini 4 Pro", slug: "dji-mini-4-pro" },
  { name: "DJI Mini 3 Pro", slug: "dji-mini-3-pro" },
  { name: "DJI Mini 3", slug: "dji-mini-3" },
  { name: "DJI Mavic 3", slug: "dji-mavic-3" },
  { name: "DJI Mavic 3 Pro", slug: "dji-mavic-3-pro" },
  { name: "DJI Mavic 3 Enterprise", slug: "dji-mavic-3-enterprise" },
  { name: "DJI Matrice 30", slug: "dji-matrice-30" },
  { name: "DJI Matrice 350 RTK", slug: "dji-matrice-350-rtk" },
  { name: "DJI Matrice 4", slug: "dji-matrice-4" },
  { name: "Autel Max 4T", slug: "autel-max-4t" },
  { name: "Autel Evo 2", slug: "autel-evo-2" },
  { name: "Autel Evo Lite", slug: "autel-evo-lite" },
  { name: "Autel Evo Nano", slug: "autel-evo-nano" },
  { name: "Autel Dragonfish", slug: "autel-dragonfish" },
  { name: "DJI Avata 2", slug: "dji-avata-2" },
  { name: "DJI Avata", slug: "dji-avata" },
  { name: "DJI FPV", slug: "dji-fpv" },
  { name: "DJI Neo", slug: "dji-neo" },
  { name: "DJI Flip", slug: "dji-flip" },
  { name: "DJI Mavic 2", slug: "dji-mavic-2" },
  { name: "DJI Mavic Air", slug: "dji-mavic-air" },
  { name: "DJI Mavic Air 2", slug: "dji-mavic-air-2" },
  { name: "DJI Mavic Air 2S", slug: "dji-mavic-air-2s" },
  { name: "DJI Mavic Air 3", slug: "dji-mavic-air-3" },
  { name: "DJI Mavic Mini", slug: "dji-mavic-mini" },
  { name: "DJI Mavic Mini 2", slug: "dji-mavic-mini-2" },
  { name: "DJI Mavic Pro", slug: "dji-mavic-pro" },
  { name: "DJI Phantom 4", slug: "dji-phantom-4" },
  { name: "DJI Inspire 2", slug: "dji-inspire-2" },
  { name: "DJI Inspire 1", slug: "dji-inspire-1" },
  { name: "DJI Agras", slug: "dji-agras" },
  { name: "FIMI", slug: "fimi" },
  { name: "Accesorios", slug: "accesorios" },
  { name: "Kontrolery", slug: "kontrolery" },
];

// ALL PRODUCTS - Complete catalog from drone-partss.com
const products = [
  // ============ XAG ============
  { name: "XAG P100 Pro Dron Rolniczy", price: 37058, category: "xag", stock: 2 },
  { name: "XAG P100 Pro Kompletny zestaw 6 Baterii", price: 81073, category: "xag", stock: 1 },
  { name: "XAG P150 Max Dron Rolniczy", price: 95000, category: "xag", stock: 1 },
  { name: "XAG B13960S Akumulator", price: 6199, category: "xag", stock: 5 },
  { name: "XAG GC4000+ Agregat", price: 6148, category: "xag", stock: 3 },
  { name: "XAG ARC3 Pro z RTK", price: 5062, category: "xag", stock: 2 },
  { name: "XAG RevoSpray P3 Moduł opryskiwacza", price: 6370, category: "xag", stock: 4 },
  { name: "XAG RevoCast P3 Moduł rozsiewacza", price: 11472, category: "xag", stock: 3 },
  { name: "XAG XRTK4 Baza RTK", price: 6199, category: "xag", stock: 2 },
  { name: "XAG Statyw stacji", price: 890, category: "xag", stock: 5 },
  { name: "XAG RealTerra 2 Moduł Mapowania", price: 8500, category: "xag", stock: 0 },

  // ============ DJI Mavic 4 Pro ============
  { name: "Dron DJI Mavic 4 Pro", price: 10499, category: "dji-mavic-4-pro", stock: 5 },
  { name: "Dron DJI Mavic 4 Pro Fly More Combo (DJI RC 2)", price: 13999, category: "dji-mavic-4-pro", stock: 3 },
  { name: "Dron DJI Mavic 4 Pro 512GB Creator Combo (DJI RC Pro 2)", price: 17999, category: "dji-mavic-4-pro", stock: 2 },
  { name: "DJI Mavic 4 Pro Akumulator", price: 959, category: "dji-mavic-4-pro", stock: 10 },
  { name: "DJI Care Refresh Mavic 4 Pro", price: 1149, category: "dji-mavic-4-pro", stock: 10 },

  // ============ DJI Mini 5 Pro ============
  { name: "Dron DJI Mini 5 Pro", price: 4199, category: "dji-mini-5-pro", stock: 5 },
  { name: "Dron DJI Mini 5 Pro Fly More Combo (DJI RC2)", price: 4800, category: "dji-mini-5-pro", stock: 3 },
  { name: "Dron DJI Mini 5 Pro Fly More Combo (DJI RC-N3)", price: 4599, category: "dji-mini-5-pro", stock: 3 },
  { name: "Inteligentny akumulator DJI Mini 5 Pro", price: 359, category: "dji-mini-5-pro", stock: 15 },

  // ============ DJI Mini 4 Pro ============
  { name: "DJI Mini 4 Pro", price: 3749, category: "dji-mini-4-pro", stock: 4 },
  { name: "DJI Mini 4 Pro Fly More Combo", price: 4699, category: "dji-mini-4-pro", stock: 3 },
  { name: "DJI Mini 4 Pro Obudowa Środkowa", price: 50, category: "dji-mini-4-pro", stock: 8 },
  { name: "DJI Mini 4 Pro Dolna Obudowa", price: 45, category: "dji-mini-4-pro", stock: 6 },
  { name: "DJI Mini 4 Pro Górna Obudowa", price: 65, category: "dji-mini-4-pro", stock: 5 },
  { name: "DJI Mini 4 Pro Elastyczny płaski przewód", price: 190, category: "dji-mini-4-pro", stock: 4 },
  { name: "DJI Mini 4 Pro Moduł widzenia w dół", price: 167, category: "dji-mini-4-pro", stock: 3 },
  { name: "DJI Mini 4 Pro Osłona boczna Gimbala (lewa)", price: 19, category: "dji-mini-4-pro", stock: 10 },
  { name: "DJI Mini 4 Pro Pokrywa boczna gimbala (prawa)", price: 19, category: "dji-mini-4-pro", stock: 10 },
  { name: "DJI Mini 4 Pro Przedniego ramienia (lewy)", price: 199, category: "dji-mini-4-pro", stock: 3 },
  { name: "DJI Mini 4 Pro Przedniego ramienia (Prawe)", price: 199, category: "dji-mini-4-pro", stock: 3 },
  { name: "DJI Mini 4 Pro Taśma ESC", price: 84, category: "dji-mini-4-pro", stock: 5 },
  { name: "DJI Mini 4 Pro Lewe ramię tylne", price: 199, category: "dji-mini-4-pro", stock: 0 },
  { name: "DJI Mini 4 Pro Prawe ramię tylne", price: 199, category: "dji-mini-4-pro", stock: 0 },
  { name: "DJI Mini 4 Pro Obiektyw", price: 95, category: "dji-mini-4-pro", stock: 5 },
  { name: "DJI Mini 4 Pro – DJI Care Refresh (1 rok)", price: 425, category: "dji-mini-4-pro", stock: 0 },
  { name: "DJI Mini 4 Pro – DJI Care Refresh (2 lata)", price: 699, category: "dji-mini-4-pro", stock: 0 },
  { name: "DJI Mini 4 Pro Inteligentny akumulator (3 szt. + hub)", price: 1047, category: "dji-mini-4-pro", stock: 0 },
  { name: "DJI Mini 4 Moduł łożyska gimbala", price: 80, category: "dji-mini-4-pro", stock: 5 },
  { name: "DJI Mini 4 Amortyzatora absorpcyjnego", price: 58, category: "dji-mini-4-pro", stock: 6 },
  { name: "DJI Mini 4 Moduł Płyty głównej ESC", price: 199, category: "dji-mini-4-pro", stock: 4 },

  // ============ DJI Mini 3 Pro ============
  { name: "DJI Akumulator do Mini 3 Pro", price: 349, category: "dji-mini-3-pro", stock: 10 },
  { name: "DJI Mini 3 Pro Obudowa Środkowa", price: 49, category: "dji-mini-3-pro", stock: 6 },
  { name: "DJI Mini 3 Pro Górna Obudowa", price: 59, category: "dji-mini-3-pro", stock: 5 },
  { name: "DJI Mini 3 Pro Dolna Obudowa", price: 25, category: "dji-mini-3-pro", stock: 8 },
  { name: "DJI Mini 3 Pro Oś Przedniego Ramienia", price: 70, category: "dji-mini-3-pro", stock: 6 },
  { name: "DJI Mini 3 Pro Przedniego ramienia (lewy)", price: 189, category: "dji-mini-3-pro", stock: 4 },
  { name: "DJI Mini 3 Pro Przedniego ramienia (Prawe)", price: 189, category: "dji-mini-3-pro", stock: 4 },
  { name: "DJI Mini 3 Pro Roll Ramię", price: 170, category: "dji-mini-3-pro", stock: 3 },
  { name: "DJI Mini 3 Pro Dolne Czujniki Pozycjonowania", price: 360, category: "dji-mini-3-pro", stock: 2 },
  { name: "DJI Mini 3 Pro / DJI Mini 4 Pro Zestaw śmigieł", price: 45, category: "dji-mini-3-pro", stock: 15 },
  { name: "DJI Mini 3 Pro Elastyczny płaski kabel ESC", price: 80, category: "dji-mini-3-pro", stock: 5 },
  { name: "DJI Mini 3 Pro – Elastyczna taśma 7w1", price: 219, category: "dji-mini-3-pro", stock: 3 },
  { name: "DJI Mini 3 Pro – moduł czujnika wizyjnego", price: 420, category: "dji-mini-3-pro", stock: 2 },
  { name: "DJI Mini 3 – Mini 3 Pro Obiektyw", price: 92, category: "dji-mini-3-pro", stock: 8 },
  { name: "Moduł czujnika przedniej wizji osłona dekoracyjna", price: 49, category: "dji-mini-3-pro", stock: 10 },
  { name: "Taśma GPS Mini 3 Pro / Mini 3", price: 78, category: "dji-mini-3-pro", stock: 6 },

  // ============ DJI Mini 3 ============
  { name: "DJI Mini 3 – DJI Care Refresh (1 rok)", price: 299, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 – DJI Care Refresh (2 Lata)", price: 499, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Dolna Obudowa", price: 49, category: "dji-mini-3", stock: 5 },
  { name: "DJI Mini 3 Górna obudowa", price: 49, category: "dji-mini-3", stock: 5 },
  { name: "DJI Mini 3 Oś Tylnego Lewego Ramienia", price: 45, category: "dji-mini-3", stock: 6 },
  { name: "DJI Mini 3 Oś Tylnego Prawego Ramienia", price: 45, category: "dji-mini-3", stock: 6 },
  { name: "DJI Mini 3 Moduł Płyty głównej ESC", price: 190, category: "dji-mini-3", stock: 4 },
  { name: "DJI Mini 3 Osłona boczna Gimbala (lewa)", price: 10, category: "dji-mini-3", stock: 15 },
  { name: "DJI Mini 3 Pokrywa boczna gimbala (prawa)", price: 10, category: "dji-mini-3", stock: 15 },
  { name: "DJI Mini 3 Przedniego ramienia (lewy)", price: 199, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Przedniego ramienia (Prawe)", price: 199, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Lewe ramię tylne", price: 189, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Prawe ramię tylne", price: 189, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Series Szklany obiektyw", price: 49, category: "dji-mini-3", stock: 8 },
  { name: "DJI Mini 3 Środkowa obudowa", price: 49, category: "dji-mini-3", stock: 6 },
  { name: "DJI Mini 3 Taśma 2 na 1", price: 190, category: "dji-mini-3", stock: 4 },
  { name: "DJI Mini 3 Gimbal Kamera Przednia obudowa", price: 60, category: "dji-mini-3", stock: 5 },
  { name: "DJI Mini 3 Series Gimbal Pitch Motor", price: 180, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 Zestaw śmigieł", price: 45, category: "dji-mini-3", stock: 0 },
  { name: "DJI Mini 3 – Mini 4 Naklejka na płytę ESC", price: 25, category: "dji-mini-3", stock: 10 },
  { name: "DJI Mini 3 – 4 Pro PTZ Sygnał Kabel", price: 190, category: "dji-mini-3", stock: 5 },
  { name: "DJI Mini 3 – Mini 3 Pro Amortyzatora absorpcyjnego", price: 58, category: "dji-mini-3", stock: 6 },

  // ============ DJI Mavic 3 ============
  { name: "DJI Mavic 3 Górna obudowa", price: 89, category: "dji-mavic-3", stock: 5 },
  { name: "DJI Mavic 3 Środkowa obudowa", price: 83, category: "dji-mavic-3", stock: 4 },
  { name: "DJI Mavic 3 Aircraft Rear Cover", price: 35, category: "dji-mavic-3", stock: 10 },
  { name: "DJI Mavic 3 Oś Przedniego Ramienia Prawa", price: 49, category: "dji-mavic-3", stock: 5 },
  { name: "DJI Mavic 3 Oś Przedniego Ramienia Lewa", price: 49, category: "dji-mavic-3", stock: 5 },
  { name: "DJI Mavic 3 Oś Tylnego Ramienia", price: 59, category: "dji-mavic-3", stock: 4 },
  { name: "DJI Mavic 3 Cine Przednie lewe ramię z silnikiem", price: 190, category: "dji-mavic-3", stock: 3 },
  { name: "DJI Mavic 3 Ładowarka Hub 200W", price: 650, category: "dji-mavic-3", stock: 0 },

  // ============ DJI Mavic 3 Pro ============
  { name: "Dron DJI Mavic 3 Pro", price: 9999, category: "dji-mavic-3-pro", stock: 3 },
  { name: "Dron DJI Mavic 3 Pro Fly More Combo", price: 12499, category: "dji-mavic-3-pro", stock: 2 },
  { name: "Dron DJI Mavic 3 Pro Cine Premium Combo", price: 16999, category: "dji-mavic-3-pro", stock: 1 },
  { name: "DJI Mavic 3 Pro Dolna płyta pochłaniająca wibracje", price: 65, category: "dji-mavic-3-pro", stock: 8 },
  { name: "DJI Mavic 3 Pro Górna płyta pochłaniająca wibracje", price: 65, category: "dji-mavic-3-pro", stock: 6 },

  // ============ DJI Mavic 3 Enterprise ============
  { name: "DJI Mavic 3 Enterprise + DJI Care 2 lata", price: 16199, category: "dji-mavic-3-enterprise", stock: 2 },
  { name: "DJI Mavic 3 Multispectral + DJI Care 2 lata", price: 28999, category: "dji-mavic-3-enterprise", stock: 1 },
  { name: "DJI Mavic 3 Enterprise Battery Kit", price: 2729, category: "dji-mavic-3-enterprise", stock: 4 },
  { name: "LKTOP KL340 SpotLight For Mavic 3 Enterprise", price: 2980, category: "dji-mavic-3-enterprise", stock: 2 },
  { name: "GZC GL10 Gimbal Searchlight – Mavic 3 Enterprises", price: 5499, category: "dji-mavic-3-enterprise", stock: 1 },
  { name: "JZ H1E Speaker – Mavic 3 Enterprise", price: 2029, category: "dji-mavic-3-enterprise", stock: 2 },

  // ============ DJI Matrice 30 ============
  { name: "DJI Matrice 30T z kamerą termowizyjną", price: 42599, category: "dji-matrice-30", stock: 0 },
  { name: "TB30 DJI Matrice 30 Bateria akumulator", price: 1599, category: "dji-matrice-30", stock: 0 },
  { name: "DJI RC Plus Zewnętrzna antena (zestaw)", price: 180, category: "dji-matrice-30", stock: 5 },
  { name: "GZC LP12 SearchLight & Broadcasting System – M30", price: 7499, category: "dji-matrice-30", stock: 1 },

  // ============ DJI Matrice 350 RTK ============
  { name: "Dron DJI Matrice 350 RTK – Pack", price: 57999, category: "dji-matrice-350-rtk", stock: 1 },
  { name: "LIDAR z kamerą mapującą DJI Zenmuse L2", price: 61889, category: "dji-matrice-350-rtk", stock: 1 },
  { name: "Noga podwozia Matrice 300 RTK", price: 699, category: "dji-matrice-350-rtk", stock: 3 },
  { name: "JZ H10 Matrix Speaker – Matrice 350 RTK", price: 4063, category: "dji-matrice-350-rtk", stock: 1 },
  { name: "JZ M30 Quick Search Kit – Matrice 350 RTK", price: 4963, category: "dji-matrice-350-rtk", stock: 1 },

  // ============ DJI Matrice 4 ============
  { name: "Dron DJI Matrice 4E + DJI Care Plus 1 rok", price: 20800, category: "dji-matrice-4", stock: 2 },
  { name: "Dron DJI Matrice 4T + DJI Care Plus 1 rok", price: 31200, category: "dji-matrice-4", stock: 1 },

  // ============ Autel Max 4T ============
  { name: "EVO MAX 4T Standard Bundle", price: 42500, category: "autel-max-4t", stock: 0 },
  { name: "EVO MAX 4T Standard Bundle Public Safe Version", price: 42500, category: "autel-max-4t", stock: 0 },
  { name: "Autel Max 4T Bateria Akumulator", price: 1699, category: "autel-max-4t", stock: 0 },
  { name: "Autel Max Ładowarka", price: 555, category: "autel-max-4t", stock: 3 },
  { name: "Autel EVO Max 4T Multi Charger Hub", price: 1199, category: "autel-max-4t", stock: 0 },
  { name: "Autel EVO Max Śmigło (2 szt.)", price: 99, category: "autel-max-4t", stock: 0 },

  // ============ Autel Evo 2 ============
  { name: "Autel Alpha", price: 90209, category: "autel-evo-2", stock: 0 },
  { name: "Autel Evo 2 Dolna Obudowa", price: 99, category: "autel-evo-2", stock: 5 },
  { name: "Autel Evo 2 Górna Obudowa", price: 99, category: "autel-evo-2", stock: 5 },
  { name: "Autel Evo 2 Podwozie", price: 99, category: "autel-evo-2", stock: 5 },
  { name: "Autel Evo 2 Środkowa Obudowa", price: 320, category: "autel-evo-2", stock: 3 },
  { name: "Autel Evo 2 V2/V3 Enterprise Przednie Lewe Ramię", price: 390, category: "autel-evo-2", stock: 2 },
  { name: "Autel Evo 2 V2/V3 Enterprise Przednie Prawe Ramię", price: 390, category: "autel-evo-2", stock: 2 },
  { name: "Autel Evo 2 V2/V3 Enterprise Tylna Lewa Ramie", price: 350, category: "autel-evo-2", stock: 2 },
  { name: "Autel Śmigła EVO II 2 szt.", price: 99, category: "autel-evo-2", stock: 5 },
  { name: "Podwozie Tylne do Autel Evo II", price: 45, category: "autel-evo-2", stock: 8 },
  { name: "Autel EVO III Series", price: 25000, category: "autel-evo-2", stock: 0 },

  // ============ Autel Evo Lite ============
  { name: "Autel Evo Lite Środkowa Obudowa", price: 110, category: "autel-evo-lite", stock: 5 },
  { name: "Autel Lite / Lite+ Dolna Obudowa", price: 140, category: "autel-evo-lite", stock: 4 },
  { name: "Autel Lite / Lite+ Przednie Prawe Ramię", price: 278, category: "autel-evo-lite", stock: 3 },
  { name: "Autel Lite /Lite+ Tylny Lewe Ramię", price: 278, category: "autel-evo-lite", stock: 3 },
  { name: "Autel Lite /Lite+ Tylny Prawe Ramię", price: 278, category: "autel-evo-lite", stock: 3 },
  { name: "Autel Lite Gimbal z Kamera", price: 3493, category: "autel-evo-lite", stock: 0 },
  { name: "Autel Lte+ Gimbal z Kamera", price: 3091, category: "autel-evo-lite", stock: 0 },
  { name: "Autel Robotics Little+ Ramie Roll", price: 290, category: "autel-evo-lite", stock: 2 },
  { name: "Autel Robotics Little+ Ramie Yaw", price: 290, category: "autel-evo-lite", stock: 2 },

  // ============ Autel Evo Nano ============
  { name: "Autel Evo Nano Górna Obudowa", price: 49, category: "autel-evo-nano", stock: 5 },
  { name: "Autel Evo Nano Series Propellers", price: 55, category: "autel-evo-nano", stock: 0 },
  { name: "Autel Evo Nano Środkowa Obudowa", price: 49, category: "autel-evo-nano", stock: 5 },
  { name: "Autel Nano / Nano Plus Przednie Lewe Ramię", price: 205, category: "autel-evo-nano", stock: 3 },
  { name: "Autel Nano / Nano Plus Przednie Prawe Ramię", price: 205, category: "autel-evo-nano", stock: 3 },
  { name: "Autel Nano / Nano Plus Tylny Lewe Ramię", price: 205, category: "autel-evo-nano", stock: 3 },
  { name: "Autel Nano / nano Plus Tylny Prawe Ramię", price: 205, category: "autel-evo-nano", stock: 3 },
  { name: "Autel Robotics Evo Nano Gimbal Półwykończenie", price: 320, category: "autel-evo-nano", stock: 2 },

  // ============ Autel Dragonfish ============
  { name: "Autel Dragonfish Lite/Standard/Pro DG-T3", price: 15000, category: "autel-dragonfish", stock: 0 },
  { name: "Autel Dragonfish Lite/Standard/Pro DG-Z2", price: 18000, category: "autel-dragonfish", stock: 0 },
  { name: "Dron Autel Robotics Dragonfish Lite 5KG Z T3H Sensor", price: 85000, category: "autel-dragonfish", stock: 0 },
  { name: "Dron Autel Robotics Dragonfish Lite 5KG Z Z2 Dual Sensor", price: 95000, category: "autel-dragonfish", stock: 0 },
  { name: "Dron Autel Robotics Dragonfish Standard 7KG Z Z2 Dual Sensor", price: 120000, category: "autel-dragonfish", stock: 0 },
  { name: "Autel Evo Nest 2", price: 150000, category: "autel-dragonfish", stock: 0 },
  { name: "Autel Explorer", price: 35000, category: "autel-dragonfish", stock: 0 },

  // ============ DJI Avata 2 ============
  { name: "Dron DJI Avata 2", price: 4699, category: "dji-avata-2", stock: 4 },
  { name: "Dron DJI Avata 2 Fly More Combo", price: 5599, category: "dji-avata-2", stock: 2 },
  { name: "DJI Avata 2 Akumulator bateria", price: 550, category: "dji-avata-2", stock: 10 },
  { name: "DJI Goggles 3", price: 2999, category: "dji-avata-2", stock: 3 },
  { name: "Avata 2 Front Left Aircraft Arm Cover", price: 39, category: "dji-avata-2", stock: 8 },
  { name: "Avata 2 Front Right Aircraft Arm", price: 39, category: "dji-avata-2", stock: 8 },
  { name: "Avata 2 Rear Left Aircraft Arm", price: 39, category: "dji-avata-2", stock: 8 },
  { name: "Avata 2 Rear Right Aircraft Arm", price: 39, category: "dji-avata-2", stock: 8 },
  { name: "DJI Avata 2 Dolny moduł pokrywy", price: 180, category: "dji-avata-2", stock: 4 },
  { name: "DJI Avata 2 Flex do płytkę czujnika wizyjnego", price: 108, category: "dji-avata-2", stock: 5 },
  { name: "DJI Avata 2 kabel łączący płytkę ESC", price: 108, category: "dji-avata-2", stock: 5 },
  { name: "DJI Avata 2 Osłona śmigła", price: 284, category: "dji-avata-2", stock: 6 },
  { name: "DJI Avata 2 Silnik napędowy (przód)", price: 180, category: "dji-avata-2", stock: 5 },
  { name: "DJI Avata 2 Silnik napędowy (tył)", price: 180, category: "dji-avata-2", stock: 5 },
  { name: "DJI Avata 2 Uchwyt antykolizyjny", price: 154, category: "dji-avata-2", stock: 6 },

  // ============ DJI Avata ============
  { name: "DJI Avata Akumulator", price: 580, category: "dji-avata", stock: 5 },
  { name: "DJI Avata Górna Osłona", price: 110, category: "dji-avata", stock: 6 },
  { name: "DJI Avata Moduł ESC", price: 290, category: "dji-avata", stock: 4 },
  { name: "DJI Avata Osłony śmigieł", price: 149, category: "dji-avata", stock: 10 },
  { name: "DJI Avata Amortyzator absorpcyjny do gimbala", price: 120, category: "dji-avata", stock: 5 },
  { name: "DJI Avata Centralna Płyta Mocująca", price: 49, category: "dji-avata", stock: 6 },
  { name: "DJI Avata Czujniki wizji – dół", price: 170, category: "dji-avata", stock: 0 },
  { name: "DJI Avata Elastyczny kabel łączący czujnik wizyjny", price: 110, category: "dji-avata", stock: 0 },
  { name: "DJI Avata Kabel do akumulatora", price: 41, category: "dji-avata", stock: 0 },
  { name: "DJI Avata Moduł GPS", price: 299, category: "dji-avata", stock: 3 },
  { name: "DJI Avata PTZ Kable", price: 190, category: "dji-avata", stock: 4 },
  { name: "DJI Avata Silnik CCW", price: 80, category: "dji-avata", stock: 6 },
  { name: "DJI Avata Silnik CW", price: 80, category: "dji-avata", stock: 6 },

  // ============ DJI FPV ============
  { name: "DJI FPV Combo", price: 5999, category: "dji-fpv", stock: 2 },
  { name: "DJI FPV Motion Controller", price: 799, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV Akumulator", price: 699, category: "dji-fpv", stock: 8 },
  { name: "DJI FPV Górna obudowa", price: 79, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Dolna obudowa", price: 56, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Adaptery montażowe śmigieł", price: 29, category: "dji-fpv", stock: 15 },
  { name: "DJI FPV Antena ADS-B (lewa)", price: 20, category: "dji-fpv", stock: 10 },
  { name: "DJI FPV Antena ADS-B (prawa)", price: 20, category: "dji-fpv", stock: 10 },
  { name: "DJI FPV Antena Transmisyjna SDR", price: 8, category: "dji-fpv", stock: 15 },
  { name: "DJI FPV Anteny lewego przedniego podwozia", price: 53, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Anteny prawego przedniego podwozia", price: 53, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Czujnik Pozycjonowania", price: 320, category: "dji-fpv", stock: 3 },
  { name: "DJI FPV Drone Protective Shell", price: 58, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV Kabel Lewego – Prawego Ramienia", price: 8, category: "dji-fpv", stock: 10 },
  { name: "DJI FPV Kabel PTZ Gimbala", price: 120, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Metalowa Osłona Gimbala", price: 38, category: "dji-fpv", stock: 8 },
  { name: "DJI FPV Płyta ESC", price: 275, category: "dji-fpv", stock: 3 },
  { name: "DJI FPV Płytka adaptera czujnika wizyjnego", price: 86, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV Płytka GPS", price: 160, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Pokrywa Płytki ESC", price: 45, category: "dji-fpv", stock: 8 },
  { name: "DJI FPV Przednie Lewe Podwozie", price: 50, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Przednie Lewe Ramię", price: 99, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Przednie Prawe podwozie", price: 50, category: "dji-fpv", stock: 6 },
  { name: "DJI FPV Przednie Prawe Ramię", price: 99, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Regulowane Drążki", price: 70, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV Silniki Długi kabel", price: 135, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Silniki Krótki kabel", price: 135, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Tylne Lewe Ramię", price: 99, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Tylne Prawe Ramię", price: 99, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV Wentylator", price: 129, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV – czujnik wizyjny Taśma kablem E1E", price: 90, category: "dji-fpv", stock: 5 },
  { name: "DJI FPV – Dolna pokrywa pilota zdalnego sterowania", price: 110, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV – Górna pokrywa pilota zdalnego sterowania", price: 110, category: "dji-fpv", stock: 4 },
  { name: "DJI FPV – moduł drążków zdalnego sterowania", price: 207, category: "dji-fpv", stock: 3 },

  // ============ DJI Neo ============
  { name: "Dron DJI Neo Motion Fly More Combo", price: 2499, category: "dji-neo", stock: 5 },
  { name: "DJI Neo", price: 1199, category: "dji-neo", stock: 8 },
  { name: "DJI Neo Obudowa", price: 80, category: "dji-neo", stock: 6 },
  { name: "DJI Neo Dolna Obudowa", price: 79, category: "dji-neo", stock: 8 },
  { name: "DJI Neo Przedni silnik napędowy", price: 107, category: "dji-neo", stock: 10 },
  { name: "DJI Neo Tylny silnik napędowy", price: 107, category: "dji-neo", stock: 10 },

  // ============ DJI Flip ============
  { name: "DJI Flip", price: 2069, category: "dji-flip", stock: 5 },
  { name: "DJI Flip Fly More Combo (DJI RC2)", price: 3649, category: "dji-flip", stock: 3 },

  // ============ DJI Mavic 2 ============
  { name: "DJI Mavic 2 Czujnik Kolizyjne Górne", price: 120, category: "dji-mavic-2", stock: 5 },
  { name: "DJI Mavic 2 Dolna Obudowa", price: 159, category: "dji-mavic-2", stock: 4 },
  { name: "DJI Mavic 2 Dolne Czujniki Pozycjonowania", price: 180, category: "dji-mavic-2", stock: 4 },
  { name: "DJI Mavic 2 Górna Obudowa", price: 140, category: "dji-mavic-2", stock: 5 },
  { name: "DJI Mavic 2 GPS Flexible Cable", price: 59, category: "dji-mavic-2", stock: 6 },
  { name: "DJI Mavic 2 GPS Module", price: 275, category: "dji-mavic-2", stock: 3 },
  { name: "DJI Mavic 2 IMU Module", price: 290, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Low-Noise Propellers 8743", price: 40, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Płytka ESC", price: 240, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Pokrywa montażowa gimbala", price: 15, category: "dji-mavic-2", stock: 10 },
  { name: "DJI Mavic 2 Pokrywa Przednich Osi", price: 15, category: "dji-mavic-2", stock: 10 },
  { name: "DJI Mavic 2 Pro / Zoom Bateria Aparatura", price: 290, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Pro Ramię Gimbala ROLL", price: 140, category: "dji-mavic-2", stock: 4 },
  { name: "DJI Mavic 2 Przedni czujnik wizyjny", price: 240, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Przednie lewe ramię", price: 145, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 Przednie Prawe Ramię", price: 145, category: "dji-mavic-2", stock: 4 },
  { name: "DJI Mavic 2 Przycisk klawisza RC", price: 140, category: "dji-mavic-2", stock: 0 },
  { name: "DJI Mavic 2 TOF Module", price: 80, category: "dji-mavic-2", stock: 5 },
  { name: "DJI Mavic 2 Rear Left Arm", price: 145, category: "dji-mavic-2", stock: 4 },
  { name: "DJI Mavic 2 Rear Right Arm", price: 145, category: "dji-mavic-2", stock: 4 },

  // ============ DJI Mavic Air ============
  { name: "DJI Mavic Air 1 Taśma Gimbala", price: 150, category: "dji-mavic-air", stock: 4 },

  // ============ DJI Mavic Air 2 ============
  { name: "DJI Mavic Air 2 Górna Obudowa", price: 80, category: "dji-mavic-air-2", stock: 5 },
  { name: "DJI Mavic Air 2 Dolna Obudowa", price: 110, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 ESC Płyta", price: 250, category: "dji-mavic-air-2", stock: 3 },
  { name: "DJI Mavic Air 2 Przednie Lewe Ramię", price: 180, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 Przednie Prawe Ramię", price: 180, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 Tylne Lewe Ramię", price: 180, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 Tylne Prawie Ramię", price: 180, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 Przednia Osłona Czujników", price: 29, category: "dji-mavic-air-2", stock: 8 },
  { name: "DJI Mavic Air 2 Przednie czujniki wizyjne", price: 240, category: "dji-mavic-air-2", stock: 3 },
  { name: "DJI Mavic Air 2 Stopki Podwozia", price: 60, category: "dji-mavic-air-2", stock: 0 },
  { name: "DJI Mavic Air 2 Taśma gimbala", price: 180, category: "dji-mavic-air-2", stock: 4 },
  { name: "DJI Mavic Air 2 -Air 2S Zaślepka Lewego ramienia", price: 11, category: "dji-mavic-air-2", stock: 0 },
  { name: "DJI Mavic Air 2 Adapter Montażu Śmigieł CCW", price: 9, category: "dji-mavic-air-2", stock: 0 },
  { name: "DJI Mavic Air 2 Adapter Montażu Śmigieł CW", price: 9, category: "dji-mavic-air-2", stock: 5 },
  { name: "DJI Mavic Air 2 Dolna dioda LED", price: 9, category: "dji-mavic-air-2", stock: 0 },
  { name: "Modul GPS DJI Mavic Air 2", price: 250, category: "dji-mavic-air-2", stock: 0 },

  // ============ DJI Mavic Air 2S ============
  { name: "DJI Mavic Air 2S Dolna Obudowa", price: 179, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2S Środkowa Obudowa", price: 99, category: "dji-mavic-air-2s", stock: 5 },
  { name: "DJI Mavic Air 2/2S Oś Przedniego Ramienia", price: 38, category: "dji-mavic-air-2s", stock: 8 },
  { name: "DJI Mavic Air 2/2S Czujniki Pozycyjne", price: 206, category: "dji-mavic-air-2s", stock: 0 },
  { name: "DJI Mavic Air 2/2S Taśma ESC", price: 29, category: "dji-mavic-air-2s", stock: 6 },
  { name: "DJI Mavic Air 2/2S Taśma Tylnych Czujników", price: 35, category: "dji-mavic-air-2s", stock: 0 },
  { name: "DJI Mavic Air 2/2S Tylna Oś Ramienia", price: 50, category: "dji-mavic-air-2s", stock: 5 },
  { name: "DJI Mavic Air 2/2S Wentylator", price: 99, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2S / Air 2 Czujnik widzenia wstecznego", price: 250, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2S Gimbal z Kamerą", price: 2004, category: "dji-mavic-air-2s", stock: 0 },
  { name: "DJI Mavic Air 2S Górna Obudowa", price: 90, category: "dji-mavic-air-2s", stock: 5 },
  { name: "DJI Mavic Air 2S Moduł GPS", price: 189, category: "dji-mavic-air-2s", stock: 0 },
  { name: "DJI Mavic Air 2S Przednia Osłona Czujników", price: 39, category: "dji-mavic-air-2s", stock: 6 },
  { name: "DJI Mavic Air 2S Front Right Arm", price: 189, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2S GPS Ribbon", price: 49, category: "dji-mavic-air-2s", stock: 5 },
  { name: "DJI Mavic Air 2S Rear Left Arm", price: 189, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2S Rear Right Arm", price: 189, category: "dji-mavic-air-2s", stock: 4 },
  { name: "DJI Mavic Air 2/2S Propellers (2 szt.)", price: 40, category: "dji-mavic-air-2s", stock: 10 },

  // ============ DJI Mavic Air 3 ============
  { name: "DJI Mavic Air 3/3S Charger YX HUB", price: 480, category: "dji-mavic-air-3", stock: 4 },
  { name: "DJI Mavic Air 3 Charger HUB LKTOP", price: 490, category: "dji-mavic-air-3", stock: 3 },
  { name: "DJI Mavic Air 3 Lower Housing Cover", price: 210, category: "dji-mavic-air-3", stock: 4 },
  { name: "DJI Mavic Air 3 Front Left Arm", price: 250, category: "dji-mavic-air-3", stock: 3 },
  { name: "DJI Mavic Air 3 Front Right Arm", price: 250, category: "dji-mavic-air-3", stock: 3 },
  { name: "DJI Mavic Air 3 Rear Left Arm", price: 250, category: "dji-mavic-air-3", stock: 3 },
  { name: "DJI Mavic Air 3 Rear Right Arm", price: 250, category: "dji-mavic-air-3", stock: 3 },

  // ============ DJI Mavic Mini ============
  { name: "DJI Mavic Mini Przednie Lewe Ramię", price: 189, category: "dji-mavic-mini", stock: 4 },
  { name: "DJI Mavic Mini Przednie Prawe Ramię", price: 189, category: "dji-mavic-mini", stock: 4 },
  { name: "DJI Mavic Mini Płytka ESC", price: 139, category: "dji-mavic-mini", stock: 5 },
  { name: "DJI Mavic Mini SE Środkowa Obudowa", price: 49, category: "dji-mavic-mini", stock: 6 },
  { name: "DJI Mavic Mini 4K Front Left Arm", price: 149, category: "dji-mavic-mini", stock: 4 },
  { name: "DJI Mavic Mini/SE/2 Górna Obudowa", price: 49, category: "dji-mavic-mini", stock: 6 },
  { name: "DJI Mavic Mini/SE/2 Lewa maskownica/zaślepka", price: 15, category: "dji-mavic-mini", stock: 10 },
  { name: "DJI Mavic Mini/SE/2 Przednia oś ramienia", price: 15, category: "dji-mavic-mini", stock: 10 },
  { name: "DJI Mavic Mini/SE/2 Tylna Oś Ramienia", price: 30, category: "dji-mavic-mini", stock: 8 },
  { name: "Dron DJI Mini 4K Fly More Combo", price: 2069, category: "dji-mavic-mini", stock: 3 },

  // ============ DJI Mavic Mini 2 ============
  { name: "DJI Mavic Mini 2 Środkowa obudowa", price: 49, category: "dji-mavic-mini-2", stock: 6 },
  { name: "DJI Mavic Mini 2 Przednie Lewe Ramię", price: 149, category: "dji-mavic-mini-2", stock: 4 },
  { name: "DJI Mavic Mini 2 Płytka ESC", price: 142, category: "dji-mavic-mini-2", stock: 5 },
  { name: "DJI Mavic Mini 1/2 Taśma gimbala", price: 180, category: "dji-mavic-mini-2", stock: 3 },
  { name: "DJI Mavic Mini / Mini 2 DJI Zestaw części zamiennych", price: 45, category: "dji-mavic-mini-2", stock: 0 },
  { name: "DJI Mavic Mini 2 Klapka akumulatora", price: 19, category: "dji-mavic-mini-2", stock: 8 },
  { name: "DJI Mavic Mini 2 Naklejka osłaniająca przednią diodę led", price: 17, category: "dji-mavic-mini-2", stock: 0 },
  { name: "DJI Mavic Mini 2 SE Przednie Lewe Ramię", price: 149, category: "dji-mavic-mini-2", stock: 4 },
  { name: "DJI Mavic Mini 2 Taśma Flex ESC-CORE", price: 30, category: "dji-mavic-mini-2", stock: 6 },
  { name: "DJI Mavic Mini SE/2 Dolna obudowa", price: 49, category: "dji-mavic-mini-2", stock: 5 },
  { name: "DJI Mavic Mini SE/2 Przednie Prawe Ramię", price: 149, category: "dji-mavic-mini-2", stock: 0 },
  { name: "DJI Mavic Mini SE/2 Taśma Gimbala", price: 90, category: "dji-mavic-mini-2", stock: 4 },
  { name: "DJI Mavic Mini SE/2 Tylne Lewe Ramię", price: 149, category: "dji-mavic-mini-2", stock: 4 },
  { name: "DJI Mavic Mini SE/2 Tylne Prawe Ramię", price: 149, category: "dji-mavic-mini-2", stock: 4 },
  { name: "DJI Mini 2 Aircraft Front LED Light Pipe", price: 20, category: "dji-mavic-mini-2", stock: 8 },
  { name: "DJI Mini 2 Osłona Obiektywu", price: 49, category: "dji-mavic-mini-2", stock: 6 },
  { name: "DJI Mini 2 Propellers", price: 35, category: "dji-mavic-mini-2", stock: 10 },

  // ============ DJI Mavic Pro ============
  { name: "DJI Mavic Pro Adapter Gimbala", price: 69, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro Górna Obudowa", price: 99, category: "dji-mavic-pro", stock: 5 },
  { name: "DJI Mavic Pro GPS", price: 380, category: "dji-mavic-pro", stock: 2 },
  { name: "DJI Mavic Pro Oś Przedniego Ramienia", price: 30, category: "dji-mavic-pro", stock: 8 },
  { name: "DJI Mavic Pro Platinum Płytka ESC", price: 475, category: "dji-mavic-pro", stock: 0 },
  { name: "DJI Mavic Pro Platinum Przednie Lewe Ramię", price: 190, category: "dji-mavic-pro", stock: 0 },
  { name: "DJI Mavic Pro Przednie Lewe ramię z silnikiem", price: 180, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro Przednie Prawe ramię z silnikiem", price: 180, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro PTZ Video Kable", price: 180, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro Taśmy Płyty Głównej", price: 99, category: "dji-mavic-pro", stock: 5 },
  { name: "DJI Mavic Pro Tylna oś Lewe i Prawe", price: 109, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro Tylne Lewe Ramię Z Silnikiem", price: 180, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro Tylne Prawe Ramię Z Silnikiem", price: 180, category: "dji-mavic-pro", stock: 4 },
  { name: "DJI Mavic Pro wentylator", price: 50, category: "dji-mavic-pro", stock: 6 },
  { name: "Mavic Pro Aircraft Elastyczny płaski kabel", price: 99, category: "dji-mavic-pro", stock: 4 },
  { name: "Mavic Pro Forward Vision", price: 199, category: "dji-mavic-pro", stock: 3 },
  { name: "Taśma Gimbala – DJI Mavic Pro", price: 140, category: "dji-mavic-pro", stock: 4 },
  { name: "Tylne Lewe Ramię z Silnikiem – Mavic Pro Platinum", price: 190, category: "dji-mavic-pro", stock: 3 },

  // ============ DJI Phantom 4 ============
  { name: "Czujniki Przednie – DJI Phantom 4", price: 249, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Dolna Obudowa", price: 185, category: "dji-phantom-4", stock: 0 },
  { name: "DJi Phantom 4 Pro / V2 Środkowa Obudowa", price: 199, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Pro Czujniki Tylne", price: 247, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Pro Górna obudowa", price: 99, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 PRO Kamera 4K z Gimbalem", price: 1500, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Pro Moduł GPS", price: 490, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Pro Obsidian Górna Obudowa", price: 90, category: "dji-phantom-4", stock: 0 },
  { name: "DJI Phantom 4 Pro Płytka IMU", price: 129, category: "dji-phantom-4", stock: 4 },
  { name: "DJI Phnatom 4 Pro Czujniki Wizji Przód", price: 190, category: "dji-phantom-4", stock: 3 },
  { name: "DJI Phantom 4 RTK Płyta Głowna Systemu RTK", price: 3889, category: "dji-phantom-4", stock: 1 },
  { name: "Obudowa Górna – DJI Phantom 4 RTK", price: 158, category: "dji-phantom-4", stock: 3 },
  { name: "Phantom 4 Advanced Dolna obudowa", price: 149, category: "dji-phantom-4", stock: 3 },
  { name: "Phantom 4 Pro+ (P4P+) RC z wbudowanym ekranem HDMI Board", price: 790, category: "dji-phantom-4", stock: 2 },
  { name: "Podwozie – Phantom 4 Pro V2", price: 190, category: "dji-phantom-4", stock: 3 },
  { name: "Podwozie do DJI Phantom 4 Pro", price: 240, category: "dji-phantom-4", stock: 2 },

  // ============ DJI Inspire 2 ============
  { name: "DJI Inspire 2 Amortyzator Gimbal (Damper)", price: 119, category: "dji-inspire-2", stock: 4 },
  { name: "DJI Inspire 2 Antena", price: 150, category: "dji-inspire-2", stock: 4 },
  { name: "DJI Inspire 2 Dolna Obudowa", price: 850, category: "dji-inspire-2", stock: 2 },
  { name: "DJI Inspire 2 Fan", price: 140, category: "dji-inspire-2", stock: 4 },
  { name: "DJI Inspire 2 Górna Obudowa", price: 320, category: "dji-inspire-2", stock: 3 },
  { name: "DJI Inspire 2 Komora Baterii", price: 450, category: "dji-inspire-2", stock: 2 },
  { name: "DJI Inspire 2 Lewe Ramię", price: 699, category: "dji-inspire-2", stock: 2 },
  { name: "DJI Inspire 2 Mocowanie Podwozia", price: 90, category: "dji-inspire-2", stock: 5 },
  { name: "DJI Inspire 2 Płytka montażowa śmigła", price: 98, category: "dji-inspire-2", stock: 5 },
  { name: "DJI Inspire 2 Pokrywa Anteny", price: 30, category: "dji-inspire-2", stock: 8 },
  { name: "DJI Inspire 2 Prawe Ramię", price: 699, category: "dji-inspire-2", stock: 2 },
  { name: "DJI Inspire 2 Przedni Czujnik Kolizyjny", price: 420, category: "dji-inspire-2", stock: 2 },
  { name: "DJI Inspire 2 Przednia Pokrywa", price: 70, category: "dji-inspire-2", stock: 5 },
  { name: "DJI Inspire 2 Silnik CCW", price: 390, category: "dji-inspire-2", stock: 3 },
  { name: "DJI Inspire 2 Silnik CW", price: 390, category: "dji-inspire-2", stock: 3 },
  { name: "DJI Inspire 2 Vibrations Absorbing Board", price: 150, category: "dji-inspire-2", stock: 4 },

  // ============ DJI Inspire 1 ============
  { name: "DJI Inspire 1 Left Arm", price: 420, category: "dji-inspire-1", stock: 2 },
  { name: "DJI Inspire 1 Right Arm", price: 420, category: "dji-inspire-1", stock: 2 },

  // ============ DJI Agras ============
  { name: "DJI Agras T30 Pompa Wody", price: 899, category: "dji-agras", stock: 2 },
  { name: "DJI FlyCart 30 – Transportowy", price: 88999, category: "dji-agras", stock: 0 },

  // ============ FIMI ============
  { name: "FIMI X8 IMU", price: 198, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Górna Obudowa", price: 50, category: "fimi", stock: 5 },
  { name: "Fimi X8 Mini GPS Płyta", price: 180, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Kompas Taśma", price: 132, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Przednie Lewe", price: 150, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Przednie Prawe", price: 150, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini PTZ Kabel", price: 226, category: "fimi", stock: 3 },
  { name: "Fimi X8 Mini Śmigła", price: 80, category: "fimi", stock: 6 },
  { name: "FIMI X8 Mini Tasma ESC", price: 90, category: "fimi", stock: 5 },
  { name: "Fimi X8 Mini Tylne Lewe ramie", price: 150, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Tylne Prawe ramie", price: 150, category: "fimi", stock: 4 },
  { name: "Fimi X8 Mini Tylny Lewe ramie", price: 190, category: "fimi", stock: 3 },
  { name: "Fimi X8 SE Środkowa Obudowa", price: 115, category: "fimi", stock: 4 },
  { name: "Fimi X8SE Przednie Lewe Ramię", price: 190, category: "fimi", stock: 3 },
  { name: "Fimi X8SE Przednie Prawe Ramię", price: 190, category: "fimi", stock: 3 },
  { name: "Fimi X8SE Tylny Lewe Ramię", price: 190, category: "fimi", stock: 3 },
  { name: "Fimi X8SE Tylny Prawe Ramię", price: 190, category: "fimi", stock: 3 },

  // ============ Kontrolery ============
  { name: "DJI RC 2 Kontroler", price: 1499, category: "kontrolery", stock: 5 },
  { name: "DJI RC Pro 2 Kontroler", price: 4999, category: "kontrolery", stock: 3 },
  { name: "DJI RC Pro Remote Controller", price: 4999, category: "kontrolery", stock: 2 },
  { name: "DJI RC Pro Enterprise Kontroler", price: 4784, category: "kontrolery", stock: 2 },
  { name: "DJI RC Moduł lewego drążka sterującego", price: 150, category: "kontrolery", stock: 5 },
  { name: "DJI RC Moduł prawego drążka sterującego", price: 150, category: "kontrolery", stock: 5 },
  { name: "Płytka portu USB", price: 29, category: "kontrolery", stock: 10 },

  // ============ Accesorios ============
  { name: "Lądowisko do dronów 75cm", price: 89, category: "accesorios", stock: 15 },
  { name: "Lądowisko do dronów 110cm", price: 149, category: "accesorios", stock: 10 },
  { name: "Plecak na drona DJI", price: 399, category: "accesorios", stock: 8 },
  { name: "Karta microSD SanDisk Extreme PRO 256GB", price: 199, category: "accesorios", stock: 20 },
  { name: "Karta microSD SanDisk Extreme PRO 512GB", price: 349, category: "accesorios", stock: 15 },
  { name: "Filtry ND dla DJI Mavic 4 Pro (zestaw 4 szt.)", price: 299, category: "accesorios", stock: 10 },
  { name: "Filtry ND dla DJI Mini 4 Pro (zestaw 4 szt.)", price: 199, category: "accesorios", stock: 12 },
  { name: "ND/PL filters Bright Day for GoPro HERO9 i HERO10 Black", price: 311, category: "accesorios", stock: 5 },
  { name: "MicaSense RedEdge-P", price: 15000, category: "accesorios", stock: 0 },
  { name: "MicaSense RedEdge-P Dual", price: 25000, category: "accesorios", stock: 0 },
  { name: "Micasense Altum PT", price: 35000, category: "accesorios", stock: 0 },
  { name: "Micasense Altum PT z DJI Skyport", price: 38000, category: "accesorios", stock: 0 },
  { name: "Exway Flex Hub E-longboard", price: 3523, category: "accesorios", stock: 2 },
  { name: "Exway Flex Riot E-longboard", price: 3720, category: "accesorios", stock: 2 },
  { name: "Exway Wave Hub E-skateboard", price: 3462, category: "accesorios", stock: 2 },
];

async function main() {
  console.log("🔄 Sincronizando catálogo completo (~450 productos)...\n");

  // Brands
  let djiBrand = await prisma.brand.findUnique({ where: { slug: "dji" } });
  if (!djiBrand) {
    djiBrand = await prisma.brand.create({ data: { name: "DJI", slug: "dji", description: "World's leading drone manufacturer" } });
  }
  let xagBrand = await prisma.brand.findUnique({ where: { slug: "xag" } });
  if (!xagBrand) {
    xagBrand = await prisma.brand.create({ data: { name: "XAG", slug: "xag", description: "Agricultural drone specialist" } });
  }
  let autelBrand = await prisma.brand.findUnique({ where: { slug: "autel" } });
  if (!autelBrand) {
    autelBrand = await prisma.brand.create({ data: { name: "Autel", slug: "autel", description: "Autel Robotics drones" } });
  }
  let fimiBrand = await prisma.brand.findUnique({ where: { slug: "fimi" } });
  if (!fimiBrand) {
    fimiBrand = await prisma.brand.create({ data: { name: "FIMI", slug: "fimi", description: "FIMI drones" } });
  }

  // Clean
  console.log("Limpiando datos existentes...");
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  console.log("Creando categorías...");
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: { name: cat.name, slug: cat.slug } });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} categorías creadas`);

  // Products
  console.log("\nCreando productos...");
  let count = 0;
  for (const product of products) {
    const slug = slugify(product.name);
    const nettoPrice = toNetto(product.price);

    let brandId = djiBrand.id;
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes("xag")) brandId = xagBrand.id;
    else if (nameLower.includes("autel") || nameLower.includes("evo max") || nameLower.includes("evo ii") || nameLower.includes("dragonfish")) brandId = autelBrand.id;
    else if (nameLower.includes("fimi")) brandId = fimiBrand.id;

    await prisma.product.create({
      data: {
        name: product.name,
        slug,
        description: `${product.name} - Oryginalna część zamienna od drone-partss.com`,
        price: nettoPrice,
        stock: product.stock,
        isActive: true,
        isFeatured: product.price > 2000,
        categoryId: categoryMap[product.category],
        brandId,
        images: {
          create: { url: "/images/products/dji-care.jpg", alt: product.name, position: 0 }
        }
      }
    });
    count++;
    if (count % 50 === 0) console.log(`   ${count} productos creados...`);
  }

  console.log(`\n✅ Sincronización completada:`);
  console.log(`   - ${categories.length} categorías`);
  console.log(`   - ${count} productos`);
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
