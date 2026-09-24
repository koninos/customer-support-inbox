export type ConversationListItemResponse = {
  id: number;
  subject: string;
  customer: string;
  status: "open" | "closed";
};

export type MessageResponse = {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
  type: "customer" | "agent";
};

export type ConversationResponse = ConversationListItemResponse & {
  messages: MessageResponse[];
};

export type CreateCustomerConversationRequest = {
  customerId: number;
  subject: string;
  content: string;
};
