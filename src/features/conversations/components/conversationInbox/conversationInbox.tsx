"use client";

import { useEffect, useState } from "react";

import { ConversationList } from "../conversationList/conversationList";
import { ConversationDetail } from "../conversationDetail/conversationDetail";
import { Conversation, ConversationListItem } from "../../types/conversation";
import styles from "./conversationInbox.module.scss";

type Errors = {
  conversationsList: string | null;
  conversation: string | null;
};

type LoadingState = {
  conversationsList: boolean;
  conversation: boolean;
};

export function ConversationInbox() {
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    [],
  );

  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    conversationsList: true,
    conversation: false,
  });

  const [errors, setErrors] = useState<Errors>({
    conversationsList: null,
    conversation: null,
  });

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch("api/conversations");

        if (!response.ok) {
          throw new Error("Failed to load conversations.");
        }

        const data: ConversationListItem[] = await response.json();

        setConversations(data);

        if (data.length > 0) {
          setSelectedConversationId(data[0].id);
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          conversationsList: "Unable to load conversations.",
        }));
      } finally {
        setLoading((prev) => ({
          ...prev,
          conversationsList: false,
        }));
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId === null) {
      return;
    }

    const controller = new AbortController();

    async function loadConversation() {
      setLoading((prev) => ({
        ...prev,
        conversation: true,
      }));
      setErrors((prev) => ({
        ...prev,
        conversation: null,
      }));

      try {
        const response = await fetch(
          `/api/conversations/${selectedConversationId}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load conversation.");
        }

        const data: Conversation = await response.json();

        setSelectedConversation(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrors((prev) => ({
          ...prev,
          conversation: "Unable to load conversation.",
        }));
      } finally {
        setLoading((prev) => ({
          ...prev,
          conversation: false,
        }));
      }
    }

    loadConversation();

    return () => {
      controller.abort();
    };
  }, [selectedConversationId]);

  if (loading.conversationsList) {
    return <p>Loading conversations...</p>;
  }

  if (errors.conversationsList) {
    return <p>{errors.conversationsList}</p>;
  }

  const shouldShowDetails =
    !loading.conversation && !errors.conversation && selectedConversation;

  return (
    <div className={styles.inbox}>
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {loading.conversation && <p>Loading conversation...</p>}

      {errors.conversation && <p>{errors.conversation}</p>}

      {shouldShowDetails && (
        <ConversationDetail conversation={selectedConversation} />
      )}
    </div>
  );
}
