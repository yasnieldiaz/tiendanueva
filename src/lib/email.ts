import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderEmailData {
  orderNumber: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderData: OrderEmailData
) {
  const { orderNumber, items, subtotal, shipping, tax, total, shippingAddress } = orderData;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          <strong>${item.name}</strong>
          ${item.variant ? `<br><span style="color: #666; font-size: 14px;">${item.variant}</span>` : ""}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  try {
    const { data, error } = await resend.emails.send({
      from: "DroneParts <orders@drone-partss.com>",
      to: [to],
      subject: `Order Confirmation #${orderNumber} - DroneParts`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #171717; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background-color: #171717; padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">DroneParts</h1>
              </div>

              <!-- Content -->
              <div style="padding: 32px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <span style="font-size: 32px;">✓</span>
                  </div>
                  <h2 style="margin: 0 0 8px 0; font-size: 24px;">Order Confirmed!</h2>
                  <p style="color: #666; margin: 0;">Thank you for your purchase</p>
                </div>

                <div style="background-color: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
                  <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold;">#${orderNumber}</p>
                </div>

                <!-- Order Items -->
                <h3 style="margin: 0 0 16px 0; font-size: 18px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <thead>
                    <tr style="background-color: #f5f5f5;">
                      <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                      <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                      <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Totals -->
                <div style="border-top: 2px solid #e5e5e5; padding-top: 16px; margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Subtotal</span>
                    <span>€${subtotal.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Shipping</span>
                    <span>${shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Tax (23%)</span>
                    <span>€${tax.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; padding-top: 12px; border-top: 1px solid #e5e5e5;">
                    <span>Total</span>
                    <span>€${total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Shipping Address -->
                <h3 style="margin: 0 0 16px 0; font-size: 18px;">Shipping Address</h3>
                <div style="background-color: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0;">
                    <strong>${shippingAddress.firstName} ${shippingAddress.lastName}</strong><br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                    ${shippingAddress.country}<br><br>
                    ${shippingAddress.email}<br>
                    ${shippingAddress.phone}
                  </p>
                </div>

                <!-- Next Steps -->
                <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <h4 style="margin: 0 0 12px 0; color: #1d4ed8;">What happens next?</h4>
                  <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
                    <li style="margin-bottom: 8px;">We're preparing your order for shipment</li>
                    <li style="margin-bottom: 8px;">You'll receive a shipping confirmation email with tracking</li>
                    <li>Estimated delivery: 2-5 business days</li>
                  </ol>
                </div>

                <div style="text-align: center;">
                  <a href="https://drone-partss.com/orders" style="display: inline-block; padding: 14px 28px; background-color: #171717; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Track Your Order</a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f5f5f5; padding: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                  Questions? Contact us at <a href="mailto:support@drone-partss.com" style="color: #171717;">support@drone-partss.com</a>
                </p>
                <p style="margin: 0; color: #999; font-size: 12px;">
                  © ${new Date().getFullYear()} DroneParts. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendAdminOrderNotification(orderData: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@drone-partss.com";
  const { orderNumber, items, total, shippingAddress } = orderData;

  try {
    const { data, error } = await resend.emails.send({
      from: "DroneParts <notifications@drone-partss.com>",
      to: [adminEmail],
      subject: `🛒 New Order #${orderNumber} - €${total.toFixed(2)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h1 style="color: #171717;">New Order Received!</h1>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0;">Order #${orderNumber}</h2>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">€${total.toFixed(2)}</p>
          </div>

          <h3>Customer</h3>
          <p>
            ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
            ${shippingAddress.email}<br>
            ${shippingAddress.phone}
          </p>

          <h3>Shipping Address</h3>
          <p>
            ${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
            ${shippingAddress.country}
          </p>

          <h3>Items (${items.length})</h3>
          <ul>
            ${items.map((item) => `<li>${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
          </ul>

          <a href="https://drone-partss.com/admin/orders" style="display: inline-block; padding: 12px 24px; background: #171717; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">View in Admin Panel</a>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending admin notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { success: false, error };
  }
}

export async function sendShippingConfirmationEmail(
  to: string,
  orderNumber: number,
  trackingNumber: string,
  carrier: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "DroneParts <shipping@drone-partss.com>",
      to: [to],
      subject: `Your Order #${orderNumber} Has Been Shipped!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">📦</span>
            </div>
            <h1 style="color: #171717; margin-top: 20px;">Your Order is On Its Way!</h1>
          </div>

          <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #666;">Order Number</p>
            <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: bold;">#${orderNumber}</p>

            <p style="margin: 0 0 8px 0; color: #666;">Carrier</p>
            <p style="margin: 0 0 16px 0; font-weight: bold;">${carrier}</p>

            <p style="margin: 0 0 8px 0; color: #666;">Tracking Number</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; font-family: monospace;">${trackingNumber}</p>
          </div>

          <div style="text-align: center;">
            <a href="https://track.carrier.com/${trackingNumber}" style="display: inline-block; padding: 14px 28px; background: #171717; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Track Your Package</a>
          </div>

          <p style="text-align: center; color: #666; margin-top: 30px; font-size: 14px;">
            Estimated delivery: 2-5 business days
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending shipping email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending shipping email:", error);
    return { success: false, error };
  }
}
