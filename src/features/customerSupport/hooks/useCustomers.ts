import { useEffect, useState } from "react";

import { CustomerResponse } from "@/features/customerSupport/types/api";
import { fetchCustomers } from "../api/customerSupport";

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCustomers() {
      try {
        const data: CustomerResponse[] = await fetchCustomers();

        setCustomers(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch customers.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    getCustomers();
  }, []);

  return {
    customers,
    isLoading,
    error,
  };
}
