"use client";

import { SyntheticEvent, useEffect, useState } from "react";

import {
  ConversationListItemResponse,
  ConversationResponse,
  CustomerResponse,
  MessageResponse,
} from "@/features/conversations/types/api";

import styles from "./page.module.scss";
import { CustomerSelector } from "./components/customerSelector/customerSelector";
import { ConversationList } from "./components/conversationList/conversationList";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customerId, setCustomerId] = useState("");

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [conversations, setConversations] = useState<
    ConversationListItemResponse[]
  >([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const [reply, setReply] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch("/api/customers");

      if (!response.ok) {
        throw new Error("Failed to fetch customers.");
      }

      const data: CustomerResponse[] = await response.json();

      setCustomers(data);
    }

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!customerId) {
      return;
    }

    async function fetchConversations() {
      setIsLoadingConversations(true);

      try {
        const response = await fetch(
          `/api/customers/${customerId}/conversations`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversations.");
        }

        const data: ConversationListItemResponse[] = await response.json();

        setConversations(data);
        setSelectedConversationId(data[0]?.id ?? null);
      } finally {
        setIsLoadingConversations(false);
      }
    }

    fetchConversations();
  }, [customerId]);

  useEffect(() => {
    if (selectedConversationId === null) {
      return;
    }

    async function fetchConversation() {
      setIsLoadingConversation(true);

      try {
        const response = await fetch(
          `/api/conversations/${selectedConversationId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversation.");
        }

        const data: ConversationResponse = await response.json();

        setSelectedConversation(data);
      } finally {
        setIsLoadingConversation(false);
      }
    }

    fetchConversation();
  }, [selectedConversationId]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess(false);
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

      setConversations((current) => [conversation, ...current]);
      setSelectedConversationId(conversation.id);
      setSelectedConversation(conversation);

      setSubject("");
      setContent("");
      setSuccess(true);
      setIsCreatingConversation(false);
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

  async function handleReplySubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedConversation) {
      return;
    }

    setIsSendingReply(true);
    setReplyError(null);

    try {
      const response = await fetch(
        `/api/customers/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: Number(customerId),
            content: reply,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send reply.");
      }

      const message: MessageResponse = await response.json();

      setSelectedConversation((current) =>
        current
          ? {
              ...current,
              messages: [...current.messages, message],
            }
          : current,
      );

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
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1>Customer Portal</h1>
          <p>View your conversations and contact support.</p>
        </header>

        <div className={styles.form}>
          <CustomerSelector
            customers={customers}
            customerId={customerId}
            onCustomerChange={setCustomerId}
          />

          {customerId ? (
            <>
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                isLoading={isLoadingConversations}
                onSelectConversation={(conversationId) => {
                  setIsCreatingConversation(false);
                  setSelectedConversationId(conversationId);
                }}
              />

              {!isCreatingConversation && selectedConversation ? (
                <section>
                  <h2>{selectedConversation.subject}</h2>

                  {isLoadingConversation ? (
                    <p>Loading conversation...</p>
                  ) : (
                    <>
                      <div>
                        {selectedConversation.messages.map((message) => (
                          <article key={message.id}>
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

                      <form onSubmit={handleReplySubmit}>
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

                  <button
                    type="button"
                    onClick={() => setIsCreatingConversation(true)}
                  >
                    + Start New Conversation
                  </button>
                </section>
              ) : null}

              {!isCreatingConversation && !selectedConversation ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingConversation(true)}
                >
                  + Start New Conversation
                </button>
              ) : null}

              {isCreatingConversation ? (
                <section>
                  <h2>Start a new conversation</h2>

                  <form className={styles.form} onSubmit={handleSubmit}>
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

                    {success ? (
                      <p className={styles.success} role="status">
                        Conversation created successfully.
                      </p>
                    ) : null}

                    {error ? (
                      <p className={styles.error} role="alert">
                        {error}
                      </p>
                    ) : null}

                    <div>
                      <button
                        type="button"
                        onClick={() => setIsCreatingConversation(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className={styles.submit}
                        disabled={
                          isSubmitting || !subject.trim() || !content.trim()
                        }
                      >
                        {isSubmitting ? "Creating..." : "Create Conversation"}
                      </button>
                    </div>
                  </form>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
