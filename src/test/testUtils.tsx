import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TestQueryProviderProps = {
  children: React.ReactNode;
};

export function TestQueryProvider({ children }: TestQueryProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
