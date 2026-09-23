import { conversations } from "@/features/conversations/data/conversations";
import { ConversationListItem } from "@/features/conversations/types/conversation";

export async function GET(): Promise<Response> {
  const summaries: ConversationListItem[] = conversations.map(
    ({ messages, ...conversation }) => conversation,
  );

  return Response.json(summaries);
}
