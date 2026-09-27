export const customerSupportQueryKeys = {
  customers: ["customers"] as const,

  conversations: ["conversations"] as const,

  customerConversations: (customerId: string) =>
    ["customerConversations", customerId] as const,

  conversation: (conversationId: number | null) =>
    ["conversation", conversationId] as const,
};
