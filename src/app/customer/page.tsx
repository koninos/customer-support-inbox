"use client";

import { SyntheticEvent, useEffect, useState } from "react";

import { CustomerResponse } from "@/features/conversations/types/api";
import styles from "./page.module.scss";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      await response.json();

      setSuccess(true);
      setCustomerId("");
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
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1>Contact Support</h1>
          <p>Send a message to our support team.</p>
        </header>

        {success && (
          <p className={styles.success} role="status">
            Your message has been sent successfully.
          </p>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {"error"}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="customer">Simulated customer</label>

            <select
              id="customer"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="">Select a customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="subject">Subject</label>

            <input
              id="subject"
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

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}
