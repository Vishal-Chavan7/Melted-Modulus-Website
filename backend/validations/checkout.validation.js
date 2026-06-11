import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().trim().min(2, "Street is required"),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    country: z.string().trim().min(2, "Country is required"),
    pincode: z.string().trim().min(4, "Pincode is required"),
  }),
});

export { checkoutSchema };
