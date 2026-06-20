import { z } from "zod";

const createContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  subject: z.enum(
    ["general", "product", "custom", "shipping", "feedback", "other"],
    { message: "Please select a valid subject" },
  ),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export { createContactSchema };
