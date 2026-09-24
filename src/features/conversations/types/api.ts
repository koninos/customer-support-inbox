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
  timestamp: string;
  type: "customer" | "agent";
};

export type ConversationResponse = ConversationListItemResponse & {
  messages: MessageResponse[];
};
