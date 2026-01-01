import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const { items, shippingAddress } = body;

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

    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.23;
    const total = subtotal + shipping + tax;

    // Get next order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: "desc" },
    });
    const orderNumber = (lastOrder?.orderNumber || 1000) + 1;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || "guest",
        subtotal,
        shippingCost: shipping,
        tax,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        status: "PENDING",
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
