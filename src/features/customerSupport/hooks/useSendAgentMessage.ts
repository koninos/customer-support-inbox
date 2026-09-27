import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendAgentMessage } from "@/features/customerSupport/api/customerSupport";
import { customerSupportQueryKeys as keys } from "../queryKeys";

type AgentMessagePayload = {
  conversationId: number;
  content: string;
};

export function useSendAgentMessage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ conversationId, content }: AgentMessagePayload) =>
      sendAgentMessage(conversationId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: keys.conversation(variables.conversationId),
      });
    },
  });

  return mutation;
}
