"use client";

import { useState } from "react";

import { ConversationList } from "../conversationList/conversationList";
import { ConversationDetail } from "../conversationDetail/conversationDetail";
import styles from "./conversationInbox.module.scss";
import { Conversation } from "../../types/conversation";

const conversations: Conversation[] = [
  {
    id: 1,
    subject: "Payment charged twice",
    customer: "John Doe",
    status: "open",
    messages: [
      {
        id: 1,
        sender: "John Doe",
        content: "I was charged twice for my subscription.",
        timestamp: "10:32 AM",
        type: "customer",
      },
      {
        id: 2,
        sender: "Support",
        content:
          "I'm sorry about that. I'll look into the duplicate charge for you.",
        timestamp: "10:35 AM",
        type: "agent",
      },
    ],
  },
  {
    id: 2,
    subject: "Unable to log in",
    customer: "Jane Smith",
    status: "open",
    messages: [
      {
        id: 1,
        sender: "Jane Smith",
        content: "I forgot my password",
        timestamp: "10:32 AM",
        type: "customer",
      },
    ],
  },
];

export function ConversationInbox() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  return (
    <div className={styles.inbox}>
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {selectedConversation && (
        <ConversationDetail conversation={selectedConversation} />
      )}
    </div>
  );
}
