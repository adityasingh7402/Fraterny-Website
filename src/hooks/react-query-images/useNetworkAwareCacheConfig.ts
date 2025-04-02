import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * Hook to get cache configuration based on network conditions
 */
export const useNetworkAwareCacheConfig = () => {
  const network = useNetworkStatus();
  
  /**
   * Dynamically set cache times based on network conditions
   */
  const getCacheConfig = (isPriority: boolean = false) => {
    // For critical images, use shorter stale time to ensure freshness
    if (isPriority) {
      return {
        staleTime: 2 * 60 * 1000,  // 2 minutes
        gcTime: 5 * 60 * 1000,     // 5 minutes
      };
    }
    
    // On slow connections, keep cache longer to reduce network requests
    if (['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)) {
      return {
        staleTime: 15 * 60 * 1000, // 15 minutes
        gcTime: 30 * 60 * 1000,    // 30 minutes
      };
    }
    
    // Default times for good connections
    return {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
    };
  };

  return { getCacheConfig };
};
