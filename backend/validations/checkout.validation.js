import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2, "Full name is required"),
    phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
    street: z.string().trim().min(2, "Street address is required"),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    country: z.string().trim().min(2, "Country is required"),
    pincode: z.string().trim().min(4, "Pincode is required"),
  }),
  paymentMethod: z.enum(["cash_on_delivery", "upi", "card", "net_banking"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
});

export { checkoutSchema };
