"use client";

import { useEffect, useState } from "react";

import { ConversationList } from "../conversationList/conversationList";
import { ConversationDetail } from "../conversationDetail/conversationDetail";
import { Conversation, ConversationListItem } from "../../types/conversation";
import styles from "./conversationInbox.module.scss";

export function ConversationInbox() {
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    [],
  );

  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [isConversationLoading, setIsConversationLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Unable to load conversations.");
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId === null) {
      return;
    }

    async function loadConversation() {
      try {
        setIsConversationLoading(true);

        const response = await fetch(
          `/api/conversations/${selectedConversationId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load conversation.");
        }

        const data: Conversation = await response.json();

        setSelectedConversation(data);
      } catch {
        setError("Unable to load conversation.");
      } finally {
        setIsConversationLoading(false);
      }
    }

    loadConversation();
  }, [selectedConversationId]);

  if (isLoading) {
    return <p>Loading conversations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.inbox}>
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {isConversationLoading ? (
        <p>Loading conversation...</p>
      ) : (
        selectedConversation && (
          <ConversationDetail conversation={selectedConversation} />
        )
      )}
    </div>
  );
}
