import nodemailer from "nodemailer";
import prisma from "./prisma";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  companyName?: string;
  vatNumber?: string;
  shippingMethod?: string;
}

interface OrderInfo {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  trackingNumber?: string;
  carrier?: string;
  locale?: string;
}

type Locale = "pl" | "en" | "es";

// Email translations for all supported languages
const emailTranslations: Record<Locale, {
  // Customer email - order confirmation
  thankYou: string;
  orderReceived: string;
  orderNumber: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  total: string;
  shippingAddress: string;
  nextSteps: string;
  nextStepsDesc: string;
  continueShopping: string;
  questions: string;
  allRightsReserved: string;
  product: string;
  qty: string;
  price: string;
  // Customer email - shipped
  orderOnTheWay: string;
  orderShipped: string;
  carrier: string;
  trackingNumber: string;
  trackOn: string;
  // Admin email
  newOrder: string;
  newOrderFrom: string;
  billingInfo: string;
  paymentMethod: string;
  manageOrder: string;
  inTheApp: string;
  // Date locale
  dateLocale: string;
}> = {
  pl: {
    thankYou: "Dziękujemy za zamówienie!",
    orderReceived: "Otrzymaliśmy Twoje zamówienie i je przetwarzamy.",
    orderNumber: "Numer zamówienia",
    orderSummary: "Podsumowanie zamówienia",
    subtotal: "Suma częściowa",
    shipping: "Wysyłka",
    total: "Razem",
    shippingAddress: "Adres dostawy",
    nextSteps: "Kolejne kroki:",
    nextStepsDesc: "Wyślemy Ci e-mail, gdy zamówienie zostanie wysłane z numerem śledzenia.",
    continueShopping: "Kontynuuj zakupy",
    questions: "Pytania? Skontaktuj się z nami",
    allRightsReserved: "Wszelkie prawa zastrzeżone.",
    product: "Produkt",
    qty: "Ilość",
    price: "Cena",
    orderOnTheWay: "Twoje zamówienie jest w drodze!",
    orderShipped: "zostało wysłane.",
    carrier: "Przewoźnik",
    trackingNumber: "Numer śledzenia",
    trackOn: "Śledź na",
    newOrder: "Nowe zamówienie",
    newOrderFrom: "Otrzymałeś nowe zamówienie od",
    billingInfo: "Dane do faktury",
    paymentMethod: "Metoda płatności",
    manageOrder: "Zarządzaj zamówieniem",
    inTheApp: "w aplikacji.",
    dateLocale: "pl-PL",
  },
  en: {
    thankYou: "Thank you for your order!",
    orderReceived: "We have received your order and are processing it.",
    orderNumber: "Order Number",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    shippingAddress: "Shipping Address",
    nextSteps: "Next Steps:",
    nextStepsDesc: "We will send you an email when your order is shipped with tracking information.",
    continueShopping: "Continue Shopping",
    questions: "Questions? Contact us at",
    allRightsReserved: "All rights reserved.",
    product: "Product",
    qty: "Qty",
    price: "Price",
    orderOnTheWay: "Your order is on the way!",
    orderShipped: "has been shipped.",
    carrier: "Carrier",
    trackingNumber: "Tracking Number",
    trackOn: "Track on",
    newOrder: "New Order",
    newOrderFrom: "You have received a new order from",
    billingInfo: "Billing Information",
    paymentMethod: "Payment Method",
    manageOrder: "Manage order",
    inTheApp: "in the app.",
    dateLocale: "en-US",
  },
  es: {
    thankYou: "¡Gracias por tu pedido!",
    orderReceived: "Hemos recibido tu pedido y lo estamos procesando.",
    orderNumber: "Número de pedido",
    orderSummary: "Resumen del pedido",
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
    shippingAddress: "Dirección de envío",
    nextSteps: "Próximos pasos:",
    nextStepsDesc: "Te enviaremos un email cuando tu pedido sea enviado con el número de seguimiento.",
    continueShopping: "Seguir comprando",
    questions: "¿Preguntas? Contáctanos en",
    allRightsReserved: "Todos los derechos reservados.",
    product: "Producto",
    qty: "Cant.",
    price: "Precio",
    orderOnTheWay: "¡Tu pedido está en camino!",
    orderShipped: "ha sido enviado.",
    carrier: "Transportista",
    trackingNumber: "Número de seguimiento",
    trackOn: "Seguir en",
    newOrder: "Nuevo pedido",
    newOrderFrom: "Has recibido un nuevo pedido de",
    billingInfo: "Datos de facturación",
    paymentMethod: "Método de pago",
    manageOrder: "Gestionar pedido",
    inTheApp: "en la aplicación.",
    dateLocale: "es-ES",
  },
};

