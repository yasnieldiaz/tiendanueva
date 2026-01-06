import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createInPostShipment, getInPostLabel } from "@/lib/shipping/inpost";
import { createGLSShipment } from "@/lib/shipping/gls";
import { notifyOrderShipped } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { carrier, parcelSize = "A", weight = 1, targetPoint } = body;

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Zamówienie nie znalezione" }, { status: 404 });
    }

    // Parse shipping address
    let shippingAddress;
    try {
      shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
    } catch {
      return NextResponse.json({ error: "Błąd parsowania adresu dostawy" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Brak adresu dostawy" }, { status: 400 });
    }

    // Define parcel dimensions based on size
    const parcelSizes: Record<string, { length: number; width: number; height: number }> = {
      A: { length: 8, width: 38, height: 64 },   // Small
      B: { length: 19, width: 38, height: 64 },  // Medium
      C: { length: 41, width: 38, height: 64 },  // Large
      custom: { length: 50, width: 50, height: 50 },
    };

    const dimensions = parcelSizes[parcelSize] || parcelSizes.A;

    let result;

    if (carrier === "InPost") {
      result = await createInPostShipment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        receiver: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email || order.user?.email || "",
          phone: shippingAddress.phone || "",
          address: shippingAddress.address,
          city: shippingAddress.city,
          postCode: shippingAddress.postalCode,
          countryCode: shippingAddress.country || "PL",
        },
        parcels: [
          {
            dimensions: {
              ...dimensions,
              weight: weight,
            },
          },
        ],
        targetPoint: targetPoint, // Paczkomat ID if delivery to locker
      });
    } else if (carrier === "GLS") {
      result = await createGLSShipment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        receiver: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email || order.user?.email || "",
          phone: shippingAddress.phone || "",
          address: shippingAddress.address,
          city: shippingAddress.city,
          postCode: shippingAddress.postalCode,
          countryCode: shippingAddress.country || "PL",
        },
        parcels: [{ weight: weight }],
        codAmount: order.paymentMethod === "cod" ? order.total : undefined,
      });
    } else {
      return NextResponse.json({ error: "Nieznany przewoźnik" }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: {
        status: "SHIPPED",
        trackingNumber: result.trackingNumber,
        carrier: carrier,
      },
    });

    // Send notification to customer
    await notifyOrderShipped({
      orderNumber: order.orderNumber,
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      customerEmail: shippingAddress.email || order.user?.email || "",
      customerPhone: shippingAddress.phone,
      total: order.total,
      trackingNumber: result.trackingNumber,
      carrier: carrier,
    });

    return NextResponse.json({
      success: true,
      trackingNumber: result.trackingNumber,
      shipmentId: "shipmentId" in result ? result.shipmentId : undefined,
      message: `Przesyłka ${carrier} utworzona pomyślnie`,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Błąd podczas tworzenia przesyłki" },
      { status: 500 }
    );
  }
}

// GET - Download label
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const shipmentId = searchParams.get("shipmentId");

    if (!shipmentId) {
      return NextResponse.json({ error: "Brak ID przesyłki" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Zamówienie nie znalezione" }, { status: 404 });
    }

    if (order.carrier === "InPost") {
      const result = await getInPostLabel(shipmentId);

      if (!result.success || !result.pdf) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return new NextResponse(new Uint8Array(result.pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="label-${order.orderNumber}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: "Pobieranie etykiety niedostępne dla tego przewoźnika" }, { status: 400 });
  } catch (error) {
    console.error("Error downloading label:", error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania etykiety" },
      { status: 500 }
    );
  }
}
