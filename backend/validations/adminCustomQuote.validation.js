import { z } from "zod";

const updateCustomQuoteStatusSchema = z
  .object({
    status: z.enum(["pending", "reviewed", "quoted", "closed"]),
    quotedPrice: z.coerce.number().min(0, "Quoted price must be 0 or greater").optional(),
    adminNotes: z.string().trim().max(1000, "Notes must be 1000 characters or fewer").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "quoted" && data.quotedPrice == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quoted price is required when marking a request as quoted",
        path: ["quotedPrice"],
      });
    }
  });

export { updateCustomQuoteStatusSchema };
