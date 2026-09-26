import { useEffect, useState } from "react";

import { fetchConversations } from "@/features/customerSupport/api/customerSupport";
import { ConversationListItemResponse } from "@/features/customerSupport/types/api";

export function useConversations() {
  const [conversations, setConversations] = useState<
    ConversationListItemResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await fetchConversations();

        setConversations(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load conversations.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, []);

  return {
    conversations,
    isLoading,
    error,
  };
}
