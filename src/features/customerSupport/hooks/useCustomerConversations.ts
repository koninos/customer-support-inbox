import { useQuery } from "@tanstack/react-query";

import { fetchCustomerConversations } from "../api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

export function useCustomerConversations(customerId: string) {
  const query = useQuery({
    queryKey: keys.customerConversations(customerId),
    queryFn: ({ signal }) => fetchCustomerConversations(customerId, signal),
    enabled: Boolean(customerId),
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
