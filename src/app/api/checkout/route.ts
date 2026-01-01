import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, shippingAddress } = body;

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
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.23;
    const total = subtotal + shipping + tax;

    // Create order in database
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
    });

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

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
