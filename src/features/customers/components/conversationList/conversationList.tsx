import { ConversationListItemResponse } from "@/features/conversations/types/api";

import styles from "./conversationList.module.scss";

type ConversationListProps = {
  conversations: ConversationListItemResponse[];
  selectedConversationId: number | null;
  isLoading: boolean;
  onSelectConversation: (conversationId: number) => void;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  isLoading,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <section>
      <h2>My conversations</h2>

      {isLoading ? (
        <p>Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p>You do not have any conversations yet.</p>
      ) : (
        <ul className={styles.list}>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                className={styles.button}
                aria-pressed={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <span className={styles.subject}>{conversation.subject}</span>

                <span
                  className={`${styles.status} ${
                    conversation.status === "open"
                      ? styles.statusOpen
                      : styles.statusClosed
                  }`}
                >
                  {conversation.status}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
