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

const updateUserProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10, "Invalid phone number")
    .optional(),

  address: z
    .object({
      street: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      country: z.string().trim().optional(),
      pincode: z.string().trim().optional(),
    })
    .refine(
      (address) => Object.keys(address).length > 0,
      { message: "At least one address field is required" },
    )
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

const resendVerificationSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  updateUserProfileSchema,
};
