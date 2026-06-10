import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string() 
    .email({ message: "Invalid email" }), 

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  phone: z
    .string()
    .min(10, "Invalid phone number"),
});


const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" }),
});

const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
