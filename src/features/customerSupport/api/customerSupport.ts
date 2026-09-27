import {
  ConversationListItemResponse,
  ConversationResponse,
  CustomerResponse,
  MessageResponse,
} from "@/features/customerSupport/types/api";

const customersApiBaseUrl = "/api/customers";
const conversationsApiBaseUrl = "/api/conversations";

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  let message = "Something went wrong.";

  try {
    const data: { message?: string } = await response.json();

    if (data.message) {
      message = data.message;
    }
  } catch {
    // Response doesn't contain valid JSON.
  }

  throw new Error(message);
}

export async function fetchConversations(): Promise<
  ConversationListItemResponse[]
> {
  const response = await fetch(conversationsApiBaseUrl);

  return handleResponse<ConversationListItemResponse[]>(response);
}

export async function fetchConversation(
  conversationId: number,
): Promise<ConversationResponse> {
  const response = await fetch(`${conversationsApiBaseUrl}/${conversationId}`);

  return handleResponse<ConversationResponse>(response);
}

export async function fetchCustomerConversations(
  customerId: string,
): Promise<ConversationListItemResponse[]> {
  const response = await fetch(
    `${customersApiBaseUrl}/${customerId}/conversations`,
  );

  return handleResponse<ConversationListItemResponse[]>(response);
}

export async function fetchCustomers(): Promise<CustomerResponse[]> {
  const response = await fetch(customersApiBaseUrl);

  return handleResponse<CustomerResponse[]>(response);
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

  return handleResponse<ConversationResponse>(response);
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

  return handleResponse<MessageResponse>(response);
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

  return handleResponse<MessageResponse>(response);
}
