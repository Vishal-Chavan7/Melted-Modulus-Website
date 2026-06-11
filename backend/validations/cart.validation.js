import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid product id",
  });

const cartItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.coerce
    .number({
      error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

const addToCartSchema = cartItemSchema;
const updateCartItemQuantitySchema = cartItemSchema;

export { addToCartSchema, updateCartItemQuantitySchema };
