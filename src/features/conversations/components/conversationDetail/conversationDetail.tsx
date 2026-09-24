import { Conversation } from "../../types/ui";
import styles from "./conversationDetail.module.scss";

type ConversationDetailProps = {
  conversation: Conversation;
};

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>{conversation.subject}</h1>
        <p>{conversation.customer}</p>
      </header>

      <div className={styles.messages}>
        {conversation.messages.map(
          ({ id, type, sender, createdAt, content }) => {
            const messageTime = new Date(createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <article
                key={id}
                className={`${styles.message} ${
                  type === "agent"
                    ? styles.messageAgent
                    : styles.messageCustomer
                }`}
              >
                <div className={styles.messageHeader}>
                  <strong>{sender}</strong>
                  <time dateTime={createdAt}>{messageTime}</time>
                </div>

                <p>{content}</p>
              </article>
            );
          },
        )}
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
