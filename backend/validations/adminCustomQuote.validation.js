import { z } from "zod";

const updateCustomQuoteStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "quoted", "closed"]),
});

export { updateCustomQuoteStatusSchema };
