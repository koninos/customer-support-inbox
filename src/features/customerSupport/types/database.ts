export type ConversationListItemRow = {
  id: number;
  subject: string;
  status: "open" | "closed";
  customer: string;
};

export type MessageRow = {
  id: string;
  sender: string;
  body: string;
  createdAt: Date;
  senderType: "customer" | "agent";
};

export type CustomerRow = {
  id: string;
  name: string;
};
