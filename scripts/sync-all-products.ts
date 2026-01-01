import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const publicDir = path.join(process.cwd(), "public", "images", "products");

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toNetto(brutto: number): number {
  return Math.round((brutto / 1.23) * 100) / 100;
}

function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    const filePath = path.join(publicDir, filename);

    if (fs.existsSync(filePath)) {
      resolve(true);
      return;
    }

    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filePath);

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filePath);
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filename).then(resolve);
        } else {
          resolve(false);
        }
      } else {
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(false);
      }
    }).on("error", () => {
      file.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      resolve(false);
    });
  });
}

// Categories
const categories = [
  { name: "XAG", slug: "xag" },
  { name: "DJI Mavic 4 Pro", slug: "dji-mavic-4-pro" },
  { name: "DJI Mini 5 Pro", slug: "dji-mini-5-pro" },
  { name: "DJI Mini 4 Pro", slug: "dji-mini-4-pro" },
  { name: "DJI Mini 3 Pro", slug: "dji-mini-3-pro" },
  { name: "DJI Mavic 3", slug: "dji-mavic-3" },
  { name: "DJI Mavic 3 Pro", slug: "dji-mavic-3-pro" },
  { name: "DJI Mavic 3 Enterprise", slug: "dji-mavic-3-enterprise" },
  { name: "DJI Matrice 30", slug: "dji-matrice-30" },
  { name: "Autel Max 4T", slug: "autel-max-4t" },
  { name: "DJI Avata 2", slug: "dji-avata-2" },
  { name: "DJI Avata", slug: "dji-avata" },
  { name: "DJI FPV", slug: "dji-fpv" },
  { name: "DJI Neo", slug: "dji-neo" },
  { name: "DJI Flip", slug: "dji-flip" },
  { name: "DJI Mavic Air 2", slug: "dji-mavic-air-2" },
  { name: "DJI Mavic Air 2S", slug: "dji-mavic-air-2s" },
  { name: "DJI Mavic Mini 2", slug: "dji-mavic-mini-2" },
  { name: "DJI Phantom 4", slug: "dji-phantom-4" },
  { name: "Accesorios", slug: "accesorios" },
  { name: "Kontrolery", slug: "kontrolery" },
];

