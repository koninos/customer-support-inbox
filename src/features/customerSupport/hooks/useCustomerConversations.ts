import { useEffect, useState } from "react";

import {
  ConversationListItemResponse,
  ConversationResponse,
} from "@/features/customerSupport/types/api";
import { fetchCustomerConversations } from "../api/customerSupport";

export function useCustomerConversations(customerId: string) {
  const [conversations, setConversations] = useState<
    ConversationListItemResponse[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      return;
    }

    async function fetchConversations() {
      setIsLoading(true);
      setError(null);

      try {
        const data: ConversationListItemResponse[] =
          await fetchCustomerConversations(customerId);

        setConversations(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, [customerId]);

  function addConversation(conversation: ConversationResponse) {
    setConversations((current) => [conversation, ...current]);
  }

  function clearConversations() {
    setConversations([]);
  }

  return {
    conversations,
    isLoading,
    error,
    addConversation,
    clearConversations,
  };
}
