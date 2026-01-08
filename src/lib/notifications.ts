import nodemailer from "nodemailer";
import prisma from "./prisma";

interface OrderInfo {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
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
      console.log("[EMAIL] Settings:", {
        smtp_host: settings.smtp_host || "NOT SET",
        smtp_user: settings.smtp_user || "NOT SET",
        smtp_password: settings.smtp_password ? "SET" : "NOT SET",
        smtp_port: settings.smtp_port || "587 (default)",
      });
      return false;
    }

    console.log(`[EMAIL] Sending to: ${to}, subject: ${subject}`);
    console.log(`[EMAIL] SMTP config: ${settings.smtp_host}:${settings.smtp_port || "587"}`);

    await transporter.sendMail({
      from: `"${settings.smtp_from_name || "DroneParts"}" <${settings.smtp_from_email || settings.smtp_user}>`,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] Successfully sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
    if (error instanceof Error) {
      console.error("[EMAIL] Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack?.split("\n").slice(0, 3).join("\n"),
      });
    }
    return false;
  }
}

// Send SMS via Vonage
async function sendSMS(to: string, message: string) {
  try {
    const settings = await getSettings();

    if (!settings.vonage_api_key || !settings.vonage_api_secret) {
      console.log("Vonage not configured, skipping SMS...");
      return false;
    }

    const response = await fetch("https://rest.nexmo.com/sms/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: settings.vonage_api_key,
        api_secret: settings.vonage_api_secret,
        from: settings.vonage_from_number || "DroneParts",
        to: to.replace(/[^0-9+]/g, ""),
        text: message,
      }),
    });

    const data = await response.json();

    if (data.messages && data.messages[0]?.status === "0") {
      return true;
    }

    console.error("SMS error:", data);
    return false;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

// Notification when new order is received
export async function notifyNewOrder(order: OrderInfo) {
  const settings = await getSettings();

  console.log("[NOTIFY] New order notification triggered for order #" + order.orderNumber);
  console.log("[NOTIFY] Settings:", {
    notify_on_new_order: settings.notify_on_new_order || "NOT SET",
    notify_admin_email: settings.notify_admin_email || "NOT SET",
    notify_admin_phone: settings.notify_admin_phone || "NOT SET",
  });

  // Email to admin
  if (settings.notify_on_new_order === "true" && settings.notify_admin_email) {
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; font-size: 24px;">Nuevo pedido recibido</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px;"><strong>Pedido #${order.orderNumber}</strong></p>
          <p style="margin: 0 0 10px;">Cliente: ${order.customerName}</p>
          <p style="margin: 0 0 10px;">Email: ${order.customerEmail}</p>
          ${order.customerPhone ? `<p style="margin: 0 0 10px;">Teléfono: ${order.customerPhone}</p>` : ""}
          <p style="margin: 0; font-size: 20px; color: #1a1a1a;"><strong>Total: ${order.total.toFixed(2)} zł</strong></p>
        </div>
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/orders"
           style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Ver pedido
        </a>
      </div>
    `;

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
      `Nuevo pedido #${order.orderNumber} recibido por ${order.total.toFixed(2)} zł - DroneParts`
    );
  }

  // Email to customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #1a1a1a; margin: 0;">DroneParts</h1>
      </div>

      <h2 style="color: #1a1a1a;">¡Gracias por tu pedido!</h2>
      <p>Hola ${order.customerName},</p>
      <p>Hemos recibido tu pedido y estamos procesándolo.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px;"><strong>Número de pedido: #${order.orderNumber}</strong></p>
        <p style="margin: 0; font-size: 20px;"><strong>Total: ${order.total.toFixed(2)} zł</strong></p>
      </div>

      <p>Te enviaremos otro email cuando tu pedido sea enviado.</p>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

      <p style="color: #666; font-size: 12px;">
        Si tienes alguna pregunta, no dudes en contactarnos en info@drone-partss.com
      </p>
    </div>
  `;

  await sendEmail(
    order.customerEmail,
    `Confirmación de pedido #${order.orderNumber} - DroneParts`,
    customerHtml
  );

  return true;
}

// Notification when order is shipped
export async function notifyOrderShipped(order: OrderInfo) {
  const settings = await getSettings();

  if (settings.notify_on_shipped !== "true") {
    return false;
  }

  // Email to customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #1a1a1a; margin: 0;">DroneParts</h1>
      </div>

      <h2 style="color: #1a1a1a;">¡Tu pedido ha sido enviado!</h2>
      <p>Hola ${order.customerName},</p>
      <p>Tu pedido #${order.orderNumber} está en camino.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px;"><strong>Número de pedido: #${order.orderNumber}</strong></p>
        ${order.carrier ? `<p style="margin: 0 0 10px;">Transportista: ${order.carrier}</p>` : ""}
        ${order.trackingNumber ? `<p style="margin: 0 0 10px;"><strong>Número de seguimiento: ${order.trackingNumber}</strong></p>` : ""}
      </div>

      ${order.carrier === "InPost" && order.trackingNumber ? `
        <a href="https://inpost.pl/sledzenie-przesylek?number=${order.trackingNumber}"
           style="display: inline-block; background: #FFCD00; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Seguir envío en InPost
        </a>
      ` : ""}

      ${order.carrier === "GLS" && order.trackingNumber ? `
        <a href="https://gls-group.eu/PL/pl/sledzenie-paczek?match=${order.trackingNumber}"
           style="display: inline-block; background: #003087; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Seguir envío en GLS
        </a>
      ` : ""}

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

      <p style="color: #666; font-size: 12px;">
        Si tienes alguna pregunta, no dudes en contactarnos en info@drone-partss.com
      </p>
    </div>
  `;

  await sendEmail(
    order.customerEmail,
    `Tu pedido #${order.orderNumber} ha sido enviado - DroneParts`,
    customerHtml
  );

  // SMS to customer if phone provided
  if (order.customerPhone) {
    const smsMessage = order.trackingNumber
      ? `Tu pedido #${order.orderNumber} ha sido enviado. Tracking: ${order.trackingNumber} - DroneParts`
      : `Tu pedido #${order.orderNumber} ha sido enviado. - DroneParts`;

    await sendSMS(order.customerPhone, smsMessage);
  }

  return true;
}
