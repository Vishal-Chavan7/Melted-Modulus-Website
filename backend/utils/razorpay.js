import Razorpay from "razorpay";
import ApiError from "./ApiError.js";

const ONLINE_PAYMENT_METHODS = ["upi", "card", "net_banking"];

const isOnlinePaymentMethod = (paymentMethod) =>
  ONLINE_PAYMENT_METHODS.includes(paymentMethod);

const assertRazorpayConfigured = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(
      503,
      "Online payments are not configured. Please contact support or choose Cash on Delivery.",
    );
  }
};

const getRazorpayClient = () => {
  assertRazorpayConfigured();

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getRazorpayKeyId = () => {
  assertRazorpayConfigured();
  return process.env.RAZORPAY_KEY_ID;
};

const toPaise = (amountInRupees) => Math.round(Number(amountInRupees) * 100);

export {
  ONLINE_PAYMENT_METHODS,
  isOnlinePaymentMethod,
  assertRazorpayConfigured,
  getRazorpayClient,
  getRazorpayKeyId,
  toPaise,
};
