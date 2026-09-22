import styles from "./conversationDetail.module.scss";

const messages = [
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
];

export function ConversationDetail() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>Payment charged twice</h1>
        <p>John Doe</p>
      </header>

      <div className={styles.messages}>
        {messages.map((message) => (
          <article
            key={message.id}
            className={`${styles.message} ${
              message.type === "agent"
                ? styles.messageAgent
                : styles.messageCustomer
            }`}
          >
            <div className={styles.messageHeader}>
              <strong>{message.sender}</strong>
              <time>{message.timestamp}</time>
            </div>

            <p>{message.content}</p>
          </article>
        ))}
      </div>

      <form className={styles.replyForm}>
        <label htmlFor="reply">Reply</label>

        <textarea
          id="reply"
          name="reply"
          placeholder="Write a reply..."
          rows={4}
        />

        <button type="submit">Send</button>
      </form>
    </section>
  );
}
