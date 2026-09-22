export type ConversationSummary = {
  id: number;
  subject: string;
  customer: string;
  status: "open" | "closed";
};

export type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: "customer" | "agent";
};

export type Conversation = ConversationSummary & {
  messages: Message[];
};
