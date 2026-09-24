import { FormEvent, useState } from "react";
import { Conversation, Message } from "../../types/ui";
import styles from "./conversationDetail.module.scss";

type ConversationDetailProps = {
  conversation: Conversation;
  onMessageCreated: (message: Message) => void;
};

export function ConversationDetail({
  conversation,
  onMessageCreated,
}: ConversationDetailProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!replyMessage.trim()) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyMessage,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      const message: Message = await response.json();

      onMessageCreated(message);
      setReplyMessage("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setIsSending(false);
    }
  }

  const isDisabled = isSending || !replyMessage.trim();

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

      <form className={styles.replyForm} onSubmit={handleSubmit}>
        <label htmlFor="reply">Reply</label>

        <textarea
          id="reply"
          name="reply"
          value={replyMessage}
          onChange={(event) => setReplyMessage(event.target.value)}
          placeholder="Write a reply..."
          rows={4}
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isDisabled}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
