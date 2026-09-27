import { useQuery } from "@tanstack/react-query";

import { fetchConversation } from "@/features/customerSupport/api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

export function useConversation(conversationId: number | null) {
  const query = useQuery({
    queryKey: keys.conversation(conversationId),
    queryFn: ({ signal }) => {
      if (conversationId === null) {
        throw new Error("Conversation ID is required.");
      }

      return fetchConversation(conversationId, signal);
    },
    enabled: conversationId !== null,
  });

  return {
    conversation: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
