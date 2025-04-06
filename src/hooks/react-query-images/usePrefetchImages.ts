
import { useQueryClient } from '@tanstack/react-query';
import { getImageMetadata } from '@/services/images';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useCallback } from 'react';

/**
 * Hook to prefetch images into the React Query cache
 */
export const usePrefetchImages = () => {
  const queryClient = useQueryClient();
  const network = useNetworkStatus();

  /**
   * Prefetch a single image by key
   */
  const prefetchImage = useCallback(async (
    key: string,
    options: { priority?: 'high' | 'low'; staleTime?: number } = {}
  ): Promise<boolean> => {
    if (!key) return false;

    // On save-data mode, only prefetch high priority images
    if (network.saveDataEnabled && options.priority !== 'high') {
      return false;
    }

    // On 2G connections, only prefetch high priority images
    if (['slow-2g', '2g'].includes(network.effectiveConnectionType) && options.priority !== 'high') {
      return false;
    }

    try {
      // Prefetch into React Query cache
      await queryClient.prefetchQuery({
        queryKey: ['image', key],
        queryFn: () => getImageMetadata(key),
        staleTime: options.staleTime || 5 * 60 * 1000 // Default 5 minutes
      });
      return true;
    } catch (error) {
      console.error(`Failed to prefetch image "${key}":`, error);
      return false;
    }
  }, [queryClient, network.saveDataEnabled, network.effectiveConnectionType]);

  /**
   * Prefetch multiple images by keys
   */
  const prefetchImages = useCallback(async (
    keys: string[] | undefined,
    options: { priority?: 'high' | 'low'; staleTime?: number } = {}
  ): Promise<number> => {
    if (!keys || keys.length === 0) return 0;

    // On poor connections with data saver, be selective
    if (network.saveDataEnabled && options.priority !== 'high') {
      return 0;
    }

    // Filter out invalid or empty keys
    const validKeys = keys.filter(key => key && key.trim() !== '');
    
    if (validKeys.length === 0) return 0;

    try {
      // Prefetch each image (limit concurrency)
      const results = await Promise.all(
        validKeys.map(key => prefetchImage(key, options))
      );

      // Return count of successfully prefetched images
      return results.filter(Boolean).length;
    } catch (error) {
      console.error('Failed to prefetch multiple images:', error);
      return 0;
    }
  }, [prefetchImage, network.saveDataEnabled]);

  return {
    prefetchImage,
    prefetchImages
  };
};
