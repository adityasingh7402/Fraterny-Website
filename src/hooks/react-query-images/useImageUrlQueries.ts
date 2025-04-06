
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
        if (!key) {
          console.error('[useImageUrl] Called without a key');
          return null;
        }
        
        try {
          console.log(`[useImageUrl] Fetching URL for key: "${key}", size: ${size || 'original'}`);
          // Use batched version for better performance
          const url = size 
            ? await getImageUrlByKeyAndSize(key, size)
            : await getImageUrlBatched(key);
            
          console.log(`[useImageUrl] Successfully fetched URL for key "${key}": ${url}`);
          return { url, key, size };
        } catch (error) {
          console.error(`[useImageUrl] Error fetching URL for image "${key}":`, error);
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
        if (!keys || keys.length === 0) {
          console.log('[useMultipleImageUrls] Called without keys');
          return {};
        }
        
        console.log(`[useMultipleImageUrls] Fetching URLs for ${keys.length} keys: ${keys.join(', ')}`);
        
        // Use the batch function directly
        const urls: Record<string, string> = {};
        
        // Process in batches of 10 to avoid overwhelming the system
        for (let i = 0; i < keys.length; i += 10) {
          const batch = keys.slice(i, i + 10);
          console.log(`[useMultipleImageUrls] Processing batch ${Math.floor(i/10) + 1}:`, batch);
          
          // For each key in the batch, get the URL (with or without size)
          const batchPromises = batch.map(key => {
            console.log(`[useMultipleImageUrls] Getting URL for key: "${key}"`);
            return size ? getImageUrlByKeyAndSize(key, size) : getImageUrlBatched(key);
          });
          
          try {
            const batchResults = await Promise.all(batchPromises);
            
            // Add batch results to the url map
            batch.forEach((key, index) => {
              const url = batchResults[index] || '/placeholder.svg';
              console.log(`[useMultipleImageUrls] Got URL for key "${key}": ${url}`);
              urls[key] = url;
            });
          } catch (error) {
            console.error(`[useMultipleImageUrls] Error fetching batch:`, error);
            
            // Set placeholder URLs for any failed batch
            batch.forEach(key => {
              console.log(`[useMultipleImageUrls] Setting placeholder for key "${key}" due to batch error`);
              urls[key] = '/placeholder.svg';
            });
          }
        }
        
        console.log(`[useMultipleImageUrls] Finished fetching all URLs:`, urls);
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
