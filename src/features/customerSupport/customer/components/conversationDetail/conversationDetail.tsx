import { SyntheticEvent, useState } from "react";

import { useSendCustomerMessage } from "@/features/customerSupport/hooks/useSendCustomerMessage";
import { Conversation } from "@/features/customerSupport/types/ui";
import styles from "./conversationDetail.module.scss";

type ConversationDetailProps = {
  conversation: Conversation;
  customerId: number;
};
export function ConversationDetail({
  conversation,
  customerId,
}: ConversationDetailProps) {
  const [reply, setReply] = useState("");
  const sendMessageMutation = useSendCustomerMessage();

  const isSending = sendMessageMutation.isPending;
  const error =
    sendMessageMutation.error instanceof Error
      ? sendMessageMutation.error.message
      : null;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reply.trim()) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      customerId,
      content: reply,
    });

    setReply("");
  }

  return (
    <section>
      <h2>{conversation.subject}</h2>

      <div className={styles.messages}>
        {conversation.messages.map((message) => (
          <article key={message.id} className={styles.message}>
            <p>
              <strong>{message.sender}</strong>
            </p>

            <p>{message.content}</p>

            <time dateTime={message.createdAt}>
              {new Date(message.createdAt).toLocaleString()}
            </time>
          </article>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="reply">Reply</label>

          <textarea
            id="reply"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            rows={4}
          />
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className={styles.submit}
          disabled={isSending || !reply.trim()}
        >
          {isSending ? "Sending..." : "Send Reply"}
        </button>
      </form>
    </section>
  );
}
