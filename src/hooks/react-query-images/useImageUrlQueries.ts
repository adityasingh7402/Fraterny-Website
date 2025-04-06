
import { useQuery } from '@tanstack/react-query';
import { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize,
  getImageUrlBatched,
  batchGetImageUrls,
  isValidImageKey
} from '@/services/images';
import { useNetworkAwareCacheConfig } from './useNetworkAwareCacheConfig';
import { IMAGE_KEYS } from '@/pages/admin/images/components/upload/constants';

// Create a set of valid keys for fast lookup
const VALID_KEYS = new Set(IMAGE_KEYS.map(item => item.key));

/**
 * Enhanced validation function that checks against predefined keys
 */
const validateQueryKey = (key: string | undefined): boolean => {
  if (!key) {
    console.warn('Empty key provided to validateQueryKey');
    return false;
  }
  
  const isValid = isValidImageKey(key);
  if (!isValid) {
    console.warn(`Invalid or non-predefined key in validateQueryKey: "${key}"`);
  }
  
  return isValid;
};

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
    
    // Normalize and validate key for query key stability
    const normalizedKey = key?.trim();
    const isValidKey = normalizedKey ? validateQueryKey(normalizedKey) : false;
    
    return useQuery({
      queryKey: ['imageUrl', normalizedKey, size],
      queryFn: async () => {
        if (!normalizedKey) {
          console.error('[useImageUrl] Called without a key');
          return { url: '/placeholder.svg', key: null, size };
        }
        
        if (!isValidKey) {
          console.error(`[useImageUrl] Invalid or non-predefined key: "${normalizedKey}"`);
          return { url: '/placeholder.svg', key: normalizedKey, size };
        }
        
        try {
          console.log(`[useImageUrl] Fetching URL for key: "${normalizedKey}", size: ${size || 'original'}`);
          
          // Use batched version for better performance
          let url;
          if (size) {
            url = await getImageUrlByKeyAndSize(normalizedKey, size);
          } else {
            url = await getImageUrlBatched(normalizedKey);
          }
            
          console.log(`[useImageUrl] Successfully fetched URL for key "${normalizedKey}": ${url}`);
          return { url, key: normalizedKey, size };
        } catch (error) {
          console.error(`[useImageUrl] Error fetching URL for image "${normalizedKey}":`, error);
          return { url: '/placeholder.svg', key: normalizedKey, size };
        }
      },
      staleTime,
      gcTime,
      enabled: !!normalizedKey && isValidKey,
      // This prevents unnecessary refetches when the component remounts
      refetchOnMount: false,
    });
  };

  /**
   * Get URLs for multiple images in one batch
   */
  const useMultipleImageUrls = (keys: string[] | undefined, size?: 'small' | 'medium' | 'large') => {
    const { staleTime, gcTime } = getCacheConfig();
    
    // Filter out undefined/empty keys and validate against predefined list
    const validKeys = keys
      ?.filter(k => k && k.trim() !== '')
      ?.filter(k => validateQueryKey(k.trim()))
      ?.map(k => k.trim()) || [];
      
    // Log any invalid or non-predefined keys
    if (keys && keys.length !== validKeys.length) {
      const invalidKeys = keys.filter(k => k && !validateQueryKey(k.trim()));
      if (invalidKeys.length > 0) {
        console.warn('[useMultipleImageUrls] Filtering out invalid or non-predefined keys:', invalidKeys);
      }
    }
    
    // Create a stable query key by sorting
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
