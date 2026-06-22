import nodemailer from "nodemailer";

const BRAND_NAME = process.env.SMTP_FROM_NAME || "Melted Modulus";

const createTransporter = () => {
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME || BRAND_NAME} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const normalizeFrontendUrl = (url) => String(url || "").replace(/\/+$/, "");

const buildEmailLayout = ({ title, bodyHtml, footerNote }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #a259ff 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { padding: 40px 30px; }
      .content h2 { color: #333; margin-top: 0; }
      .content p { color: #666; line-height: 1.6; }
      .button-container { text-align: center; margin: 35px 0; }
      .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #a259ff 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; }
      .link-box { background: #f8f9fa; padding: 15px; border-radius: 4px; word-break: break-all; margin: 20px 0; }
      .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; }
      .warning { color: #dc3545; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>${title}</h1></div>
      <div class="content">${bodyHtml}</div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
        <p>${footerNote || "This is an automated email. Please do not reply to this message."}</p>
      </div>
    </div>
  </body>
  </html>
`;

const sendVerificationEmail = async (
  to,
  name,
  verificationToken,
  frontendUrl = process.env.FRONTEND_URL,
) => {
  const verifyUrl = `${normalizeFrontendUrl(frontendUrl)}/verify-email?token=${verificationToken}`;
  const subject = "Verify Your Email - Melted Modulus";

  const html = buildEmailLayout({
    title: "Verify Your Email",
    bodyHtml: `
      <h2>Hi ${name},</h2>
      <p>Thanks for signing up with ${BRAND_NAME}. Please verify your email address to activate your account.</p>
      <div class="button-container">
        <a href="${verifyUrl}" class="button">Verify Email</a>
      </div>
      <p style="text-align: center; color: #999; font-size: 14px;">Button not working? Copy and paste this link:</p>
      <div class="link-box"><a href="${verifyUrl}" style="color: #a259ff;">${verifyUrl}</a></div>
      <p><strong>Important:</strong> This link expires in <span class="warning">24 hours</span>.</p>
      <p style="color: #999; font-size: 14px;">If you did not create an account, you can ignore this email.</p>
    `,
  });

  const text = `
Hi ${name},

Thanks for signing up with ${BRAND_NAME}.

Verify your email by opening this link:
${verifyUrl}

This link expires in 24 hours.

If you did not create an account, please ignore this email.
  `;

  return sendEmail({ to, subject, html, text });
};

const sendResetPasswordEmail = async (
  to,
  name,
  resetToken,
  frontendUrl = process.env.FRONTEND_URL,
) => {
  const resetUrl = `${normalizeFrontendUrl(frontendUrl)}/reset-password?token=${resetToken}`;
  const subject = "Reset Your Password - Melted Modulus";

  const html = buildEmailLayout({
    title: "Password Reset",
    bodyHtml: `
      <h2>Hi ${name},</h2>
      <p>We received a request to reset your password.</p>
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p style="text-align: center; color: #999; font-size: 14px;">Button not working? Copy and paste this link:</p>
      <div class="link-box"><a href="${resetUrl}" style="color: #a259ff;">${resetUrl}</a></div>
      <p><strong>Important:</strong> This link expires in <span class="warning">15 minutes</span>.</p>
      <p style="color: #999; font-size: 14px;">If you did not request a password reset, you can ignore this email.</p>
    `,
  });

  const text = `
Hi ${name},

Reset your password using this link:
${resetUrl}

This link expires in 15 minutes.

If you did not request a password reset, please ignore this email.
  `;

  return sendEmail({ to, subject, html, text });
};

export default sendEmail;
export { sendVerificationEmail, sendResetPasswordEmail };