function getLocale(locale?: string): Locale {
  if (locale === "pl" || locale === "en" || locale === "es") {
    return locale;
  }
  return "pl"; // Default to Polish
}

// Get settings from database
async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

// Create email transporter
async function createTransporter() {
  const settings = await getSettings();

  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_password) {
    return null;
  }

  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: parseInt(settings.smtp_port || "587"),
    secure: settings.smtp_port === "465",
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_password,
    },
  });
}

// Send email
async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[EMAIL] sendEmail called - to: ${to}, subject: ${subject}`);
  try {
    const settings = await getSettings();
    console.log(`[EMAIL] SMTP settings - host: ${settings.smtp_host}, user: ${settings.smtp_user}, from: ${settings.smtp_from_email}`);
    const transporter = await createTransporter();

    if (!transporter) {
      console.log("[EMAIL] SMTP not configured - missing host, user or password");
      return false;
    }

    console.log(`[EMAIL] Transporter created, sending to: ${to}`);

    await transporter.sendMail({
      from: `"${settings.smtp_from_name || "Drone-Partss"}" <${settings.smtp_from_email || settings.smtp_user}>`,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] Successfully sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
    return false;
  }
}

// Send SMS via Vonage
async function sendSMS(to: string, message: string) {
  try {
    const settings = await getSettings();

    if (!settings.vonage_api_key || !settings.vonage_api_secret) {
      return false;
    }

    const response = await fetch("https://rest.nexmo.com/sms/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: settings.vonage_api_key,
        api_secret: settings.vonage_api_secret,
        from: settings.vonage_from_number || "DroneParts",
        to: to.replace(/[^0-9+]/g, ""),
        text: message,
      }),
    });

    const data = await response.json();
    return data.messages?.[0]?.status === "0";
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

// Generate items table HTML
function generateItemsTable(items: OrderItem[], t: typeof emailTranslations["pl"]): string {
  if (!items || items.length === 0) return "";

  const rows = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: left;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${item.price.toFixed(2)} zł</td>
    </tr>
  `).join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f8f8f8;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e5e5;">${t.product}</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e5e5;">${t.qty}</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e5e5;">${t.price}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Admin email template (always in Polish for admin)
