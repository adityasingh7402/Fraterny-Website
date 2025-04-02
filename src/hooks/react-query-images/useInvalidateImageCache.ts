
import { useQueryClient } from '@tanstack/react-query';
import { 
  clearImageCache, 
  clearImageUrlCache 
} from '@/services/images';

/**
 * Hook for managing image cache invalidation
 */
export const useInvalidateImageCache = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate image cache to force refresh - coordinates React Query with imageCache
   */
  const invalidateImageCache = async (key?: string) => {
    if (key) {
      // Invalidate specific image
      await queryClient.invalidateQueries({ queryKey: ['image', key] });
      await queryClient.invalidateQueries({ queryKey: ['imageUrl', key] });
    } else {
      // Invalidate all images
      await queryClient.invalidateQueries({ queryKey: ['image'] });
      await queryClient.invalidateQueries({ queryKey: ['images'] });
      await queryClient.invalidateQueries({ queryKey: ['imageUrl'] });
      
      // Also clear the existing caches
      clearImageCache();
      clearImageUrlCache();
    }
  };

  return { invalidateImageCache };
};
