
import { useQuery } from '@tanstack/react-query';
import { 
  fetchImageByKey, 
  fetchAllImages,
  fetchImagesByCategory,
  WebsiteImage
} from '@/services/images';
import { useNetworkAwareCacheConfig } from './useNetworkAwareCacheConfig';

/**
 * Hooks for fetching image data
 */
export const useImageQueries = () => {
  const { getCacheConfig } = useNetworkAwareCacheConfig();

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

  return {
    useImage,
    useMultipleImages,
    useImages,
    useImagesByCategory
  };
};
