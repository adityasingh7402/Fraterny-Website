
import { useQueryClient } from '@tanstack/react-query';
import { 
  clearImageCache, 
  clearImageUrlCache 
} from '@/services/images';
import { cacheCoordinator } from '@/services/cache/cacheCoordinator';
import { dispatchCacheEvent } from '@/hooks/useCacheEvents';

/**
 * Hook for managing image cache invalidation
 */
export const useInvalidateImageCache = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate image cache to force refresh - coordinates all cache layers
   */
  const invalidateImageCache = async (key?: string) => {
    if (key) {
      // Invalidate specific image using the cache coordinator
      await cacheCoordinator.invalidateImage(key);
      
      // Also dispatch an event for any listeners
      dispatchCacheEvent({
        type: 'invalidate',
        key,
        scope: 'key',
        timestamp: Date.now()
      });
    } else {
      // Invalidate all images
      await cacheCoordinator.invalidateAll();
      
      // Dispatch a global invalidation event
      dispatchCacheEvent({
        type: 'clear',
        scope: 'global',
        timestamp: Date.now()
      });
    }
  };

  return { invalidateImageCache };
};
