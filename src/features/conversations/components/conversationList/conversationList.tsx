import { ConversationSummary } from "../../types/conversation";
import styles from "./conversationList.module.scss";

type ConversationListProps = {
  conversations: ConversationSummary[];
  selectedConversationId: number;
  onSelectConversation: (id: number) => void;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Conversations</h2>

      <ul className={styles.list}>
        {conversations.map((conversation) => (
          <li key={conversation.id} className={styles.item}>
            <button
              type="button"
              className={styles.button}
              onClick={() => onSelectConversation(conversation.id)}
              aria-pressed={conversation.id === selectedConversationId}
            >
              <span className={styles.subject}>{conversation.subject}</span>

              <span className={styles.customer}>{conversation.customer}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
