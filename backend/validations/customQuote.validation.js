import { z } from "zod";

const createCustomQuoteSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").default(1),
  description: z.string().trim().min(10, "Project description must be at least 10 characters"),
  material: z.string().trim().optional(),
  color: z.string().trim().optional(),
});

export { createCustomQuoteSchema };
