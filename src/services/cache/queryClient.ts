
/**
 * React Query client management for cache coordinator
 */

import { QueryClient } from '@tanstack/react-query';

// Singleton instance of the query client
let queryClientInstance: QueryClient | null = null;

/**
 * Set the Query Client instance to be used by the coordinator
 */
export const setQueryClient = (queryClient: QueryClient) => {
  queryClientInstance = queryClient;
};

/**
 * Get the current Query Client instance
 */
export const getQueryClient = (): QueryClient | null => {
  return queryClientInstance;
};

/**
 * Check if React Query is available
 */
export const isReactQueryAvailable = (): boolean => {
  return !!queryClientInstance;
};
