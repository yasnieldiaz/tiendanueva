import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const settings = await getSettings();
    const transporter = await createTransporter();

    if (!transporter) {
      console.log("[CONTACT] SMTP not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Email to admin
    const adminEmail = "admin@drone-partss.com";
    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Drone-Partss</h1>
      <p style="color: #999; margin: 10px 0 0;">Nowa wiadomosc kontaktowa</p>
    </div>

    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 20px;">Szczegoly wiadomosci</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold; width: 120px;">Imie i nazwisko:</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">E-mail:</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
            <a href="mailto:${email}" style="color: #3B82F6;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">Temat:</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${subject}</td>
        </tr>
      </table>

      <div style="margin-top: 20px; padding: 20px; background: #f8f8f8; border-radius: 8px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #1a1a1a;">Wiadomosc:</p>
        <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href="mailto:${email}?subject=Re: ${subject}"
           style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Odpowiedz
        </a>
      </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p style="margin: 0;">Wiadomosc wyslana z formularza kontaktowego na stronie Drone-Partss</p>
      <p style="margin: 10px 0 0;">${new Date().toLocaleString("pl-PL")}</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Drone-Partss Contact" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Kontakt] ${subject} - ${name}`,
      html: adminHtml,
    });

    console.log(`[CONTACT] Email sent from ${email} to ${adminEmail}`);

    // Auto-reply to customer
    const customerHtml = `
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

    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0 0 10px;">Dziekujemy za kontakt!</h2>
        <p style="color: #666; margin: 0;">Otrzymalismy Twoja wiadomosc i odpowiemy najszybciej jak to mozliwe.</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #1a1a1a;">Twoja wiadomosc:</p>
        <p style="margin: 0 0 5px; color: #666;"><strong>Temat:</strong> ${subject}</p>
        <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
      </div>

      <p style="color: #666; text-align: center; margin: 20px 0 0;">
        Odpowiemy na Twoja wiadomosc w ciagu 24-48 godzin roboczych.
      </p>
    </div>

    <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
        Pytania? <a href="mailto:admin@drone-partss.com" style="color: #8B5CF6;">admin@drone-partss.com</a> | Tel: +48 784 608 733
      </p>
      <p style="color: #666; margin: 0; font-size: 11px;">
        © ${new Date().getFullYear()} Drone-Partss. Wszelkie prawa zastrzezone.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Drone-Partss" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: email,
      subject: "Dziekujemy za kontakt - Drone-Partss",
      html: customerHtml,
    });

    console.log(`[CONTACT] Auto-reply sent to ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CONTACT] Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