// Products with correct data
const products = [
  // XAG Products
  { name: "XAG P100 Pro Dron Rolniczy", price: 37058, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg", stock: 2 },
  { name: "XAG P100 Pro Kompletny zestaw 6 Baterii", price: 81073, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/12/P100Set-1.jpg", stock: 1 },
  { name: "XAG P150 Max Dron Rolniczy", price: 95000, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/P100-Pro.jpg", stock: 1 },
  { name: "XAG B13960S Akumulator", price: 6199, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/B13960S.jpg", stock: 5 },
  { name: "XAG GC4000+ Agregat", price: 6148, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/GC4000.jpg", stock: 3 },
  { name: "XAG ARC3 Pro z RTK", price: 5062, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/Acs3Pro.jpg", stock: 2 },
  { name: "XAG RevoSpray P3 Moduł opryskiwacza", price: 6370, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/Revospray3.jpg", stock: 4 },
  { name: "XAG RevoCast P3 Moduł rozsiewacza", price: 11472, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/Revocast3.jpg", stock: 3 },
  { name: "XAG XRTK4 Baza RTK", price: 6199, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/XRTK.jpg", stock: 2 },
  { name: "XAG Statyw stacji", price: 890, category: "xag", image: "https://drone-partss.com/wp-content/uploads/2024/01/Tripod.jpg", stock: 5 },

  // DJI Mavic 4 Pro
  { name: "Dron DJI Mavic 4 Pro", price: 10499, category: "dji-mavic-4-pro", image: "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg", stock: 5 },
  { name: "Dron DJI Mavic 4 Pro Fly More Combo (DJI RC 2)", price: 13999, category: "dji-mavic-4-pro", image: "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg", stock: 3 },
  { name: "Dron DJI Mavic 4 Pro 512GB Creator Combo (DJI RC Pro 2)", price: 17999, category: "dji-mavic-4-pro", image: "https://drone-partss.com/wp-content/uploads/2025/05/pol_pl_Dron-DJI-Mavic-4-Pro-52544_1.jpg", stock: 2 },
  { name: "DJI Mavic 4 Pro Akumulator", price: 899, category: "dji-mavic-4-pro", image: "https://drone-partss.com/wp-content/uploads/2025/05/pol_pm_Akumulator-DJI-Mavic-4-Pro-52541_6.jpg", stock: 10 },

  // DJI Mini 5 Pro
  { name: "Dron DJI Mini 5 Pro", price: 4199, category: "dji-mini-5-pro", image: "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp", stock: 5 },
  { name: "Dron DJI Mini 5 Pro Fly More Combo (DJI RC2)", price: 5699, category: "dji-mini-5-pro", image: "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Dron-DJI-Mini-5-Pro-Fly-More-Combo-DJI-RC2-32507_10.webp", stock: 3 },
  { name: "Inteligentny akumulator DJI Mini 5 Pro", price: 449, category: "dji-mini-5-pro", image: "https://drone-partss.com/wp-content/uploads/2025/10/pol_pl_Inteligentny-akumulator-DJI-Mini-5-Pro-32508_3.webp", stock: 15 },

  // DJI Mini 4 Pro
  { name: "Dron DJI Mini 4 Pro", price: 3699, category: "dji-mini-4-pro", image: "https://drone-partss.com/wp-content/uploads/2023/04/PTZMini3Pro.jpg", stock: 4 },
  { name: "Dron DJI Mini 4 Pro Fly More Combo (DJI RC 2)", price: 4999, category: "dji-mini-4-pro", image: "https://drone-partss.com/wp-content/uploads/2023/04/PTZMini3Pro.jpg", stock: 3 },
  { name: "DJI Mini 4 Pro Obudowa Środkowa", price: 50, category: "dji-mini-4-pro", image: "https://drone-partss.com/wp-content/uploads/2023/04/PTZMini3Pro.jpg", stock: 8 },
  { name: "DJI Mini 4 Pro Dolna Obudowa", price: 45, category: "dji-mini-4-pro", image: "https://drone-partss.com/wp-content/uploads/2023/04/PTZMini3Pro.jpg", stock: 6 },
  { name: "DJI Mini 4 Pro Górna Obudowa", price: 65, category: "dji-mini-4-pro", image: "https://drone-partss.com/wp-content/uploads/2023/04/PTZMini3Pro.jpg", stock: 5 },

  // DJI Mavic 3
  { name: "DJI Mavic 3 Górna obudowa", price: 89, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 5 },
  { name: "DJI Mavic 3 Środkowa obudowa", price: 83, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 4 },
  { name: "DJI Mavic 3 Aircraft Rear Cover", price: 35, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 10 },
  { name: "DJI Mavic 3 Oś Przedniego Ramienia Prawa", price: 49, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 5 },
  { name: "DJI Mavic 3 Oś Tylnego Ramienia", price: 59, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 4 },
  { name: "DJI Mavic 3 Cine Przednie lewe ramię z silnikiem", price: 190, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 3 },
  { name: "DJI Mavic 3 Ładowarka Hub 200W", price: 650, category: "dji-mavic-3", image: "https://drone-partss.com/wp-content/uploads/2024/12/dji-mavic-3-capot-arriere-2.webp", stock: 0 },

  // DJI Mavic 3 Pro
  { name: "Dron DJI Mavic 3 Pro", price: 9999, category: "dji-mavic-3-pro", image: "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3LoweAbsorbing.jpg", stock: 3 },
  { name: "Dron DJI Mavic 3 Pro Fly More Combo", price: 12499, category: "dji-mavic-3-pro", image: "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3LoweAbsorbing.jpg", stock: 2 },
  { name: "Dron DJI Mavic 3 Pro Cine Premium Combo", price: 16999, category: "dji-mavic-3-pro", image: "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3LoweAbsorbing.jpg", stock: 1 },
  { name: "DJI Mavic 3 Pro Dolna płyta pochłaniająca wibracje", price: 65, category: "dji-mavic-3-pro", image: "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3LoweAbsorbing.jpg", stock: 8 },
  { name: "DJI Mavic 3 Pro Górna płyta pochłaniająca wibracje", price: 65, category: "dji-mavic-3-pro", image: "https://drone-partss.com/wp-content/uploads/2024/12/Mavic3UpperVi.jpg", stock: 6 },

  // DJI Mavic 3 Enterprise
  { name: "DJI Mavic 3 Enterprise + DJI Care 2 lata", price: 22999, category: "dji-mavic-3-enterprise", image: "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg", stock: 2 },
  { name: "DJI Mavic 3 Multispectral + DJI Care 2 lata", price: 28999, category: "dji-mavic-3-enterprise", image: "https://drone-partss.com/wp-content/uploads/2024/02/Multi2.jpg", stock: 1 },
  { name: "DJI Mavic 3 Enterprise Battery Kit", price: 4999, category: "dji-mavic-3-enterprise", image: "https://drone-partss.com/wp-content/uploads/2024/02/Enterprise1.jpg", stock: 4 },

  // DJI Matrice 30
  { name: "DJI Matrice 30T z kamerą termowizyjną", price: 42599, category: "dji-matrice-30", image: "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg", stock: 0 },
  { name: "TB30 DJI Matrice 30 Bateria akumulator", price: 1599, category: "dji-matrice-30", image: "https://drone-partss.com/wp-content/uploads/2024/03/TB302.jpg", stock: 0 },
  { name: "DJI RC Plus Zewnętrzna antena (zestaw)", price: 180, category: "dji-matrice-30", image: "https://drone-partss.com/wp-content/uploads/2024/03/M30T1.jpg", stock: 5 },

  // Autel Max 4T
  { name: "EVO MAX 4T Standard Bundle", price: 42500, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/11/Max4-Pro.jpg", stock: 0 },
  { name: "EVO MAX 4T Standard Bundle Public Safe Version", price: 42500, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/11/Max4-Pro.jpg", stock: 0 },
  { name: "Autel Max 4T Bateria Akumulator", price: 1699, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/11/Max4-Pro.jpg", stock: 0 },
  { name: "Autel Max Ładowarka", price: 555, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/12/AutelMax.jpg", stock: 3 },
  { name: "Autel EVO Max 4T Multi Charger Hub", price: 1199, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/11/Max4-Pro.jpg", stock: 0 },
  { name: "Autel EVO Max Śmigło (2 szt.)", price: 99, category: "autel-max-4t", image: "https://drone-partss.com/wp-content/uploads/2023/11/Max4-Pro.jpg", stock: 0 },

  // DJI Avata 2
  { name: "DJI Avata 2", price: 2899, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg", stock: 4 },
  { name: "DJI Avata 2 Fly More Combo", price: 4499, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg", stock: 2 },
  { name: "DJI Avata 2 Akumulator bateria", price: 550, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2025/09/pol_pl_Akumulator-bateria-DJI-Avata-2-42205_3.jpg", stock: 10 },
  { name: "DJI Goggles 3", price: 2999, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg", stock: 3 },
  { name: "Avata 2 Front Right Aircraft Arm", price: 39, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg", stock: 8 },
  { name: "Avata 2 Rear Left Aircraft Arm", price: 39, category: "dji-avata-2", image: "https://drone-partss.com/wp-content/uploads/2024/06/Avata2-1.jpg", stock: 8 },

  // DJI Avata
  { name: "DJI Avata Akumulator", price: 580, category: "dji-avata", image: "https://drone-partss.com/wp-content/uploads/2025/09/pol_pm_-Akumulator-bateria-DJI-Avata-2420mAh-25562_2.jpg", stock: 5 },
  { name: "DJI Avata Górna Osłona", price: 110, category: "dji-avata", image: "https://drone-partss.com/wp-content/uploads/2025/09/pol_pm_-Akumulator-bateria-DJI-Avata-2420mAh-25562_2.jpg", stock: 6 },
  { name: "DJI Avata Moduł ESC", price: 290, category: "dji-avata", image: "https://drone-partss.com/wp-content/uploads/2025/09/pol_pm_-Akumulator-bateria-DJI-Avata-2420mAh-25562_2.jpg", stock: 4 },
  { name: "DJI Avata Osłony śmigieł", price: 149, category: "dji-avata", image: "https://drone-partss.com/wp-content/uploads/2025/09/pol_pm_-Akumulator-bateria-DJI-Avata-2420mAh-25562_2.jpg", stock: 10 },

  // DJI FPV
  { name: "DJI FPV Combo", price: 5999, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPVUpper.jpg", stock: 2 },
  { name: "DJI FPV Motion Controller", price: 799, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/FPVJostick.jpg", stock: 5 },
  { name: "DJI FPV Akumulator", price: 699, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPV.jpg", stock: 8 },
  { name: "DJI FPV Górna obudowa", price: 56, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/DJIFPVUpper.jpg", stock: 6 },
  { name: "DJI FPV Adaptery montażowe śmigieł", price: 29, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/03/FPVMounting.jpg", stock: 15 },
  { name: "DJI FPV Antena ADS-B", price: 20, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/FPVADB.jpg", stock: 10 },
  { name: "DJI FPV moduł drążków pilota", price: 207, category: "dji-fpv", image: "https://drone-partss.com/wp-content/uploads/2024/01/FPVJostick.jpg", stock: 4 },

  // DJI Neo
  { name: "Dron DJI Neo Motion Fly More Combo", price: 2499, category: "dji-neo", image: "https://drone-partss.com/wp-content/uploads/2025/03/NeoMotions.jpg", stock: 5 },
  { name: "DJI Neo", price: 1199, category: "dji-neo", image: "https://drone-partss.com/wp-content/uploads/2025/04/MainBody-Neo.jpg", stock: 8 },
  { name: "DJI Neo Obudowa", price: 80, category: "dji-neo", image: "https://drone-partss.com/wp-content/uploads/2025/04/MainBody-Neo.jpg", stock: 6 },
  { name: "DJI Neo Dolna Obudowa", price: 79, category: "dji-neo", image: "https://drone-partss.com/wp-content/uploads/2025/04/NeoLowercover.jpg", stock: 8 },
  { name: "DJI Neo Przedni silnik napędowy", price: 107, category: "dji-neo", image: "https://drone-partss.com/wp-content/uploads/2025/04/MainBody-Neo.jpg", stock: 10 },

  // DJI Flip
  { name: "DJI Flip", price: 2069, category: "dji-flip", image: "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg", stock: 5 },
  { name: "DJI Flip Fly More Combo (DJI RC2)", price: 3649, category: "dji-flip", image: "https://drone-partss.com/wp-content/uploads/2025/03/Flip.jpg", stock: 3 },

  // Kontrolery
  { name: "DJI RC 2 Kontroler", price: 1499, category: "kontrolery", image: "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg", stock: 5 },
  { name: "DJI RC Pro 2 Kontroler", price: 4999, category: "kontrolery", image: "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg", stock: 3 },
  { name: "DJI RC Pro Remote Controller", price: 4999, category: "kontrolery", image: "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg", stock: 2 },
  { name: "DJI RC Pro Enterprise Kontroler", price: 5999, category: "kontrolery", image: "https://drone-partss.com/wp-content/uploads/2024/01/UpperShell.jpg", stock: 2 },

  // Accesorios
  { name: "Lądowisko do dronów 75cm", price: 89, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 15 },
  { name: "Lądowisko do dronów 110cm", price: 149, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 10 },
  { name: "Plecak na drona DJI", price: 399, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 8 },
  { name: "Karta microSD SanDisk Extreme PRO 256GB", price: 199, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 20 },
  { name: "Karta microSD SanDisk Extreme PRO 512GB", price: 349, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 15 },
  { name: "Filtry ND dla DJI Mavic 4 Pro (zestaw 4 szt.)", price: 299, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 10 },
  { name: "Filtry ND dla DJI Mini 4 Pro (zestaw 4 szt.)", price: 199, category: "accesorios", image: "https://drone-partss.com/wp-content/uploads/2024/05/DJI.jpg", stock: 12 },

  // DJI Mini 3 Pro
  { name: "DJI Akumulator do Mini 3 Pro", price: 349, category: "dji-mini-3-pro", image: "https://drone-partss.com/wp-content/uploads/2023/08/Mini3Bateria.jpg", stock: 10 },
  { name: "DJI Mini 3 Pro Obudowa Środkowa", price: 49, category: "dji-mini-3-pro", image: "https://drone-partss.com/wp-content/uploads/2023/08/Mini3Bateria.jpg", stock: 6 },
  { name: "DJI Mini 3 Pro Górna Obudowa", price: 59, category: "dji-mini-3-pro", image: "https://drone-partss.com/wp-content/uploads/2023/08/Mini3Bateria.jpg", stock: 5 },
  { name: "DJI Mini 3 Pro Dolna Obudowa", price: 25, category: "dji-mini-3-pro", image: "https://drone-partss.com/wp-content/uploads/2023/08/Mini3Bateria.jpg", stock: 8 },

  // DJI Mavic Air 2
  { name: "DJI Mavic Air 2 Górna Obudowa", price: 80, category: "dji-mavic-air-2", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 5 },
  { name: "DJI Mavic Air 2 Dolna Obudowa", price: 110, category: "dji-mavic-air-2", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 4 },
  { name: "DJI Mavic Air 2 ESC Płyta", price: 250, category: "dji-mavic-air-2", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 3 },
  { name: "DJI Mavic Air 2 Przednie Lewe Ramię", price: 180, category: "dji-mavic-air-2", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 4 },

  // DJI Mavic Air 2S
  { name: "DJI Mavic Air 2S Dolna Obudowa", price: 179, category: "dji-mavic-air-2s", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 4 },
  { name: "DJI Mavic Air 2S Środkowa Obudowa", price: 99, category: "dji-mavic-air-2s", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 5 },
  { name: "DJI Mavic Air 2/2S Oś Przedniego Ramienia", price: 38, category: "dji-mavic-air-2s", image: "https://drone-partss.com/wp-content/uploads/2020/09/landiggearair2left-2.jpg", stock: 8 },

  // DJI Mavic Mini 2
  { name: "DJI Mavic Mini 2 Środkowa obudowa", price: 49, category: "dji-mavic-mini-2", image: "https://drone-partss.com/wp-content/uploads/2023/05/GkasMini2.jpg", stock: 6 },
  { name: "DJI Mavic Mini 2 Przednie Lewe Ramię", price: 149, category: "dji-mavic-mini-2", image: "https://drone-partss.com/wp-content/uploads/2023/05/GkasMini2.jpg", stock: 4 },
  { name: "DJI Mavic Mini 2 Płytka ESC", price: 142, category: "dji-mavic-mini-2", image: "https://drone-partss.com/wp-content/uploads/2023/05/GkasMini2.jpg", stock: 5 },
  { name: "DJI Mavic Mini 1/2 Taśma gimbala", price: 180, category: "dji-mavic-mini-2", image: "https://drone-partss.com/wp-content/uploads/2023/05/GkasMini2.jpg", stock: 3 },
];

async function main() {
  console.log("🔄 Sincronizando todos los productos...\n");

  // Step 1: Get or create brand
  console.log("1. Verificando marcas...");
  let djiBrand = await prisma.brand.findUnique({ where: { slug: "dji" } });
  if (!djiBrand) {
    djiBrand = await prisma.brand.create({
      data: { name: "DJI", slug: "dji", description: "World's leading drone manufacturer" }
    });
  }

  let xagBrand = await prisma.brand.findUnique({ where: { slug: "xag" } });
  if (!xagBrand) {
    xagBrand = await prisma.brand.create({
      data: { name: "XAG", slug: "xag", description: "Agricultural drone specialist" }
    });
  }

  let autelBrand = await prisma.brand.findUnique({ where: { slug: "autel" } });
  if (!autelBrand) {
    autelBrand = await prisma.brand.create({
      data: { name: "Autel", slug: "autel", description: "Autel Robotics drones" }
    });
  }

  // Step 2: Delete existing products and images
  console.log("2. Limpiando productos existentes...");
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Step 3: Create categories
  console.log("3. Creando categorías...");
  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug }
    });
    categoryMap[cat.slug] = created.id;
    console.log(`   ✅ ${cat.name}`);
  }

  // Step 4: Download images and create products
  console.log("\n4. Descargando imágenes y creando productos...");

  let created = 0;
  let imagesDownloaded = 0;

  for (const product of products) {
    const slug = slugify(product.name);
    const nettoPrice = toNetto(product.price);

    // Determine brand
    let brandId = djiBrand.id;
    if (product.name.toLowerCase().includes("xag")) {
      brandId = xagBrand.id;
    } else if (product.name.toLowerCase().includes("autel") || product.name.toLowerCase().includes("evo max")) {
      brandId = autelBrand.id;
    }

    // Download image
    const imageFilename = `${slug}.${product.image.split(".").pop() || "jpg"}`;
    const downloaded = await downloadImage(product.image, imageFilename);
    if (downloaded) imagesDownloaded++;

    const localImagePath = downloaded ? `/images/products/${imageFilename}` : "/images/products/dji-care.jpg";

    // Create product
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug,
        description: `${product.name} - Oryginalna część zamienna.`,
        price: nettoPrice,
        stock: product.stock,
        isActive: true,
        isFeatured: product.price > 1000,
        categoryId: categoryMap[product.category],
        brandId,
        images: {
          create: {
            url: localImagePath,
            alt: product.name,
            position: 0
          }
        }
      }
    });

    console.log(`   ✅ ${product.name} (${nettoPrice} PLN netto)`);
    created++;
  }

  console.log(`\n✅ Sincronización completada:`);
  console.log(`   - ${categories.length} categorías creadas`);
  console.log(`   - ${created} productos creados`);
  console.log(`   - ${imagesDownloaded} imágenes descargadas`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
