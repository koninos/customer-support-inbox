import { SyntheticEvent, useState } from "react";

import {
  ConversationResponse,
  MessageResponse,
} from "@/features/customerSupport/types/api";

import styles from "./conversationDetail.module.scss";
import { sendCustomerMessage } from "@/features/customerSupport/api/customerSupport";

type ConversationDetailProps = {
  conversation: ConversationResponse;
  customerId: string;
  isLoading: boolean;
  onMessageCreated: (message: MessageResponse) => void;
};
export function ConversationDetail({
  conversation,
  customerId,
  isLoading,
  onMessageCreated,
}: ConversationDetailProps) {
  const [reply, setReply] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reply.trim()) {
      return;
    }

    setIsSendingReply(true);
    setReplyError(null);

    try {
      const message: MessageResponse = await sendCustomerMessage(
        conversation.id,
        Number(customerId),
        reply,
      );

      onMessageCreated(message);
      setReply("");
    } catch (error) {
      setReplyError(
        error instanceof Error ? error.message : "Failed to send reply.",
      );
    } finally {
      setIsSendingReply(false);
    }
  }

  return (
    <section>
      <h2>{conversation.subject}</h2>

      {isLoading ? (
        <p>Loading conversation...</p>
      ) : (
        <>
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

            {replyError ? (
              <p className={styles.error} role="alert">
                {replyError}
              </p>
            ) : null}

            <button
              type="submit"
              className={styles.submit}
              disabled={isSendingReply || !reply.trim()}
            >
              {isSendingReply ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
