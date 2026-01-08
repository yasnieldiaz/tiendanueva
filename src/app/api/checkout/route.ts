import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyNewOrder } from "@/lib/notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingCost,
      shippingMethod,
      paczkomatId,
      paczkomatAddress
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) continue;

      subtotal += product.price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "pln", // PLN for Przelewy24
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
          unit_amount: Math.round(product.price * 100), // Convert to grosze
        },
        quantity: item.quantity,
      });
    }

    // Use shipping cost from frontend or calculate default
    const shipping = shippingCost !== undefined ? shippingCost : (subtotal >= 5000 ? 0 : 18);
    const total = subtotal + shipping;

    // Create order in database
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
        tax: 0, // VAT included in prices
        total,
        shippingAddress: JSON.stringify(shippingData),
        status: "PENDING",
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
    });

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "pln",
          product_data: {
            name: "Dostawa / Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session with Przelewy24
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["p24", "card", "blik"], // Przelewy24, Card, and BLIK
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/checkout?canceled=true`,
      customer_email: shippingAddress.email, // Required for P24
      metadata: {
        orderId: order.id,
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          orderNumber: orderNumber.toString(),
        },
      },
    });

    // Send new order notification (email + SMS)
    console.log("[CHECKOUT] About to send notification for order #" + orderNumber);
    try {
      await notifyNewOrder({
        orderNumber,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        total,
      });
      console.log("[CHECKOUT] Notification sent successfully for order #" + orderNumber);
    } catch (notifyError) {
      console.error("[CHECKOUT] Error sending order notification:", notifyError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Error processing checkout" },
      { status: 500 }
    );
  }
}
