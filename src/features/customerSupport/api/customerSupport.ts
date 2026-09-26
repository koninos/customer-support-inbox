import {
  ConversationListItemResponse,
  ConversationResponse,
  CustomerResponse,
  MessageResponse,
} from "@/features/customerSupport/types/api";

const customersApiBaseUrl = "/api/customers";
const conversationsApiBaseUrl = "/api/conversations";

export async function fetchConversations(): Promise<
  ConversationListItemResponse[]
> {
  const response = await fetch(conversationsApiBaseUrl);

  if (!response.ok) {
    throw new Error("Failed to load conversations.");
  }

  return response.json();
}

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
  const response = await fetch(customersApiBaseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch customers.");
  }

  return response.json();
}

export async function createCustomerConversation(
  customerId: string,
  subject: string,
  content: string,
): Promise<ConversationResponse> {
  const response = await fetch(`${customersApiBaseUrl}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId: Number(customerId),
      subject,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation.");
  }

  return response.json();
}

export async function sendCustomerMessage(
  conversationId: number,
  customerId: number,
  content: string,
): Promise<MessageResponse> {
  const response = await fetch(
    `${customersApiBaseUrl}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        content,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send reply.");
  }

  return response.json();
}

export async function sendAgentMessage(
  conversationId: number,
  content: string,
): Promise<MessageResponse> {
  const response = await fetch(
    `${conversationsApiBaseUrl}/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send reply.");
  }

  return response.json();
}
