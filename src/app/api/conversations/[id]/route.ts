import pool from "@/lib/db";
import { Conversation } from "@/features/conversations/types/conversation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const conversationId = Number(id);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return Response.json(
      { message: "Invalid conversation ID." },
      { status: 400 },
    );
  }

  const conversationResult = await pool.query<{
    id: number;
    subject: string;
    status: "open" | "closed";
    customer: string;
  }>(
    `
      SELECT
        conversations.id,
        conversations.subject,
        conversations.status,
        customers.name AS customer
      FROM conversations
      INNER JOIN customers
        ON conversations.customer_id = customers.id
      WHERE conversations.id = $1
    `,
    [conversationId],
  );

  if (conversationResult.rowCount === 0) {
    return Response.json(
      { message: "Conversation not found." },
      { status: 404 },
    );
  }

  const conversation = conversationResult.rows[0];

  const messagesResult = await pool.query<{
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    type: "customer" | "agent";
  }>(
    `
    SELECT
      messages.id,
      customers.name AS sender,
      messages.body AS content,
      messages.created_at AS timestamp,
      messages.sender_type AS type
    FROM messages
    INNER JOIN conversations
      ON messages.conversation_id = conversations.id
    INNER JOIN customers
      ON conversations.customer_id = customers.id
    WHERE messages.conversation_id = $1
    ORDER BY messages.created_at ASC
    `,
    [conversationId],
  );

  const result: Conversation = {
    ...conversation,
    messages: messagesResult.rows,
  };

  return Response.json(result);
}