function generateAdminEmailTemplate(order: OrderInfo): string {
  const t = emailTranslations.pl;
  const date = new Date().toLocaleDateString(t.dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const itemsTable = generateItemsTable(order.items || [], t);
  const address = order.shippingAddress;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #8B5CF6; padding: 30px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">${t.newOrder}: ${order.orderNumber}</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <p style="color: #666; margin: 0 0 20px;">
        ${t.newOrderFrom} <strong>${order.customerName}</strong>:
      </p>

      <p style="margin: 0 0 20px;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/admin/orders" style="color: #8B5CF6; font-weight: bold;">
          [Zamówienie ${order.orderNumber}]
        </a>
        <span style="color: #8B5CF6; font-weight: bold;">(${date})</span>
      </p>

      ${itemsTable}

      <table style="width: 100%; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>${t.subtotal}:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.subtotal || order.total).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>${t.shipping}:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.shippingCost || 0).toFixed(2)} zł ${order.carrier ? `(${order.carrier})` : ""}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>${t.paymentMethod}:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${order.paymentMethod || "Przelewy24"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0;"><strong style="font-size: 18px;">${t.total}:</strong></td>
          <td style="padding: 12px 0; text-align: right;"><strong style="font-size: 18px;">${order.total.toFixed(2)} zł</strong></td>
        </tr>
      </table>

      ${address ? `
      <div style="display: flex; margin-top: 30px;">
        <div style="flex: 1; padding-right: 20px;">
          <h3 style="color: #8B5CF6; margin: 0 0 15px; font-size: 16px;">${t.billingInfo}</h3>
          <div style="background: #f8f8f8; padding: 15px; border-radius: 4px;">
            <p style="margin: 0 0 5px;">${address.firstName} ${address.lastName}</p>
            ${address.companyName ? `<p style="margin: 0 0 5px;">${address.companyName}</p>` : ""}
            <p style="margin: 0 0 5px;">${address.address}</p>
            <p style="margin: 0 0 5px;">${address.postalCode} ${address.city}</p>
            <p style="margin: 0 0 5px;"><a href="tel:${address.phone}" style="color: #8B5CF6;">${address.phone}</a></p>
            <p style="margin: 0;"><a href="mailto:${address.email}" style="color: #8B5CF6;">${address.email}</a></p>
          </div>
        </div>
        <div style="flex: 1; padding-left: 20px;">
          <h3 style="color: #8B5CF6; margin: 0 0 15px; font-size: 16px;">${t.shippingAddress}</h3>
          <div style="background: #f8f8f8; padding: 15px; border-radius: 4px;">
            <p style="margin: 0 0 5px;">${address.firstName} ${address.lastName}</p>
            <p style="margin: 0 0 5px;">${address.address}</p>
            <p style="margin: 0;">${address.postalCode} ${address.city}</p>
          </div>
        </div>
      </div>
      ` : ""}

      <p style="margin: 30px 0 10px; color: #666;">Wszystko w porządku.</p>
      <p style="margin: 0;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/admin/orders" style="color: #8B5CF6;">
          ${t.manageOrder}
        </a> ${t.inTheApp}
      </p>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p style="margin: 0;">Drone-Partss - Części do Dronów</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Customer email template (in customer's language)
function generateCustomerEmailTemplate(order: OrderInfo, locale: Locale): string {
  const t = emailTranslations[locale];
  const date = new Date().toLocaleDateString(t.dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const itemsTable = generateItemsTable(order.items || [], t);
  const address = order.shippingAddress;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Drone-Partss</h1>
      <p style="color: #999; margin: 10px 0 0;">Drone Parts</p>
    </div>

    <div style="background: white; padding: 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">${t.thankYou}</h2>
        <p style="color: #666; margin: 0;">${t.orderReceived}</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="color: #666; margin: 0 0 5px; font-size: 14px;">${t.orderNumber}</p>
        <p style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: bold;">#${order.orderNumber}</p>
        <p style="color: #666; margin: 10px 0 0; font-size: 14px;">${date}</p>
      </div>

      <h3 style="color: #1a1a1a; margin: 0 0 15px; font-size: 16px;">${t.orderSummary}</h3>
      ${itemsTable}

      <table style="width: 100%; margin: 20px 0; background: #f8f8f8; border-radius: 8px;">
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">${t.subtotal}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.subtotal || order.total).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">${t.shipping} (${order.carrier || "Standard"})</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.shippingCost || 0).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 15px; font-weight: bold; font-size: 18px;">${t.total}</td>
          <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">${order.total.toFixed(2)} zł</td>
        </tr>
      </table>

      ${address ? `
      <h3 style="color: #1a1a1a; margin: 30px 0 15px; font-size: 16px;">${t.shippingAddress}</h3>
      <div style="background: #f8f8f8; padding: 15px; border-radius: 8px;">
        <p style="margin: 0 0 5px;"><strong>${address.firstName} ${address.lastName}</strong></p>
        <p style="margin: 0 0 5px; color: #666;">${address.address}</p>
        <p style="margin: 0 0 5px; color: #666;">${address.postalCode} ${address.city}</p>
        <p style="margin: 0; color: #666;">${address.country}</p>
      </div>
      ` : ""}

      <div style="background: #EEF2FF; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="margin: 0; color: #4F46E5;">
          <strong>${t.nextSteps}</strong><br>
          ${t.nextStepsDesc}
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/${locale}/products"
           style="display: inline-block; background: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          ${t.continueShopping}
        </a>
      </div>
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
        ${t.questions} <a href="mailto:admin@drone-partss.com" style="color: #8B5CF6;">admin@drone-partss.com</a>
      </p>
      <p style="color: #666; margin: 0; font-size: 11px;">
        © ${new Date().getFullYear()} Drone-Partss. ${t.allRightsReserved}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Shipped email template (in customer's language)
function generateShippedEmailTemplate(order: OrderInfo, locale: Locale): string {
  const t = emailTranslations[locale];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Drone-Partss</h1>
    </div>

    <div style="background: white; padding: 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: #8B5CF6; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 30px;">📦</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">${t.orderOnTheWay}</h2>
        <p style="color: #666; margin: 0;">#${order.orderNumber} ${t.orderShipped}</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px;"><strong>${t.carrier}:</strong> ${order.carrier || "GLS"}</p>
        ${order.trackingNumber ? `<p style="margin: 0;"><strong>${t.trackingNumber}:</strong> <code style="background: #e5e5e5; padding: 2px 8px; border-radius: 4px;">${order.trackingNumber}</code></p>` : ""}
      </div>

      ${order.trackingNumber ? `
      <div style="text-align: center; margin: 30px 0;">
        ${order.carrier === "InPost" ? `
        <a href="https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}"
           style="display: inline-block; background: #FFCD00; color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          ${t.trackOn} InPost
        </a>
        ` : `
        <a href="https://gls-group.eu/PL/pl/sledzenie-paczek?match=${order.trackingNumber}"
           style="display: inline-block; background: #003087; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          ${t.trackOn} GLS
        </a>
        `}
      </div>
      ` : ""}
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Drone-Partss. ${t.allRightsReserved}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Get email subject translations
function getEmailSubjects(locale: Locale) {
  const subjects = {
    pl: {
      orderConfirmation: (orderNumber: number) => `Potwierdzenie zamówienia #${orderNumber} - Drone-Partss`,
      orderShipped: (orderNumber: number) => `Twoje zamówienie #${orderNumber} zostało wysłane - Drone-Partss`,
      adminNewOrder: (orderNumber: number, total: number) => `Nowe zamówienie #${orderNumber} - ${total.toFixed(2)} zł`,
    },
    en: {
      orderConfirmation: (orderNumber: number) => `Order Confirmation #${orderNumber} - Drone-Partss`,
      orderShipped: (orderNumber: number) => `Your order #${orderNumber} has been shipped - Drone-Partss`,
      adminNewOrder: (orderNumber: number, total: number) => `New order #${orderNumber} - ${total.toFixed(2)} zł`,
    },
    es: {
      orderConfirmation: (orderNumber: number) => `Confirmación de pedido #${orderNumber} - Drone-Partss`,
      orderShipped: (orderNumber: number) => `Tu pedido #${orderNumber} ha sido enviado - Drone-Partss`,
      adminNewOrder: (orderNumber: number, total: number) => `Nuevo pedido #${orderNumber} - ${total.toFixed(2)} zł`,
    },
  };
  return subjects[locale];
}

// Notification when new order is received
export async function notifyNewOrder(order: OrderInfo) {
  const settings = await getSettings();
  const locale = getLocale(order.locale);

  console.log("[NOTIFY] New order notification triggered for order #" + order.orderNumber + " (locale: " + locale + ")");

  // Fetch full order details if not provided
  if (!order.items || order.items.length === 0) {
    try {
      const fullOrder = await prisma.order.findFirst({
        where: { orderNumber: order.orderNumber },
        include: { items: true }
      });

      if (fullOrder) {
        order.items = fullOrder.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        order.subtotal = fullOrder.subtotal;
        order.shippingCost = fullOrder.shippingCost;
        order.paymentMethod = fullOrder.paymentMethod || "Przelewy24";
        order.carrier = fullOrder.carrier || "GLS";

        if (fullOrder.shippingAddress) {
          try {
            order.shippingAddress = JSON.parse(fullOrder.shippingAddress);
          } catch (e) {
            console.error("[NOTIFY] Error parsing shipping address:", e);
          }
        }
      }
    } catch (e) {
      console.error("[NOTIFY] Error fetching order details:", e);
    }
  }

  const subjects = getEmailSubjects(locale);

  // Email to admin (always in Polish)
  if (settings.notify_on_new_order === "true" && settings.notify_admin_email) {
    const adminHtml = generateAdminEmailTemplate(order);
    await sendEmail(
      settings.notify_admin_email,
      getEmailSubjects("pl").adminNewOrder(order.orderNumber, order.total),
      adminHtml
    );
  }

  // SMS to admin
  if (settings.notify_on_new_order === "true" && settings.notify_admin_phone) {
    await sendSMS(
      settings.notify_admin_phone,
      `Nowe zamówienie #${order.orderNumber} - ${order.total.toFixed(2)} zł - ${order.customerName}`
    );
  }

  // Email to customer (in their language)
  const customerHtml = generateCustomerEmailTemplate(order, locale);
  await sendEmail(
    order.customerEmail,
    subjects.orderConfirmation(order.orderNumber),
    customerHtml
  );

  return true;
}

// Notification when order is shipped
export async function notifyOrderShipped(order: OrderInfo) {
  const settings = await getSettings();
  const locale = getLocale(order.locale);

  const subjects = getEmailSubjects(locale);
  const customerHtml = generateShippedEmailTemplate(order, locale);
  await sendEmail(
    order.customerEmail,
    subjects.orderShipped(order.orderNumber),
    customerHtml
  );

  // SMS to customer if phone provided
  if (order.customerPhone) {
    const smsMessages = {
      pl: order.trackingNumber
        ? `Twoje zamówienie #${order.orderNumber} zostało wysłane. Śledzenie: ${order.trackingNumber} - Drone-Partss`
        : `Twoje zamówienie #${order.orderNumber} zostało wysłane - Drone-Partss`,
      en: order.trackingNumber
        ? `Your order #${order.orderNumber} has been shipped. Tracking: ${order.trackingNumber} - Drone-Partss`
        : `Your order #${order.orderNumber} has been shipped - Drone-Partss`,
      es: order.trackingNumber
        ? `Tu pedido #${order.orderNumber} ha sido enviado. Seguimiento: ${order.trackingNumber} - Drone-Partss`
        : `Tu pedido #${order.orderNumber} ha sido enviado - Drone-Partss`,
    };
    await sendSMS(order.customerPhone, smsMessages[locale]);
  }

  return true;
}

// Status change email template
function generateStatusChangeEmailTemplate(order: OrderInfo, locale: Locale, status: string): string {
  const statusMessages: Record<Locale, Record<string, { title: string; message: string; color: string; icon: string }>> = {
    pl: {
      PROCESSING: {
        title: "Twoje zamówienie jest w realizacji!",
        message: "Rozpoczęliśmy przygotowywanie Twojego zamówienia. Powiadomimy Cię, gdy zostanie wysłane.",
        color: "#3B82F6",
        icon: "📦"
      },
      CANCELLED: {
        title: "Zamówienie anulowane",
        message: "Twoje zamówienie zostało anulowane. Jeśli masz pytania, skontaktuj się z nami.",
        color: "#EF4444",
        icon: "❌"
      },
      DELIVERED: {
        title: "Zamówienie dostarczone!",
        message: "Twoje zamówienie zostało dostarczone. Dziękujemy za zakupy w Drone-Partss!",
        color: "#10B981",
        icon: "✅"
      },
      PENDING: {
        title: "Oczekujemy na płatność",
        message: "Twoje zamówienie czeka na potwierdzenie płatności. Po otrzymaniu płatności rozpoczniemy realizację.",
        color: "#F59E0B",
        icon: "⏳"
      },
    },
    en: {
      PROCESSING: {
        title: "Your order is being processed!",
        message: "We have started preparing your order. We will notify you when it ships.",
        color: "#3B82F6",
        icon: "📦"
      },
      CANCELLED: {
        title: "Order Cancelled",
        message: "Your order has been cancelled. If you have any questions, please contact us.",
        color: "#EF4444",
        icon: "❌"
      },
      DELIVERED: {
        title: "Order Delivered!",
        message: "Your order has been delivered. Thank you for shopping at Drone-Partss!",
        color: "#10B981",
        icon: "✅"
      },
      PENDING: {
        title: "Awaiting Payment",
        message: "Your order is awaiting payment confirmation. Once we receive payment, we will start processing.",
        color: "#F59E0B",
        icon: "⏳"
      },
    },
    es: {
      PROCESSING: {
        title: "¡Tu pedido está en proceso!",
        message: "Hemos comenzado a preparar tu pedido. Te notificaremos cuando sea enviado.",
        color: "#3B82F6",
        icon: "📦"
      },
      CANCELLED: {
        title: "Pedido Cancelado",
        message: "Tu pedido ha sido cancelado. Si tienes preguntas, contáctanos.",
        color: "#EF4444",
        icon: "❌"
      },
      DELIVERED: {
        title: "¡Pedido Entregado!",
        message: "Tu pedido ha sido entregado. ¡Gracias por comprar en Drone-Partss!",
        color: "#10B981",
        icon: "✅"
      },
      PENDING: {
        title: "Esperando Pago",
        message: "Tu pedido está esperando confirmación de pago. Una vez recibido, comenzaremos el proceso.",
        color: "#F59E0B",
        icon: "⏳"
      },
    },
  };

  const t = emailTranslations[locale];
  const statusInfo = statusMessages[locale][status] || statusMessages[locale].PROCESSING;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Drone-Partss</h1>
    </div>

    <div style="background: white; padding: 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: ${statusInfo.color}20; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 30px;">${statusInfo.icon}</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">${statusInfo.title}</h2>
        <p style="color: #666; margin: 0;">${statusInfo.message}</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="color: #666; margin: 0 0 5px; font-size: 14px;">${t.orderNumber}</p>
        <p style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: bold;">#${order.orderNumber}</p>
      </div>

      <table style="width: 100%; margin: 20px 0; background: #f8f8f8; border-radius: 8px;">
        <tr>
          <td style="padding: 15px; font-weight: bold; font-size: 18px;">${t.total}</td>
          <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">${order.total.toFixed(2)} zł</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/${locale}/products"
           style="display: inline-block; background: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          ${t.continueShopping}
        </a>
      </div>
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
        ${t.questions} <a href="mailto:admin@drone-partss.com" style="color: #8B5CF6;">admin@drone-partss.com</a>
      </p>
      <p style="color: #666; margin: 0; font-size: 11px;">
        © ${new Date().getFullYear()} Drone-Partss. ${t.allRightsReserved}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Notification when order status changes
export async function notifyOrderStatusChange(order: OrderInfo, newStatus: string) {
  const locale = getLocale(order.locale);

  console.log(`[NOTIFY] Status change notification for order #${order.orderNumber} to ${newStatus} (locale: ${locale})`);

  // Don't send email for SHIPPED status - that's handled by notifyOrderShipped with tracking info
  if (newStatus === "SHIPPED") {
    return false;
  }

  const statusSubjects: Record<Locale, Record<string, string>> = {
    pl: {
      PROCESSING: `Zamówienie #${order.orderNumber} - W realizacji`,
      CANCELLED: `Zamówienie #${order.orderNumber} - Anulowane`,
      DELIVERED: `Zamówienie #${order.orderNumber} - Dostarczone`,
      PENDING: `Zamówienie #${order.orderNumber} - Oczekuje na płatność`,
    },
    en: {
      PROCESSING: `Order #${order.orderNumber} - Processing`,
      CANCELLED: `Order #${order.orderNumber} - Cancelled`,
      DELIVERED: `Order #${order.orderNumber} - Delivered`,
      PENDING: `Order #${order.orderNumber} - Awaiting Payment`,
    },
    es: {
      PROCESSING: `Pedido #${order.orderNumber} - En proceso`,
      CANCELLED: `Pedido #${order.orderNumber} - Cancelado`,
      DELIVERED: `Pedido #${order.orderNumber} - Entregado`,
      PENDING: `Pedido #${order.orderNumber} - Esperando pago`,
    },
  };

  const subject = statusSubjects[locale][newStatus];
  if (!subject) {
    console.log(`[NOTIFY] No email template for status: ${newStatus}`);
    return false;
  }

  const html = generateStatusChangeEmailTemplate(order, locale, newStatus);
  await sendEmail(order.customerEmail, subject, html);

  return true;
}
