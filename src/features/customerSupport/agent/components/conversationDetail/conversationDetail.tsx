import { SyntheticEvent, useState } from "react";

import { Conversation } from "@/features/customerSupport/types/ui";
import { useSendAgentMessage } from "@/features/customerSupport/hooks/useSendAgentMessage";
import styles from "./conversationDetail.module.scss";

type ConversationDetailProps = {
  conversation: Conversation;
};

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const sendMessageMutation = useSendAgentMessage();

  const isSending = sendMessageMutation.isPending;

  const error =
    sendMessageMutation.error instanceof Error
      ? sendMessageMutation.error.message
      : null;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!replyMessage.trim()) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      content: replyMessage,
    });

    setReplyMessage("");
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
