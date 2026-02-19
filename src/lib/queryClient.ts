import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // refetch after 1 minute
      gcTime: 5 * 60_000,
      retry: 1,
    },
  },
});
