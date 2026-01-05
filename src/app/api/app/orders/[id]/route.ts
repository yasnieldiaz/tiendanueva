import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret"
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || "Cliente",
      customerEmail: order.user?.email || "",
      customerPhone: order.user?.phone || "",
      status: order.status.toLowerCase(),
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      shippedAt: order.shippedAt,
      notes: order.notes,
      shippingAddress: order.shippingAddress || (order.address
        ? `${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}`
        : null),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item: typeof order.items[number]) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
        image: item.product?.images?.[0]?.url,
      })),
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, carrier, notes, isPaid } = body;

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status.toUpperCase();
      if (status.toUpperCase() === "SHIPPED" && !body.shippedAt) {
        updateData.shippedAt = new Date();
      }
    }
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (notes !== undefined) updateData.notes = notes;
    if (isPaid !== undefined) {
      updateData.isPaid = isPaid;
      if (isPaid) {
        updateData.paidAt = new Date();
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: order.id,
      status: order.status.toLowerCase(),
      message: "Pedido actualizado",
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { id } = await params;

    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Pedido eliminado",
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500, headers: corsHeaders }
    );
  }
}
