
import { useQueryClient } from '@tanstack/react-query';
import { fetchImageByKey } from '@/services/images';
import { useNetworkAwareCacheConfig } from './useNetworkAwareCacheConfig';

/**
 * Hook for prefetching images
 */
export const usePrefetchImages = () => {
  const queryClient = useQueryClient();
  const { getCacheConfig } = useNetworkAwareCacheConfig();

  /**
   * Prefetch an image by key - useful before navigation
   */
  const prefetchImage = async (key: string, isPriority: boolean = false) => {
    const { staleTime } = getCacheConfig(isPriority);
    
    await queryClient.prefetchQuery({
      queryKey: ['image', key],
      queryFn: () => fetchImageByKey(key),
      staleTime,
    });
  };

  /**
   * Prefetch a batch of images by keys - useful for gallery views
   */
  const prefetchImages = async (keys: string[]) => {
    const promises = keys.map(key => prefetchImage(key, false));
    await Promise.all(promises);
  };

  return {
    prefetchImage,
    prefetchImages
  };
};
