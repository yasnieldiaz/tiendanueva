import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("No orderId in session metadata");
          break;
        }

        // Update order status and payment info
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PROCESSING",
            paymentId: session.payment_intent as string,
            paidAt: new Date(),
          },
          include: {
            items: true,
          },
        });

        // Update product stock
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Parse shipping address
        let shippingAddress;
        try {
          shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
        } catch {
          shippingAddress = {
            firstName: "Customer",
            lastName: "",
            email: session.customer_email || "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            country: "",
          };
        }

        // Prepare order data for emails
        const orderEmailData = {
          orderNumber: order.orderNumber,
          items: order.items.map((item: { name: string; price: number; quantity: number; variant: string | null }) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant || undefined,
          })),
          subtotal: order.subtotal,
          shipping: order.shippingCost,
          tax: order.tax,
          total: order.total,
          shippingAddress,
        };

        // Send confirmation email to customer
        const customerEmail = shippingAddress.email || session.customer_email;
        if (customerEmail) {
          await sendOrderConfirmationEmail(customerEmail, orderEmailData);
        }

        // Send notification to admin
        await sendAdminOrderNotification(orderEmailData);

        console.log(`Order ${order.orderNumber} processed successfully`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Cancel the order
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });
          console.log(`Order ${orderId} cancelled due to expired session`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed:", paymentIntent.id);
        // You could send a failed payment email here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Note: In Next.js App Router, body parsing is disabled by default for route handlers
// when using request.text() or request.arrayBuffer(), so no additional config is needed
