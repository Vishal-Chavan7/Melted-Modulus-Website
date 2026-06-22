import sendEmail from "./sendEmailService.js";

const BRAND_NAME = process.env.SMTP_FROM_NAME || "Melted Modulus";

const SUBJECT_LABELS = {
  general: "General Inquiry",
  product: "Product Question",
  custom: "Custom Print",
  shipping: "Shipping",
  feedback: "Feedback",
  other: "Other",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const normalizeFrontendUrl = (url) =>
  String(url || process.env.FRONTEND_URL || "").replace(/\/+$/, "");

const getContactReference = (contact) => {
  const id = String(contact._id || contact.id || "");
  return id ? `CM-${id.slice(-8).toUpperCase()}` : "Contact Message";
};

const getSubjectLabel = (subject) => SUBJECT_LABELS[subject] || subject || "General Inquiry";

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
      .reply-box { background: #f3ecff; border-left: 4px solid #764ba2; padding: 16px; margin: 20px 0; border-radius: 4px; }
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

const buildContactSummaryHtml = (contact) => `
  <div class="info-box">
    <strong>Reference:</strong> ${getContactReference(contact)}<br />
    <strong>Subject:</strong> ${getSubjectLabel(contact.subject)}<br />
    <strong>Sent:</strong> ${formatDate(contact.createdAt)}
  </div>
  <p><strong>Your message:</strong><br />${contact.message || ""}</p>
`;

const buildContactSummaryText = (contact) => `
Reference: ${getContactReference(contact)}
Subject: ${getSubjectLabel(contact.subject)}
Sent: ${formatDate(contact.createdAt)}

Your message:
${contact.message || ""}
`.trim();

const sendContactEmail = async ({
  contact,
  subject,
  title,
  introHtml,
  introText,
  extraHtml = "",
  extraText = "",
}) => {
  const contactUrl = `${normalizeFrontendUrl()}/contact`;
  const summaryHtml = buildContactSummaryHtml(contact);
  const summaryText = buildContactSummaryText(contact);

  const html = buildEmailLayout({
    title,
    bodyHtml: `
      <h2>Hi ${contact.name},</h2>
      <p>${introHtml}</p>
      ${extraHtml}
      ${summaryHtml}
      <div class="button-container">
        <a href="${contactUrl}" class="button">Contact Us</a>
      </div>
    `,
  });

  const text = `
Hi ${contact.name},

${introText}

${extraText}

${summaryText}

Contact us: ${contactUrl}
  `.trim();

  return sendEmail({ to: contact.email, subject, html, text });
};

const sendContactSubmissionEmail = async (contact) =>
  sendContactEmail({
    contact,
    subject: `We Received Your Message - ${getContactReference(contact)}`,
    title: "Message Received",
    introHtml:
      "Thank you for contacting us! We have received your message and will get back to you as soon as possible.",
    introText:
      "Thank you for contacting us! We have received your message and will get back to you as soon as possible.",
  });

const sendContactRepliedEmail = async (contact) => {
  const replyHtml = contact.adminReply
    ? `<div class="reply-box"><strong>Our reply:</strong><br />${contact.adminReply}</div>`
    : "";
  const replyText = contact.adminReply ? `Our reply:\n${contact.adminReply}` : "";

  return sendContactEmail({
    contact,
    subject: `Reply to Your Message - ${getContactReference(contact)}`,
    title: "We Replied to Your Message",
    introHtml: "We have reviewed your message and sent you a reply below.",
    introText: "We have reviewed your message and sent you a reply below.",
    extraHtml: replyHtml,
    extraText: replyText,
  });
};

export { sendContactSubmissionEmail, sendContactRepliedEmail };
