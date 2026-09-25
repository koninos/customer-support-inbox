import { useEffect, useState } from "react";

import { CustomerResponse } from "@/features/conversations/types/api";

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers");

        if (!response.ok) {
          throw new Error("Failed to fetch customers.");
        }

        const data: CustomerResponse[] = await response.json();

        setCustomers(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch customers.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return {
    customers,
    isLoading,
    error,
  };
}
