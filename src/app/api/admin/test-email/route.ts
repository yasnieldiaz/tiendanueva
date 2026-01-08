import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get settings from database
    const settingsRecords = await prisma.setting.findMany();
    const settings: Record<string, string> = {};
    settingsRecords.forEach((s: { key: string; value: string }) => {
      settings[s.key] = s.value;
    });

    console.log("[TEST-EMAIL] Settings found:", {
      smtp_host: settings.smtp_host || "NOT SET",
      smtp_port: settings.smtp_port || "NOT SET",
      smtp_user: settings.smtp_user || "NOT SET",
      smtp_password: settings.smtp_password ? "SET (" + settings.smtp_password.length + " chars)" : "NOT SET",
      smtp_from_email: settings.smtp_from_email || "NOT SET",
      smtp_from_name: settings.smtp_from_name || "NOT SET",
    });

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_password) {
      return NextResponse.json({
        success: false,
        error: "SMTP not configured",
        details: {
          smtp_host: settings.smtp_host ? "OK" : "MISSING",
          smtp_user: settings.smtp_user ? "OK" : "MISSING",
          smtp_password: settings.smtp_password ? "OK" : "MISSING",
        },
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port || "587"),
      secure: settings.smtp_port === "465",
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    console.log("[TEST-EMAIL] Sending test email to:", email);

    // Send test email
    const info = await transporter.sendMail({
      from: `"${settings.smtp_from_name || "DroneParts Test"}" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: email,
      subject: "Test Email - Drone-Partss",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Test Email</h1>
          <p>This is a test email from your Drone-Partss store.</p>
          <p>If you received this email, your SMTP configuration is working correctly!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;">
          <p style="color: #666; font-size: 12px;">
            Sent from: ${settings.smtp_host}:${settings.smtp_port || "587"}<br>
            User: ${settings.smtp_user}<br>
            Time: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    console.log("[TEST-EMAIL] Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
    });
  } catch (error) {
    console.error("[TEST-EMAIL] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined,
    });
  }
}
