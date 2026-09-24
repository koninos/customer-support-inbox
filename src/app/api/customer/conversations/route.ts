import pool from "@/lib/db";
import { createCustomerConversationRequestSchema } from "@/features/conversations/schemas/api";
import { ConversationResponse } from "@/features/conversations/types/api";
import { MessageRow } from "@/features/conversations/types/database";

export async function POST(request: Request) {
  const body = await request.json();

  const result = createCustomerConversationRequestSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { customerId, subject, content } = result.data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const customerResult = await client.query<{ name: string }>(
      `
        SELECT name
        FROM customers
        WHERE id = $1
      `,
      [customerId],
    );

    if (!customerResult.rowCount) {
      await client.query("ROLLBACK");

      return Response.json({ message: "Customer not found." }, { status: 404 });
    }

    const customerName = customerResult.rows[0].name;

    const conversationResult = await client.query<{ id: string }>(
      `
        INSERT INTO conversations (
          customer_id,
          subject,
          status
        )
        VALUES ($1, $2, 'open')
        RETURNING id
      `,
      [customerId, subject],
    );

    const conversationId = conversationResult.rows[0].id;

    const messageResult = await client.query<MessageRow>(
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

    await client.query("COMMIT");

    const message = messageResult.rows[0];

    const response: ConversationResponse = {
      id: Number(conversationId),
      subject,
      customer: customerName,
      status: "open",
      messages: [
        {
          id: Number(message.id),
          sender: customerName,
          content: message.body,
          createdAt: message.createdAt.toISOString(),
          type: message.senderType,
        },
      ],
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
