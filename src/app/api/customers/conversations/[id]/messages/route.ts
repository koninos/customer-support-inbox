import { createCustomerMessageRequestSchema } from "@/features/conversations/schemas/api";
import { MessageResponse } from "@/features/conversations/types/api";
import { MessageRow } from "@/features/conversations/types/database";
import pool from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const conversationId = Number(id);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return Response.json(
      { message: "Invalid conversation ID." },
      { status: 400 },
    );
  }

  const body = await request.json();

  const parsedBody = createCustomerMessageRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { content, customerId } = parsedBody.data;

  const conversationResult = await pool.query<{ customerName: string }>(
    `
    SELECT customers.name AS "customerName"
    FROM conversations
    INNER JOIN customers
      ON conversations.customer_id = customers.id
    WHERE conversations.id = $1
      AND conversations.customer_id = $2`,
    [conversationId, customerId],
  );

  if (!conversationResult.rowCount) {
    return Response.json(
      { message: "Conversation not found." },
      { status: 404 },
    );
  }

  const messageResult = await pool.query<MessageRow>(
    `
      INSERT INTO messages (
        conversation_id,
        sender_type,
        body
      )
      VALUES ($1, 'customer', $2)
      RETURNING
        id,
        body,
        created_at AS "createdAt",
        sender_type AS "senderType"
    `,
    [conversationId, content],
  );

  const message = messageResult.rows[0];
  const customerName = conversationResult.rows[0].customerName;

  const response: MessageResponse = {
    id: Number(message.id),
    content: message.body,
    sender: customerName,
    createdAt: message.createdAt.toISOString(),
    type: message.senderType,
  };

  return Response.json(response, { status: 201 });
}
