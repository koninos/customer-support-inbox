import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendCustomerMessage } from "@/features/customerSupport/api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

type CustomerMessagePayload = {
  conversationId: number;
  customerId: number;
  content: string;
};

export function useSendCustomerMessage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      conversationId,
      customerId,
      content,
    }: CustomerMessagePayload) =>
      sendCustomerMessage(conversationId, customerId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.conversation(variables.conversationId),
      });
    },
  });

  return mutation;
}
