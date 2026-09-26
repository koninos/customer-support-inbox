import pool from "@/lib/db";
import { ConversationListItemResponse } from "@/features/customerSupport/types/api";
import { ConversationListItemRow } from "@/features/customerSupport/types/database";

export async function GET() {
  const result = await pool.query<ConversationListItemRow>(`
    SELECT
      conversations.id,
      conversations.subject,
      conversations.status,
      customers.name AS "customer"
    FROM conversations
    INNER JOIN customers
      ON conversations.customer_id = customers.id
    ORDER BY conversations.updated_at DESC
  `);

  const conversations: ConversationListItemResponse[] = result.rows.map(
    (row) => ({
      id: Number(row.id),
      subject: row.subject,
      status: row.status,
      customer: row.customer,
    }),
  );

  return Response.json(conversations);
}
