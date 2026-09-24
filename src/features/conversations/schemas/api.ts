import { z } from "zod";

export const createMessageRequestSchema = z.object({
  content: z.string().trim().min(1, "Message is required."),
});
