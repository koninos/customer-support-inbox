import pool from "@/lib/db";

import {
  CreateMessageRequest,
  MessageResponse,
} from "@/features/conversations/types/api";
import { MessageRow } from "@/features/conversations/types/database";
import { createMessageRequestSchema } from "@/features/conversations/schemas/api";

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

  const parsedBody = createMessageRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const content = parsedBody.data.content;

  const conversationResult = await pool.query(
    `
      SELECT id
      FROM conversations
      WHERE id = $1
    `,
    [conversationId],
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
      VALUES ($1, 'agent', $2)
      RETURNING
        id,
        body,
        created_at AS "createdAt",
        sender_type AS "senderType"
    `,
    [conversationId, content],
  );

  const message = messageResult.rows[0];

  const response: MessageResponse = {
    id: Number(message.id),
    sender: "Support Agent",
    content: message.body,
    createdAt: message.createdAt.toISOString(),
    type: message.senderType,
  };

  return Response.json(response);
}
