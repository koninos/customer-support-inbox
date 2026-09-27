"use client";

import { SyntheticEvent, useState } from "react";

import { ConversationResponse } from "@/features/customerSupport/types/api";

import { useCreateCustomerConversation } from "@/features/customerSupport/hooks/useCreateCustomerConversation";
import styles from "./newConversationForm.module.scss";

type NewConversationFormProps = {
  customerId: string;
  onConversationCreated: (conversation: ConversationResponse) => void;
  onCancel: () => void;
};

export function NewConversationForm({
  customerId,
  onConversationCreated,
  onCancel,
}: NewConversationFormProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const createConversationMutation = useCreateCustomerConversation();
  const isCreating = createConversationMutation.isPending;
  const error =
    createConversationMutation.error instanceof Error
      ? createConversationMutation.error.message
      : null;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subject.trim() || !content.trim()) {
      return;
    }
    const conversation = await createConversationMutation.mutateAsync({
      customerId,
      subject,
      content,
    });

    setSubject("");
    setContent("");
    onConversationCreated(conversation);
  }

  return (
    <section>
      <h2>Start a new conversation</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="subject">Subject</label>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            disabled={isCreating}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="content">Message</label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
            disabled={isCreating}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            disabled={isCreating}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submit}
            disabled={isCreating || !subject.trim() || !content.trim()}
          >
            {isCreating ? "Creating..." : "Create Conversation"}
          </button>
        </div>
      </form>
    </section>
  );
}
