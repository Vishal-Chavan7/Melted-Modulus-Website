import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid category id",
  });

const productFormFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be less than 500 characters"),

  material: z
    .string()
    .trim()
    .min(3, "Material must be at least 3 characters")
    .max(100, "Material must be less than 100 characters"),

  price: z.coerce.number({
    error: "Price must be a number",
  }).positive("Price must be a positive number"),

  category: objectIdSchema,

  inventoryQuantity: z.coerce
    .number({
      error: "Inventory quantity must be a number",
    })
    .int("Inventory quantity must be an integer")
    .min(0, "Inventory quantity must be at least 0"),

  sku: z
    .string()
    .trim()
    .min(5, "SKU must be at least 5 characters")
    .max(50, "SKU must be less than 50 characters"),

  isActive: z.coerce.boolean().default(true),

  existingImages: z.string().optional(),
});

const createProductFormSchema = productFormFieldsSchema.omit({ existingImages: true });

const updateProductFormSchema = productFormFieldsSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export {
  createProductFormSchema,
  updateProductFormSchema,
};
