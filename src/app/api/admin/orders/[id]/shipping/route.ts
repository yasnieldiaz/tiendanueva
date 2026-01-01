import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notifyOrderShipped } from "@/lib/notifications";

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
    const { trackingNumber, carrier, sendNotification = true } = await request.json();

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

    // Send shipping notification (email + SMS) if requested
    if (sendNotification && order.shippingAddress) {
      try {
        const shippingAddress = JSON.parse(order.shippingAddress);

        await notifyOrderShipped({
          orderNumber: order.orderNumber,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          customerEmail: shippingAddress.email,
          customerPhone: shippingAddress.phone,
          total: order.total,
          trackingNumber,
          carrier,
        });
      } catch (notifyError) {
        console.error("Error sending shipping notification:", notifyError);
        // Don't fail the request if notification fails
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
