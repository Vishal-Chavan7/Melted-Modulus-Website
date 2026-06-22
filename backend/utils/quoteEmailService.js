import sendEmail from "./sendEmailService.js";

const BRAND_NAME = process.env.SMTP_FROM_NAME || "Melted Modulus";

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

const normalizeFrontendUrl = (url) =>
  String(url || process.env.FRONTEND_URL || "").replace(/\/+$/, "");

const getQuoteReference = (quote) => {
  const id = String(quote._id || quote.id || "");
  return id ? `QR-${id.slice(-8).toUpperCase()}` : "Custom Quote";
};

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
      .detail-row { margin: 8px 0; }
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

const buildQuoteSummaryHtml = (quote) => {
  const reference = getQuoteReference(quote);
  const materialColor = [quote.material, quote.color].filter(Boolean).join(" / ") || "Not specified";

  return `
    <div class="info-box">
      <strong>Reference:</strong> ${reference}<br />
      <strong>Submitted:</strong> ${formatDate(quote.createdAt)}<br />
      <strong>Quantity:</strong> ${quote.quantity}<br />
      <strong>Material / Color:</strong> ${materialColor}
    </div>
    <p><strong>Project description:</strong><br />${quote.description || ""}</p>
  `;
};

const buildQuoteSummaryText = (quote) => {
  const reference = getQuoteReference(quote);
  const materialColor = [quote.material, quote.color].filter(Boolean).join(" / ") || "Not specified";

  return `
Reference: ${reference}
Submitted: ${formatDate(quote.createdAt)}
Quantity: ${quote.quantity}
Material / Color: ${materialColor}

Project description:
${quote.description || ""}
  `.trim();
};

const sendQuoteEmail = async ({ quote, subject, title, introHtml, introText, extraHtml = "", extraText = "" }) => {
  const contactUrl = `${normalizeFrontendUrl()}/contact`;
  const summaryHtml = buildQuoteSummaryHtml(quote);
  const summaryText = buildQuoteSummaryText(quote);

  const html = buildEmailLayout({
    title,
    bodyHtml: `
      <h2>Hi ${quote.name},</h2>
      <p>${introHtml}</p>
      ${extraHtml}
      ${summaryHtml}
      <div class="button-container">
        <a href="${contactUrl}" class="button">Contact Us</a>
      </div>
    `,
  });

  const text = `
Hi ${quote.name},

${introText}

${extraText}

${summaryText}

Contact us: ${contactUrl}
  `.trim();

  return sendEmail({ to: quote.email, subject, html, text });
};

const sendQuoteSubmissionEmail = async (quote) =>
  sendQuoteEmail({
    quote,
    subject: `Custom Quote Request Received - ${getQuoteReference(quote)}`,
    title: "Quote Request Received",
    introHtml:
      "Thank you for your custom 3D print request! We have received your details and our team will review them shortly.",
    introText:
      "Thank you for your custom 3D print request! We have received your details and our team will review them shortly.",
  });

const sendQuoteReviewedEmail = async (quote) =>
  sendQuoteEmail({
    quote,
    subject: `Your Quote Is Under Review - ${getQuoteReference(quote)}`,
    title: "Quote Under Review",
    introHtml:
      "Good news — we are now <strong>reviewing</strong> your custom print request. We will follow up with a quote or next steps soon.",
    introText:
      "Good news — we are now reviewing your custom print request. We will follow up with a quote or next steps soon.",
  });

const sendQuoteQuotedEmail = async (quote) => {
  const priceHtml = quote.quotedPrice != null
    ? `<div class="info-box"><strong>Quoted price:</strong> ${formatPrice(quote.quotedPrice)}</div>`
    : "";
  const priceText = quote.quotedPrice != null ? `Quoted price: ${formatPrice(quote.quotedPrice)}` : "";
  const notesHtml = quote.adminNotes
    ? `<p><strong>Notes from our team:</strong><br />${quote.adminNotes}</p>`
    : "";
  const notesText = quote.adminNotes ? `Notes from our team:\n${quote.adminNotes}` : "";

  return sendQuoteEmail({
    quote,
    subject: `Your Custom Print Quote - ${getQuoteReference(quote)}`,
    title: "Your Quote Is Ready",
    introHtml:
      "We have prepared a quote for your custom 3D print request. Please review the details below and contact us if you would like to proceed.",
    introText:
      "We have prepared a quote for your custom 3D print request. Please review the details below and contact us if you would like to proceed.",
    extraHtml: `${priceHtml}${notesHtml}`,
    extraText: [priceText, notesText].filter(Boolean).join("\n\n"),
  });
};

const sendQuoteClosedEmail = async (quote) => {
  const notesHtml = quote.adminNotes
    ? `<p><strong>Additional note:</strong><br />${quote.adminNotes}</p>`
    : "";
  const notesText = quote.adminNotes ? `Additional note:\n${quote.adminNotes}` : "";

  return sendQuoteEmail({
    quote,
    subject: `Custom Quote Request Closed - ${getQuoteReference(quote)}`,
    title: "Quote Request Closed",
    introHtml:
      "Your custom quote request has been marked as <strong>closed</strong>. If you have any questions or would like to submit a new request, feel free to reach out.",
    introText:
      "Your custom quote request has been marked as closed. If you have any questions or would like to submit a new request, feel free to reach out.",
    extraHtml: notesHtml,
    extraText: notesText,
  });
};

const QUOTE_STATUS_EMAILS = {
  reviewed: sendQuoteReviewedEmail,
  quoted: sendQuoteQuotedEmail,
  closed: sendQuoteClosedEmail,
};

const sendQuoteStatusEmail = async (quote, status) => {
  const sendFn = QUOTE_STATUS_EMAILS[status];
  if (!sendFn) return null;
  return sendFn(quote);
};

export {
  sendQuoteSubmissionEmail,
  sendQuoteReviewedEmail,
  sendQuoteQuotedEmail,
  sendQuoteClosedEmail,
  sendQuoteStatusEmail,
};
