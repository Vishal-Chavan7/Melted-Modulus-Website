import crypto from "crypto";

const verifyRazorpayPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  secret = process.env.RAZORPAY_KEY_SECRET,
}) => {
  if (!secret) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

const verifyRazorpayWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
};

export { verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature };
