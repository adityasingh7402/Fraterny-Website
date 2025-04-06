
import { useNetworkStatus } from '@/hooks/use-network-status';
import { getImagePlaceholdersByKey } from '@/services/images';

/**
 * Hook for handling image placeholder loading strategy
 */
export const usePlaceholderStrategy = () => {
  const network = useNetworkStatus();
  
  // Determine if we should prioritize placeholders on slow connections
  const shouldFetchPlaceholdersFirst = (): boolean => {
    return ['slow-2g', '2g'].includes(network.effectiveConnectionType);
  };
  
  // Fetch placeholders based on connection speed
  const fetchPlaceholders = async (dynamicKey: string, prioritizePlaceholders: boolean = false) => {
    if (prioritizePlaceholders) {
      return getImagePlaceholdersByKey(dynamicKey);
    }
    return { tinyPlaceholder: null, colorPlaceholder: null };
  };
  
  return {
    shouldFetchPlaceholdersFirst,
    fetchPlaceholders
  };
};
