
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchImageByKey,
  fetchAllImages, 
  fetchImagesByCategory,
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getImageUrlBatched,
  WebsiteImage,
  clearImageCache,
  clearImageUrlCache
} from '@/services/images';
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * Custom hook for integrating React Query with the existing image cache system
 */
export const useReactQueryImages = () => {
  const queryClient = useQueryClient();
  const network = useNetworkStatus();
  
  /**
   * Dynamically set cache times based on network conditions
   */
  const getCacheConfig = (isPriority: boolean = false) => {
    // For critical images, use shorter stale time to ensure freshness
    if (isPriority) {
      return {
        staleTime: 2 * 60 * 1000,  // 2 minutes
        gcTime: 5 * 60 * 1000,     // 5 minutes
      };
    }
    
    // On slow connections, keep cache longer to reduce network requests
    if (['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)) {
      return {
        staleTime: 15 * 60 * 1000, // 15 minutes
        gcTime: 30 * 60 * 1000,    // 30 minutes
      };
    }
    
    // Default times for good connections
    return {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
    };
  };

  /**
   * Fetch an image by key
   */
  const useImage = (key: string | undefined, isPriority: boolean = false) => {
    const { staleTime, gcTime } = getCacheConfig(isPriority);
    
    return useQuery({
      queryKey: ['image', key],
      queryFn: () => (key ? fetchImageByKey(key) : Promise.reject('No image key provided')),
      staleTime,
      gcTime,
      enabled: !!key,
    });
  };

  /**
   * Fetch multiple images by keys in a single query
   */
  const useMultipleImages = (keys: string[] | undefined) => {
    const { staleTime, gcTime } = getCacheConfig();
    
    // Create a unique, stable key for caching that's sorted to avoid duplicates
    const stableQueryKey = keys?.slice().sort().join(',') || '';
    
    return useQuery({
      queryKey: ['images', 'batch', stableQueryKey],
      queryFn: async () => {
        if (!keys || keys.length === 0) return [];
        
        // Use Promise.all with fetchImageByKey for batch efficiency
        // Supabase will automatically batch these requests if they're close enough together
        const images = await Promise.all(
          keys.map(key => fetchImageByKey(key))
        );
        
        return images.filter(img => img !== null) as WebsiteImage[];
      },
      staleTime,
      gcTime,
      enabled: !!keys && keys.length > 0,
    });
  };

  /**
   * Fetch all images with pagination and search
   */
  const useImages = (
    page: number = 1, 
    pageSize: number = 20,
    searchTerm?: string
  ) => {
    const { staleTime, gcTime } = getCacheConfig();
    
    return useQuery({
      queryKey: ['images', page, pageSize, searchTerm],
      queryFn: () => fetchAllImages(page, pageSize, searchTerm),
      staleTime,
      gcTime,
    });
  };

  /**
   * Fetch images by category with pagination and search
   */
  const useImagesByCategory = (
    category: string | null,
    page: number = 1, 
    pageSize: number = 20,
    searchTerm?: string
  ) => {
    const { staleTime, gcTime } = getCacheConfig();
    
    return useQuery({
      queryKey: ['images', 'category', category, page, pageSize, searchTerm],
      queryFn: () => category 
        ? fetchImagesByCategory(category, page, pageSize, searchTerm)
        : fetchAllImages(page, pageSize, searchTerm),
      staleTime,
      gcTime,
      enabled: category !== undefined,
    });
  };

  /**
   * Optimized URL retrieval that leverages both React Query and the existing URL cache
   * This combines metadata from React Query with fast URL responses from your cache
   */
  const useImageUrl = (key: string | undefined, size?: 'small' | 'medium' | 'large') => {
    const { staleTime, gcTime } = getCacheConfig();
    
    return useQuery({
      queryKey: ['imageUrl', key, size],
      queryFn: async () => {
        if (!key) return null;
        
        try {
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

  return {
    useImage,
    useImages,
    useImagesByCategory,
    useImageUrl,
    useMultipleImages,
    useMultipleImageUrls,
    prefetchImage,
    prefetchImages,
    invalidateImageCache,
  };
};
