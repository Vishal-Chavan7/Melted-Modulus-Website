import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid product id",
  });

const addToWishlistSchema = z.object({
  productId: objectIdSchema,
});

export { addToWishlistSchema };
