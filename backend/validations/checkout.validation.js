import { z } from "zod";

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  street: z.string().trim().min(2, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  country: z.string().trim().min(2, "Country is required"),
  pincode: z.string().trim().min(4, "Pincode is required"),
});

const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.literal("cash_on_delivery", {
    errorMap: () => ({ message: "Cash on Delivery is required for this checkout endpoint" }),
  }),
});

const onlineCheckoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["upi", "card", "net_banking"], {
    errorMap: () => ({ message: "Please select a valid online payment method" }),
  }),
});

const verifyPaymentSchema = z.object({
  orderId: z.string().trim().min(1, "Order id is required"),
  razorpay_order_id: z.string().trim().min(1, "Razorpay order id is required"),
  razorpay_payment_id: z.string().trim().min(1, "Razorpay payment id is required"),
  razorpay_signature: z.string().trim().min(1, "Razorpay signature is required"),
});

const retryPaymentSchema = z.object({
  orderId: z.string().trim().min(1, "Order id is required"),
});

export {
  checkoutSchema,
  onlineCheckoutSchema,
  verifyPaymentSchema,
  retryPaymentSchema,
};
