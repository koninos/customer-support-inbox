import { useQuery } from "@tanstack/react-query";

import { fetchCustomers } from "../api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

export function useCustomers() {
  const query = useQuery({
    queryKey: keys.customers,
    queryFn: fetchCustomers,
  });

  return {
    customers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
