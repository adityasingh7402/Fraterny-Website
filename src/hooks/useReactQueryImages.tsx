import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchImageByKey,
  fetchAllImages, 
  fetchImagesByCategory,
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getImageUrlsByKeys,
  WebsiteImage,
  clearImageCache,
  clearImageUrlCache,
  urlCache
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
          const url = size 
            ? await getImageUrlByKeyAndSize(key, size)
            : await getImageUrlByKey(key);
            
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
    try {
      // Use batch operation to fetch URLs
      const urls = await getImageUrlsByKeys(keys);
      
      // Cache the results
      keys.forEach(key => {
        if (urls[key]) {
          urlCache.set(`url:${key}`, urls[key]);
        }
      });
      
      // Also prefetch metadata for each image
      const metadataPromises = keys.map(key => 
        queryClient.prefetchQuery({
          queryKey: ['image', key],
          queryFn: () => fetchImageByKey(key),
          staleTime: getCacheConfig().staleTime,
        })
      );
      
      await Promise.all(metadataPromises);
    } catch (error) {
      console.error('Error prefetching batch of images:', error);
      // Fall back to individual prefetching if batch operation fails
      const promises = keys.map(key => prefetchImage(key, false));
      await Promise.all(promises);
    }
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
    prefetchImage,
    prefetchImages,
    invalidateImageCache,
  };
};
