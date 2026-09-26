import { useEffect, useState } from "react";

import {
  ConversationResponse,
  MessageResponse,
} from "@/features/conversations/types/api";
import { fetchConversation } from "../api/conversations";

export function useConversation(conversationId: number | null) {
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId === null) {
      return;
    }

    const selectedConversationId = conversationId;

    async function getConversation() {
      setIsLoading(true);
      setError(null);

      try {
        const data: ConversationResponse = await fetchConversation(
          selectedConversationId,
        );

        setConversation(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    getConversation();
  }, [conversationId]);

  function addMessage(message: MessageResponse) {
    setConversation((current) =>
      current
        ? {
            ...current,
            messages: [...current.messages, message],
          }
        : current,
    );
  }

  const selectedConversation =
    conversation?.id === conversationId ? conversation : null;

  return {
    conversation: selectedConversation,
    isLoading,
    error,
    addMessage,
  };
}
