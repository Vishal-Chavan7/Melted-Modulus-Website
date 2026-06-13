import { z } from "zod";

const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export { updateOrderStatusSchema };
