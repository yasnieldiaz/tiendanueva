import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyNewOrder } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      items,
      shippingAddress,
      shippingCost,
      paymentMethod,
      shippingMethod,
      paczkomatId,
      paczkomatAddress
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const shipping = shippingCost || (subtotal >= 5000 ? 0 : (shippingMethod === "gls" ? 24 : 18));
    const tax = subtotal * 0.23;
    const total = subtotal + shipping + tax;

    // Get next order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: "desc" },
    });
    const orderNumber = (lastOrder?.orderNumber || 1000) + 1;

    // Prepare shipping address with Paczkomat info if applicable
    const shippingData = {
      ...shippingAddress,
      shippingMethod,
      paczkomatId: shippingMethod === "inpost" ? paczkomatId : undefined,
      paczkomatAddress: shippingMethod === "inpost" ? paczkomatAddress : undefined,
    };

    const order = await prisma.order.create({
      data: {
        orderNumber,
        ...(session?.user?.id ? { userId: session.user.id } : {}),
        subtotal,
        shippingCost: shipping,
        tax,
        total,
        shippingAddress: JSON.stringify(shippingData),
        status: paymentMethod === "cod" ? "PROCESSING" : "PENDING",
        paymentMethod: paymentMethod || "przelewy24",
        carrier: shippingMethod === "inpost" ? "InPost" : "GLS",
        items: {
          create: items.map((item: { productId: string; name: string; price: number; quantity: number; variant?: string }) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send notification for COD orders
    console.log("[ORDERS] About to send notification for order #" + orderNumber);
    try {
      await notifyNewOrder({
        orderNumber,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        total,
      });
      console.log("[ORDERS] Notification sent successfully for order #" + orderNumber);
    } catch (notifyError) {
      console.error("[ORDERS] Error sending notification:", notifyError);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
