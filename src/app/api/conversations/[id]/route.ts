import pool from "@/lib/db";
import {
  ConversationResponse,
  MessageResponse,
} from "@/features/conversations/types/api";
import {
  ConversationListItemRow,
  MessageRow,
} from "@/features/conversations/types/database";

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

  const conversationResult = await pool.query<ConversationListItemRow>(
    `
      SELECT
        conversations.id,
        conversations.subject,
        conversations.status,
        customers.name AS "customer"
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

  const messagesResult = await pool.query<MessageRow>(
    `
    SELECT
      messages.id,
      customers.name AS "sender",
      messages.body,
      messages.created_at AS "createdAt",
      messages.sender_type AS "senderType"
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

  console.log(messagesResult.rows);

  const messages: MessageResponse[] = messagesResult.rows.map((message) => ({
    id: Number(message.id),
    sender: message.sender,
    content: message.body,
    timestamp: message.createdAt.toISOString(),
    type: message.senderType,
  }));

  const response: ConversationResponse = {
    ...conversation,
    messages,
  };

  return Response.json(response);
}
