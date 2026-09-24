import pool from "@/lib/db";
import { ConversationListItem } from "@/features/conversations/types/conversation";

export async function GET() {
  console.log("Reading conversations from PostgreSQL");

  const result = await pool.query<ConversationListItem>(`
    SELECT
      conversations.id,
      conversations.subject,
      conversations.status,
      customers.name AS customer
    FROM conversations
    INNER JOIN customers
      ON conversations.customer_id = customers.id
    ORDER BY conversations.updated_at DESC
  `);

  const conversations: ConversationListItem[] = result.rows;

  return Response.json(conversations);
}
