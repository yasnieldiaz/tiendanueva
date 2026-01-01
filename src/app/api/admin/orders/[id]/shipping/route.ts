import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendShippingConfirmationEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { trackingNumber, carrier, sendEmail } = await request.json();

    if (!trackingNumber || !carrier) {
      return NextResponse.json(
        { error: "Tracking number and carrier are required" },
        { status: 400 }
      );
    }

    // Get the order with shipping address
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order with shipping info
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        trackingNumber,
        carrier,
        status: "SHIPPED",
        shippedAt: new Date(),
      },
      include: { items: true },
    });

    // Send shipping confirmation email if requested
    if (sendEmail && order.shippingAddress) {
      try {
        const shippingAddress = JSON.parse(order.shippingAddress);
        const customerEmail = shippingAddress.email;

        if (customerEmail) {
          await sendShippingConfirmationEmail(
            customerEmail,
            order.orderNumber,
            trackingNumber,
            carrier
          );
        }
      } catch (emailError) {
        console.error("Error sending shipping email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating shipping:", error);
    return NextResponse.json(
      { error: "Failed to update shipping info" },
      { status: 500 }
    );
  }
}
