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
  try {
    const settings = await getSettings();
    const transporter = await createTransporter();

    if (!transporter) {
      console.log("[EMAIL] SMTP not configured - missing host, user or password");
      return false;
    }

    console.log(`[EMAIL] Sending to: ${to}, subject: ${subject}`);

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
function generateItemsTable(items: OrderItem[]): string {
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
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e5e5;">Producto</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e5e5;">Cant.</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e5e5;">Precio</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Admin email template
function generateAdminEmailTemplate(order: OrderInfo): string {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const itemsTable = generateItemsTable(order.items || []);
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
      <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo pedido: ${order.orderNumber}</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <p style="color: #666; margin: 0 0 20px;">
        Has recibido un nuevo pedido de <strong>${order.customerName}</strong>:
      </p>

      <p style="margin: 0 0 20px;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/admin/orders" style="color: #8B5CF6; font-weight: bold;">
          [Pedido ${order.orderNumber}]
        </a>
        <span style="color: #8B5CF6; font-weight: bold;">(${date})</span>
      </p>

      ${itemsTable}

      <table style="width: 100%; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>Subtotal:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.subtotal || order.total).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>Envío:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.shippingCost || 0).toFixed(2)} zł ${order.carrier ? `por ${order.carrier}` : ""}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;"><strong>Método de pago:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">${order.paymentMethod || "Przelewy24"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0;"><strong style="font-size: 18px;">Total:</strong></td>
          <td style="padding: 12px 0; text-align: right;"><strong style="font-size: 18px;">${order.total.toFixed(2)} zł</strong></td>
        </tr>
      </table>

      ${address ? `
      <div style="display: flex; margin-top: 30px;">
        <div style="flex: 1; padding-right: 20px;">
          <h3 style="color: #8B5CF6; margin: 0 0 15px; font-size: 16px;">Datos de facturación</h3>
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
          <h3 style="color: #8B5CF6; margin: 0 0 15px; font-size: 16px;">Dirección de envío</h3>
          <div style="background: #f8f8f8; padding: 15px; border-radius: 4px;">
            <p style="margin: 0 0 5px;">${address.firstName} ${address.lastName}</p>
            <p style="margin: 0 0 5px;">${address.address}</p>
            <p style="margin: 0;">${address.postalCode} ${address.city}</p>
          </div>
        </div>
      </div>
      ` : ""}

      <p style="margin: 30px 0 10px; color: #666;">Todo va bien.</p>
      <p style="margin: 0;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/admin/orders" style="color: #8B5CF6;">
          Gestionar pedido
        </a> en la aplicación.
      </p>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p style="margin: 0;">Drone-Partss - Piezas para Drones</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Customer email template
function generateCustomerEmailTemplate(order: OrderInfo): string {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const itemsTable = generateItemsTable(order.items || []);
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
      <p style="color: #999; margin: 10px 0 0;">Piezas para Drones</p>
    </div>

    <div style="background: white; padding: 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">¡Gracias por tu pedido!</h2>
        <p style="color: #666; margin: 0;">Hemos recibido tu pedido y estamos procesándolo.</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="color: #666; margin: 0 0 5px; font-size: 14px;">Número de pedido</p>
        <p style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: bold;">#${order.orderNumber}</p>
        <p style="color: #666; margin: 10px 0 0; font-size: 14px;">${date}</p>
      </div>

      <h3 style="color: #1a1a1a; margin: 0 0 15px; font-size: 16px;">Resumen del pedido</h3>
      ${itemsTable}

      <table style="width: 100%; margin: 20px 0; background: #f8f8f8; border-radius: 8px;">
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">Subtotal</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.subtotal || order.total).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">Envío (${order.carrier || "Estándar"})</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5; text-align: right;">${(order.shippingCost || 0).toFixed(2)} zł</td>
        </tr>
        <tr>
          <td style="padding: 15px; font-weight: bold; font-size: 18px;">Total</td>
          <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">${order.total.toFixed(2)} zł</td>
        </tr>
      </table>

      ${address ? `
      <h3 style="color: #1a1a1a; margin: 30px 0 15px; font-size: 16px;">Dirección de envío</h3>
      <div style="background: #f8f8f8; padding: 15px; border-radius: 8px;">
        <p style="margin: 0 0 5px;"><strong>${address.firstName} ${address.lastName}</strong></p>
        <p style="margin: 0 0 5px; color: #666;">${address.address}</p>
        <p style="margin: 0 0 5px; color: #666;">${address.postalCode} ${address.city}</p>
        <p style="margin: 0; color: #666;">${address.country}</p>
      </div>
      ` : ""}

      <div style="background: #EEF2FF; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="margin: 0; color: #4F46E5;">
          <strong>📧 Próximos pasos:</strong><br>
          Te enviaremos un email cuando tu pedido sea enviado con el número de seguimiento.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXTAUTH_URL || "https://tienda.esix.online"}/products"
           style="display: inline-block; background: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Seguir comprando
        </a>
      </div>
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
        ¿Preguntas? Contáctanos en <a href="mailto:admin@drone-partss.com" style="color: #8B5CF6;">admin@drone-partss.com</a>
      </p>
      <p style="color: #666; margin: 0; font-size: 11px;">
        © ${new Date().getFullYear()} Drone-Partss. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Notification when new order is received
export async function notifyNewOrder(order: OrderInfo) {
  const settings = await getSettings();

  console.log("[NOTIFY] New order notification triggered for order #" + order.orderNumber);

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

  // Email to admin
  if (settings.notify_on_new_order === "true" && settings.notify_admin_email) {
    const adminHtml = generateAdminEmailTemplate(order);
    await sendEmail(
      settings.notify_admin_email,
      `Nuevo pedido #${order.orderNumber} - ${order.total.toFixed(2)} zł`,
      adminHtml
    );
  }

  // SMS to admin
  if (settings.notify_on_new_order === "true" && settings.notify_admin_phone) {
    await sendSMS(
      settings.notify_admin_phone,
      `Nuevo pedido #${order.orderNumber} - ${order.total.toFixed(2)} zł - ${order.customerName}`
    );
  }

  // Email to customer
  const customerHtml = generateCustomerEmailTemplate(order);
  await sendEmail(
    order.customerEmail,
    `Confirmación de pedido #${order.orderNumber} - Drone-Partss`,
    customerHtml
  );

  return true;
}

// Shipped email template
function generateShippedEmailTemplate(order: OrderInfo): string {
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
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">¡Tu pedido está en camino!</h2>
        <p style="color: #666; margin: 0;">El pedido #${order.orderNumber} ha sido enviado.</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px;"><strong>Transportista:</strong> ${order.carrier || "GLS"}</p>
        ${order.trackingNumber ? `<p style="margin: 0;"><strong>Número de seguimiento:</strong> <code style="background: #e5e5e5; padding: 2px 8px; border-radius: 4px;">${order.trackingNumber}</code></p>` : ""}
      </div>

      ${order.trackingNumber ? `
      <div style="text-align: center; margin: 30px 0;">
        ${order.carrier === "InPost" ? `
        <a href="https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}"
           style="display: inline-block; background: #FFCD00; color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Seguir en InPost
        </a>
        ` : `
        <a href="https://gls-group.eu/PL/pl/sledzenie-paczek?match=${order.trackingNumber}"
           style="display: inline-block; background: #003087; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Seguir en GLS
        </a>
        `}
      </div>
      ` : ""}
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Drone-Partss. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Notification when order is shipped
export async function notifyOrderShipped(order: OrderInfo) {
  const settings = await getSettings();

  if (settings.notify_on_shipped !== "true") {
    return false;
  }

  const customerHtml = generateShippedEmailTemplate(order);
  await sendEmail(
    order.customerEmail,
    `Tu pedido #${order.orderNumber} ha sido enviado - Drone-Partss`,
    customerHtml
  );

  // SMS to customer if phone provided
  if (order.customerPhone) {
    const smsMessage = order.trackingNumber
      ? `Tu pedido #${order.orderNumber} ha sido enviado. Tracking: ${order.trackingNumber} - Drone-Partss`
      : `Tu pedido #${order.orderNumber} ha sido enviado - Drone-Partss`;
    await sendSMS(order.customerPhone, smsMessage);
  }

  return true;
}
