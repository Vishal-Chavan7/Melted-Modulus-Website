import sendEmail from "./sendEmailService.js";

const BRAND_NAME = process.env.SMTP_FROM_NAME || "Melted Modulus";

const PAYMENT_LABELS = {
  cash_on_delivery: "Cash on Delivery",
  upi: "UPI",
  card: "Credit / Debit Card",
  net_banking: "Net Banking",
};

const formatPrice = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "₹0";
  return `₹${value.toLocaleString("en-IN")}`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getOrderTotals = (order) => {
  const subtotal =
    order.subtotalAmount ??
    (order.items || []).reduce(
      (sum, item) => sum + Number(item.priceAtPurchase) * item.quantity,
      0,
    );

  const shipping =
    order.shippingCharge ??
    Math.max(0, Number(order.totalAmount) - subtotal);

  const grandTotal = Number(order.totalAmount ?? subtotal + shipping);

  return { subtotal, shipping, grandTotal };
};

const normalizeFrontendUrl = (url) => String(url || process.env.FRONTEND_URL || "").replace(/\/+$/, "");

const buildEmailLayout = ({ title, bodyHtml }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #a259ff 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 32px 28px; color: #666; line-height: 1.6; }
      .content h2 { color: #333; margin-top: 0; }
      .info-box { background: #f8f9fa; border-left: 4px solid #a259ff; padding: 16px; margin: 20px 0; border-radius: 4px; }
      .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
      .order-table th, .order-table td { padding: 10px 8px; border-bottom: 1px solid #eee; text-align: left; }
      .order-table th { color: #888; font-size: 12px; text-transform: uppercase; }
      .total-row td { font-weight: bold; color: #333; border-bottom: none; }
      .button-container { text-align: center; margin: 28px 0; }
      .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #a259ff 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; }
      .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>${title}</h1></div>
      <div class="content">${bodyHtml}</div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  </body>
  </html>
`;

const buildOrderSummaryHtml = (order) => {
  const itemsHtml = (order.items || [])
    .map((item) => {
      const productName = item.product?.name || "Product";
      const lineTotal = Number(item.priceAtPurchase) * item.quantity;
      return `
        <tr>
          <td>${productName}</td>
          <td>${item.quantity}</td>
          <td>${formatPrice(item.priceAtPurchase)}</td>
          <td>${formatPrice(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const address = order.shippingAddress || {};
  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod;
  const { subtotal, shipping, grandTotal } = getOrderTotals(order);
  const shippingLabel = shipping === 0 ? "Free" : formatPrice(shipping);

  return `
    <div class="info-box">
      <strong>Order:</strong> ${order.orderNumber}<br />
      <strong>Date:</strong> ${formatDate(order.createdAt)}<br />
      <strong>Payment:</strong> ${paymentLabel}
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="3">Subtotal</td>
          <td>${formatPrice(subtotal)}</td>
        </tr>
        <tr>
          <td colspan="3">Delivery Charges</td>
          <td>${shippingLabel}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">Order Total</td>
          <td>${formatPrice(grandTotal)}</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Ship to:</strong><br />
      ${address.fullName || ""}<br />
      ${[address.street, address.city, address.state, address.pincode].filter(Boolean).join(", ")}<br />
      ${address.phone ? `Phone: ${address.phone}` : ""}
    </p>
  `;
};

const buildOrderSummaryText = (order) => {
  const lines = (order.items || []).map(
    (item) =>
      `- ${item.product?.name || "Product"} x${item.quantity} = ${formatPrice(Number(item.priceAtPurchase) * item.quantity)}`,
  );

  const address = order.shippingAddress || {};
  const { subtotal, shipping, grandTotal } = getOrderTotals(order);
  const shippingLabel = shipping === 0 ? "Free" : formatPrice(shipping);

  return `
Order: ${order.orderNumber}
Date: ${formatDate(order.createdAt)}
Payment: ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}

Items:
${lines.join("\n")}

Subtotal: ${formatPrice(subtotal)}
Delivery Charges: ${shippingLabel}
Total: ${formatPrice(grandTotal)}

Ship to:
${address.fullName || ""}
${[address.street, address.city, address.state, address.pincode].filter(Boolean).join(", ")}
${address.phone ? `Phone: ${address.phone}` : ""}
  `.trim();
};

const getRecipient = (order) => {
  const email = order.user?.email;
  const name = order.user?.name || order.shippingAddress?.fullName || "Customer";

  if (!email) {
    throw new Error("Order recipient email not found");
  }

  return { email, name };
};

const sendOrderEmail = async ({ order, subject, title, introHtml, introText, ctaLabel, ctaPath }) => {
  const { email, name } = getRecipient(order);
  const ordersUrl = `${normalizeFrontendUrl()}/${ctaPath || "account/orders"}`;
  const summaryHtml = buildOrderSummaryHtml(order);
  const summaryText = buildOrderSummaryText(order);

  const html = buildEmailLayout({
    title,
    bodyHtml: `
      <h2>Hi ${name},</h2>
      <p>${introHtml}</p>
      ${summaryHtml}
      <div class="button-container">
        <a href="${ordersUrl}" class="button">${ctaLabel || "View My Orders"}</a>
      </div>
    `,
  });

  const text = `
Hi ${name},

${introText}

${summaryText}

View your orders: ${ordersUrl}
  `.trim();

  return sendEmail({ to: email, subject, html, text });
};

const sendOrderConfirmationEmail = async (order) =>
  sendOrderEmail({
    order,
    subject: `Order Confirmed - ${order.orderNumber}`,
    title: "Order Received",
    introHtml:
      "Thank you for your order! We have received it and will begin preparing your 3D prints soon. Most orders are processed within <strong>3–5 business days</strong> before shipping.",
    introText:
      "Thank you for your order! We have received it and will begin preparing your 3D prints soon. Most orders are processed within 3-5 business days before shipping.",
    ctaLabel: "Track My Order",
  });

const sendOrderProcessingEmail = async (order) =>
  sendOrderEmail({
    order,
    subject: `Your Order Is Being Printed - ${order.orderNumber}`,
    title: "Print In Progress",
    introHtml:
      "Good news — your order is now <strong>being processed</strong>. Our team is preparing your 3D prints. We will notify you when it ships.",
    introText:
      "Good news — your order is now being processed. Our team is preparing your 3D prints. We will notify you when it ships.",
    ctaLabel: "View Order Status",
  });

const sendOrderShippedEmail = async (order) =>
  sendOrderEmail({
    order,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    title: "Order Shipped",
    introHtml:
      "Your order is on its way! It has been packed and handed over for delivery. Please allow a few days for it to reach you.",
    introText:
      "Your order is on its way! It has been packed and handed over for delivery. Please allow a few days for it to reach you.",
    ctaLabel: "View Order Details",
  });

const sendOrderDeliveredEmail = async (order) =>
  sendOrderEmail({
    order,
    subject: `Order Delivered - ${order.orderNumber}`,
    title: "Order Delivered",
    introHtml:
      "Your order has been marked as <strong>delivered</strong>. We hope you love your prints! If anything is wrong, please contact us and we will help.",
    introText:
      "Your order has been marked as delivered. We hope you love your prints! If anything is wrong, please contact us and we will help.",
    ctaLabel: "View My Orders",
  });

const ORDER_STATUS_EMAILS = {
  processing: sendOrderProcessingEmail,
  shipped: sendOrderShippedEmail,
  delivered: sendOrderDeliveredEmail,
};

const sendOrderStatusEmail = async (order, orderStatus) => {
  const sendFn = ORDER_STATUS_EMAILS[orderStatus];
  if (!sendFn) return null;
  return sendFn(order);
};

export {
  sendOrderConfirmationEmail,
  sendOrderProcessingEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderStatusEmail,
};
