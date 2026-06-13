import { z } from "zod";

const updateAdminUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10, "Invalid phone number")
    .optional(),

  role: z
    .enum(["user", "admin"])
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export { updateAdminUserSchema };
