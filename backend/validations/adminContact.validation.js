import { z } from "zod";

const updateContactStatusSchema = z
  .object({
    status: z.enum(["pending", "replied"]),
    adminReply: z.string().trim().min(1, "Reply message is required").max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "replied" && !data.adminReply) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reply message is required when marking a message as replied",
        path: ["adminReply"],
      });
    }
  });

export { updateContactStatusSchema };
