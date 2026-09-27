import { useEffect, useState } from "react";

import {
  ConversationResponse,
  MessageResponse,
} from "@/features/customerSupport/types/api";
import { fetchConversation } from "../api/customerSupport";

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
    const controller = new AbortController();

    async function getConversation() {
      setIsLoading(true);
      setError(null);

      try {
        const data: ConversationResponse = await fetchConversation(
          selectedConversationId,
          controller.signal,
        );

        setConversation(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

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

    return () => {
      controller.abort();
    };
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
