
import { useImageQueries } from './useImageQueries';
import { useImageUrlQueries } from './useImageUrlQueries';
import { usePrefetchImages } from './usePrefetchImages';
import { useInvalidateImageCache } from './useInvalidateImageCache';

/**
 * Main hook that combines all image query functionality
 */
export const useReactQueryImages = () => {
  const { useImage, useMultipleImages, useImages, useImagesByCategory } = useImageQueries();
  const { useImageUrl, useMultipleImageUrls } = useImageUrlQueries();
  const { prefetchImage, prefetchImages } = usePrefetchImages();
  const { invalidateImageCache } = useInvalidateImageCache();
  
  return {
    // Image metadata queries
    useImage,
    useMultipleImages,
    useImages,
    useImagesByCategory,
    
    // Image URL queries
    useImageUrl,
    useMultipleImageUrls,
    
    // Prefetching
    prefetchImage,
    prefetchImages,
    
    // Cache invalidation
    invalidateImageCache,
  };
};

// Export the main hook
export * from './useNetworkAwareCacheConfig';
export * from './useImageQueries';
export * from './useImageUrlQueries';
export * from './usePrefetchImages';
export * from './useInvalidateImageCache';
