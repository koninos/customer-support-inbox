import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/features/customerSupport/api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

export function useConversations() {
  const query = useQuery({
    queryKey: keys.conversations,
    queryFn: fetchConversations,
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
