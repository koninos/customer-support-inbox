import {
  ConversationListItemResponse,
  ConversationResponse,
} from "@/features/conversations/types/api";

const conversationsApiBaseUrl = "/api/conversations";
const customerConversationsApiBaseUrl = "/api/customers";

export async function fetchConversation(
  conversationId: number,
): Promise<ConversationResponse> {
  const response = await fetch(`${conversationsApiBaseUrl}/${conversationId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversation.");
  }

  return response.json();
}

export async function fetchCustomerConversations(
  customerId: string,
): Promise<ConversationListItemResponse[]> {
  const response = await fetch(
    `${customerConversationsApiBaseUrl}/${customerId}/conversations`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversations.");
  }

  return response.json();
}
