import { z } from "zod";

const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters"),
    description: z
        .string()
        .trim()
        .optional(),
    isActive: z
        .boolean()
        .optional()
        .default(true),
});

const updateCategorySchema = categorySchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" },
);

export { categorySchema, updateCategorySchema };