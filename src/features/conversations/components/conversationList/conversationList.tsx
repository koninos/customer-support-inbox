import styles from "./conversationList.module.scss";

const conversations = [
  {
    id: 1,
    subject: "Payment charged twice",
    customer: "John Doe",
    status: "open",
  },
  {
    id: 2,
    subject: "Unable to log in",
    customer: "Jane Smith",
    status: "open",
  },
  {
    id: 3,
    subject: "Refund request",
    customer: "Bob Johnson",
    status: "closed",
  },
];

export function ConversationList() {
  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Conversations</h2>

      <ul className={styles.list}>
        {conversations.map((conversation) => (
          <li key={conversation.id} className={styles.item}>
            <button type="button" className={styles.button}>
              <span className={styles.subject}>{conversation.subject}</span>
              <span className={styles.customer}>{conversation.customer}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
