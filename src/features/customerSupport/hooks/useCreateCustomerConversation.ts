import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomerConversation } from "@/features/customerSupport/api/customerSupport";

import { customerSupportQueryKeys as keys } from "../queryKeys";

type CreateCustomerConversationPayload = {
  customerId: string;
  subject: string;
  content: string;
};

export function useCreateCustomerConversation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      customerId,
      subject,
      content,
    }: CreateCustomerConversationPayload) =>
      createCustomerConversation(customerId, subject, content),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.customerConversations(variables.customerId),
      });
    },
  });

  return mutation;
}
