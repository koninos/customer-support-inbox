"use client";

import { useState } from "react";

import { CustomerSelector } from "@/features/customers/components/customerSelector/customerSelector";
import { ConversationList } from "@/features/customers/components/conversationList/conversationList";
import { ConversationDetail } from "@/features/customers/components/conversationDetail/conversationDetail";
import { NewConversationForm } from "@/features/customers/components/newConversationForm/newConversationForm";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useCustomerConversations } from "@/features/conversations/hooks/useCustomerConversations";
import { useConversation } from "@/features/conversations/hooks/useConversation";
import styles from "./page.module.scss";

export default function CustomerPage() {
  const [customerId, setCustomerId] = useState("");

  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);

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

  const {
    conversation: selectedConversation,
    isLoading: isLoadingConversation,
    error: conversationError,
    addMessage,
  } = useConversation(selectedConversationId);

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

        <div className={styles.content}>
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

              {conversationError ? (
                <p role="alert">{conversationError}</p>
              ) : null}

              {!isCreatingConversation &&
              selectedConversation &&
              !conversationError ? (
                <>
                  <ConversationDetail
                    conversation={selectedConversation}
                    customerId={customerId}
                    isLoading={isLoadingConversation}
                    onMessageCreated={addMessage}
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
