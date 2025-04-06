
import { useQuery } from '@tanstack/react-query';
import { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize,
  getImageUrlBatched
} from '@/services/images';
import { useNetworkAwareCacheConfig } from './useNetworkAwareCacheConfig';

/**
 * Hooks for fetching image URLs
 */
export const useImageUrlQueries = () => {
  const { getCacheConfig } = useNetworkAwareCacheConfig();

  /**
   * Optimized URL retrieval that leverages both React Query and the existing URL cache
   */
  const useImageUrl = (key: string | undefined, size?: 'small' | 'medium' | 'large') => {
    const { staleTime, gcTime } = getCacheConfig();
    
    return useQuery({
      queryKey: ['imageUrl', key, size],
      queryFn: async () => {
        if (!key) return null;
        
        try {
          console.log(`[useImageUrl] Fetching URL for key: ${key}, size: ${size || 'original'}`);
          // Use batched version for better performance
          const url = size 
            ? await getImageUrlByKeyAndSize(key, size)
            : await getImageUrlBatched(key);
            
          return { url, key, size };
        } catch (error) {
          console.error(`Error fetching URL for image ${key}:`, error);
          return { url: '/placeholder.svg', key, size };
        }
      },
      staleTime,
      gcTime,
      enabled: !!key,
      // This prevents unnecessary refetches when the component remounts
      refetchOnMount: false,
    });
  };

  /**
   * Get URLs for multiple images in one batch
   */
  const useMultipleImageUrls = (keys: string[] | undefined, size?: 'small' | 'medium' | 'large') => {
    const { staleTime, gcTime } = getCacheConfig();
    
    // Create a unique, stable key for caching
    const stableQueryKey = keys?.slice().sort().join(',') || '';
    
    return useQuery({
      queryKey: ['imageUrls', 'batch', stableQueryKey, size],
      queryFn: async () => {
        if (!keys || keys.length === 0) return {};
        
        // Use the batch function directly
        const urls: Record<string, string> = {};
        
        // Process in batches of 10 to avoid overwhelming the system
        for (let i = 0; i < keys.length; i += 10) {
          const batch = keys.slice(i, i + 10);
          
          // For each key in the batch, get the URL (with or without size)
          const batchResults = await Promise.all(
            batch.map(key => 
              size ? getImageUrlByKeyAndSize(key, size) : getImageUrlBatched(key)
            )
          );
          
          // Add batch results to the url map
          batch.forEach((key, index) => {
            urls[key] = batchResults[index] || '/placeholder.svg';
          });
        }
        
        return urls;
      },
      staleTime,
      gcTime,
      enabled: !!keys && keys.length > 0,
    });
  };

  return {
    useImageUrl,
    useMultipleImageUrls
  };
};
