
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * Hook for determining optimal loading strategies based on network conditions
 */
export const useNetworkLoadingStrategy = () => {
  const network = useNetworkStatus();
  
  // Calculate appropriate delay for image loading based on network conditions
  const getLoadingDelay = (): number => {
    if (!navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
      return 300; // Add delay for poor connections to avoid excessive requests
    }
    return 0;  // No delay for good connections
  };
  
  // Determine if we should use lower quality images on slow connections
  const shouldUseLowerQuality = (): boolean => {
    return network.saveDataEnabled || 
      ['slow-2g', '2g'].includes(network.effectiveConnectionType) ||
      (network.rtt !== null && network.rtt > 500);
  };
  
  return {
    getLoadingDelay,
    shouldUseLowerQuality
  };
};
