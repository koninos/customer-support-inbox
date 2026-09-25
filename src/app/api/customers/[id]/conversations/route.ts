import pool from "@/lib/db";
import { ConversationListItemResponse } from "@/features/conversations/types/api";
import { ConversationListItemRow } from "@/features/conversations/types/database";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const customerId = Number(id);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return Response.json({ message: "Invalid customer ID." }, { status: 400 });
  }

  const customerResult = await pool.query(
    `
      SELECT id
      FROM customers
      WHERE id = $1
    `,
    [customerId],
  );

  if (!customerResult.rowCount) {
    return Response.json({ message: "Customer not found." }, { status: 404 });
  }

  const result = await pool.query<ConversationListItemRow>(
    `
      SELECT
        conversations.id,
        conversations.subject,
        conversations.status,
        customers.name AS customer
      FROM conversations
      INNER JOIN customers
        ON conversations.customer_id = customers.id
      WHERE customers.id = $1
      ORDER BY conversations.updated_at DESC
    `,
    [customerId],
  );

  const conversations: ConversationListItemResponse[] = result.rows.map(
    (conversation) => ({
      id: Number(conversation.id),
      subject: conversation.subject,
      customer: conversation.customer,
      status: conversation.status,
    }),
  );

  return Response.json(conversations);
}
