
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setQueryClient } from '@/services/cache/cacheCoordinator';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provides React Query context to the application
 */
const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  // Register query client with cache coordinator
  useEffect(() => {
    setQueryClient(queryClient);
    return () => setQueryClient(null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
