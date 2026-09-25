"use client";

import { useEffect, useState } from "react";

import { ConversationResponse } from "@/features/conversations/types/api";

import { CustomerSelector } from "@/features/customers/components/customerSelector/customerSelector";
import { ConversationList } from "@/features/customers/components/conversationList/conversationList";
import { ConversationDetail } from "@/features/customers/components/conversationDetail/conversationDetail";
import { NewConversationForm } from "@/features/customers/components/newConversationForm/newConversationForm";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useCustomerConversations } from "@/features/conversations/hooks/useCustomerConversations";
import styles from "./page.module.scss";

export default function CustomerPage() {
  const [customerId, setCustomerId] = useState("");

  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const {
    customers,
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useCustomers();

  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
    addConversation,
    clearConversations,
  } = useCustomerConversations(customerId);

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

  const startNewConversationButton = (
    <button
      type="button"
      className={styles.newConversationButton}
      onClick={() => setIsCreatingConversation(true)}
    >
      + Start New Conversation
    </button>
  );

  function handleCustomerChange(nextCustomerId: string) {
    clearConversations();
    setCustomerId(nextCustomerId);
    setSelectedConversationId(null);
    setIsCreatingConversation(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1>Customer Portal</h1>
          <p>View your conversations and contact support.</p>
        </header>

        <div className={styles.form}>
          {isLoadingCustomers ? <p>Loading customers...</p> : null}

          {customersError ? <p role="alert">{customersError}</p> : null}

          <CustomerSelector
            customers={customers}
            customerId={customerId}
            onCustomerChange={handleCustomerChange}
          />

          {customerId ? (
            <>
              {conversationsError ? (
                <p role="alert">{conversationsError}</p>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  isLoading={isLoadingConversations}
                  onSelectConversation={(conversationId) => {
                    setIsCreatingConversation(false);
                    setSelectedConversationId(conversationId);
                  }}
                />
              )}

              {!isCreatingConversation && selectedConversation ? (
                <>
                  <ConversationDetail
                    conversation={selectedConversation}
                    customerId={customerId}
                    isLoading={isLoadingConversation}
                    onMessageCreated={(message) => {
                      setSelectedConversation((current) =>
                        current
                          ? {
                              ...current,
                              messages: [...current.messages, message],
                            }
                          : current,
                      );
                    }}
                  />
                  {startNewConversationButton}
                </>
              ) : null}

              {!isCreatingConversation && !selectedConversation
                ? startNewConversationButton
                : null}

              {isCreatingConversation ? (
                <NewConversationForm
                  customerId={customerId}
                  onConversationCreated={(conversation) => {
                    addConversation(conversation);
                    setSelectedConversationId(conversation.id);
                    setSelectedConversation(conversation);
                    setIsCreatingConversation(false);
                  }}
                  onCancel={() => setIsCreatingConversation(false)}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
