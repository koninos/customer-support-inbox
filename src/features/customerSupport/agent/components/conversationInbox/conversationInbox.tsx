"use client";

import { useState } from "react";

import { ConversationList } from "../conversationList/conversationList";
import { ConversationDetail } from "../conversationDetail/conversationDetail";

import { useConversations } from "@/features/customerSupport/hooks/useConversations";
import { useConversation } from "@/features/customerSupport/hooks/useConversation";
import styles from "./conversationInbox.module.scss";

export function ConversationInbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
  } = useConversations();

  const selectedId = selectedConversationId ?? conversations[0]?.id ?? null;

  const {
    conversation: selectedConversation,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useConversation(selectedId);

  if (isLoadingConversations) {
    return <p>Loading conversations...</p>;
  }

  if (conversationsError) {
    return <p>{conversationsError}</p>;
  }

  const shouldShowDetails =
    !isLoadingConversation && !conversationError && selectedConversation;

  return (
    <div className={styles.inbox}>
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedId}
        onSelectConversation={setSelectedConversationId}
      />

      {isLoadingConversation && <p>Loading conversation...</p>}

      {conversationError && <p>{conversationError}</p>}

      {shouldShowDetails && (
        <ConversationDetail conversation={selectedConversation} />
      )}
    </div>
  );
}
