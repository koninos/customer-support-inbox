import {
  ConversationListItemResponse,
  ConversationResponse,
} from "@/features/customerSupport/types/api";
import { CustomerResponse } from "@/features/customerSupport/types/api";

const customersApiBaseUrl = "/api/customers";
const conversationsApiBaseUrl = "/api/conversations";

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
    `${customersApiBaseUrl}/${customerId}/conversations`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversations.");
  }

  return response.json();
}

export async function fetchCustomers(): Promise<CustomerResponse[]> {
  const response = await fetch(`${customersApiBaseUrl}`);

  if (!response.ok) {
    throw new Error("Failed to fetch customers.");
  }

  return response.json();
}
