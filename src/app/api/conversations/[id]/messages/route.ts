import pool from "@/lib/db";

import {
  CreateMessageRequest,
  MessageResponse,
} from "@/features/conversations/types/api";
import { MessageRow } from "@/features/conversations/types/database";

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

  const body = (await request.json()) as CreateMessageRequest;

  if (!body.content?.trim()) {
    return Response.json(
      { message: "Message content is required." },
      { status: 400 },
    );
  }

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
    [conversationId, body.content.trim()],
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
