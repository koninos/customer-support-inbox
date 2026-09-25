import { useEffect, useState } from "react";

import {
  ConversationResponse,
  MessageResponse,
} from "@/features/conversations/types/api";

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

    async function fetchConversation() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/conversations/${conversationId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch conversation.");
        }

        const data: ConversationResponse = await response.json();

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

    fetchConversation();
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
