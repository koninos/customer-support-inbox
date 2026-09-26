import { CustomerResponse } from "@/features/conversations/types/api";

const customersApiBaseUrl = "/api/customers";

export async function fetchCustomers(): Promise<CustomerResponse[]> {
  const response = await fetch(`${customersApiBaseUrl}`);

  if (!response.ok) {
    throw new Error("Failed to fetch customers.");
  }

  return response.json();
}
