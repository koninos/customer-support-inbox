"use client";

import { SyntheticEvent, useState } from "react";

import { ConversationResponse } from "@/features/conversations/types/api";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          subject,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation.");
      }

      const conversation: ConversationResponse = await response.json();

      onConversationCreated(conversation);

      setSubject("");
      setContent("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create conversation.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="content">Message</label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
          />
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting || !subject.trim() || !content.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Conversation"}
          </button>
        </div>
      </form>
    </section>
  );
}
