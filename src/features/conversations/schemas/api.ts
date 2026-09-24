import { z } from "zod";

export const createMessageRequestSchema = z.object({
  content: z.string().trim().min(1, "Message is required."),
});

export const createCustomerConversationRequestSchema = z.object({
  customerId: z.number().int().positive(),
  subject: z.string().trim().min(1, "Subject is required."),
  content: z.string().trim().min(1, "Message content is required."),
});
