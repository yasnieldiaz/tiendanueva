import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyOrderStatusChange } from "@/lib/notifications";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, sendNotification = true } = body;

    // Get the current order to check if status is actually changing
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update the order
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    // Send notification if status changed and notifications are enabled
    if (sendNotification && currentOrder.status !== status) {
      try {
        // Parse shipping address to get customer info and locale
        let customerEmail = "";
        let customerName = "";
        let customerPhone = "";
        let locale = "pl";

        if (order.shippingAddress) {
          try {
            const address = JSON.parse(order.shippingAddress);
            customerEmail = address.email || "";
            customerName = `${address.firstName || ""} ${address.lastName || ""}`.trim();
            customerPhone = address.phone || "";
            // Try to detect locale from shipping address or default to pl
            if (address.country) {
              const country = address.country.toLowerCase();
              if (country.includes("spain") || country.includes("españa")) {
                locale = "es";
              } else if (country.includes("united") || country.includes("uk") || country.includes("ireland")) {
                locale = "en";
              }
            }
          } catch (e) {
            console.error("[ORDER] Error parsing shipping address:", e);
          }
        }

        if (customerEmail) {
          await notifyOrderStatusChange({
            orderNumber: order.orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            total: order.total,
            locale,
          }, status);
          console.log(`[ORDER] Status change notification sent for order #${order.orderNumber} (${status})`);
        }
      } catch (notifyError) {
        console.error("[ORDER] Error sending status notification:", notifyError);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete order items first (cascade should handle this, but being explicit)
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Delete the order
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500 }
    );
  }
}
