
import { useQuery } from '@tanstack/react-query';
import { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize,
  getImageUrlBatchedOptimized
} from '@/services/images';
import { useNetworkAwareCacheConfig } from './useNetworkAwareCacheConfig';

/**
 * Hooks for fetching image URLs with React Query
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
          return { url: '/placeholder.svg', key: null, size };
        }
        
        try {
          console.log(`[useImageUrl] Fetching URL for key: "${key}", size: ${size || 'original'}`);
          
          // Use optimized batched version for better performance
          let url;
          if (size) {
            url = await getImageUrlByKeyAndSize(key, size);
          } else {
            url = await getImageUrlBatchedOptimized(key);
          }
            
          console.log(`[useImageUrl] Successfully fetched URL for key "${key}": ${url}`);
          return { url, key, size };
        } catch (error) {
          console.error(`[useImageUrl] Error fetching URL for image "${key}":`, error);
          return { url: '/placeholder.svg', key, size };
        }
      },
      staleTime,
      gcTime,
      enabled: !!key && key.trim() !== '',
      // This prevents unnecessary refetches when the component remounts
      refetchOnMount: false,
    });
  };

  /**
   * Get URLs for multiple images in one batch
   */
  const useMultipleImageUrls = (keys: string[] | undefined, size?: 'small' | 'medium' | 'large') => {
    const { staleTime, gcTime } = getCacheConfig();
    
    // Filter out undefined/empty keys and create a stable query key
    const validKeys = keys?.filter(k => k && k.trim() !== '') || [];
    const stableQueryKey = validKeys.slice().sort().join(',');
    
    return useQuery({
      queryKey: ['imageUrls', 'batch', stableQueryKey, size],
      queryFn: async () => {
        if (validKeys.length === 0) {
          console.log('[useMultipleImageUrls] No valid keys provided');
          return {};
        }
        
        console.log(`[useMultipleImageUrls] Fetching URLs for ${validKeys.length} keys`);
        
        // Use the batch function directly if no size is specified
        if (!size) {
          try {
            return await batchGetImageUrls(validKeys);
          } catch (error) {
            console.error('[useMultipleImageUrls] Batch error:', error);
            // Return placeholders on error
            return validKeys.reduce((acc, key) => {
              acc[key] = '/placeholder.svg';
              return acc;
            }, {} as Record<string, string>);
          }
        }
        
        // If size is specified, we need to use single requests
        const urls: Record<string, string> = {};
        
        // Process in batches of 10 to avoid overwhelming the system
        for (let i = 0; i < validKeys.length; i += 10) {
          const batch = validKeys.slice(i, i + 10);
          console.log(`[useMultipleImageUrls] Processing batch ${Math.floor(i/10) + 1}:`, batch);
          
          // For each key in the batch, get the URL with size
          const batchPromises = batch.map(key => 
            getImageUrlByKeyAndSize(key, size).catch(() => '/placeholder.svg')
          );
          
          try {
            const batchResults = await Promise.all(batchPromises);
            
            // Add batch results to the url map
            batch.forEach((key, index) => {
              const url = batchResults[index] || '/placeholder.svg';
              urls[key] = url;
            });
          } catch (error) {
            console.error(`[useMultipleImageUrls] Error fetching batch:`, error);
            
            // Set placeholder URLs for any failed batch
            batch.forEach(key => {
              urls[key] = '/placeholder.svg';
            });
          }
        }
        
        return urls;
      },
      staleTime,
      gcTime,
      enabled: validKeys.length > 0,
    });
  };

  return {
    useImageUrl,
    useMultipleImageUrls
  };
};
