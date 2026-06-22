import { z } from "zod";

const updateContactStatusSchema = z.object({
  status: z.enum(["pending", "read", "replied"]),
});

export { updateContactStatusSchema };
