import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { 
  getCachedImage, 
  cacheImage, 
  clearImageCache, 
  invalidateImageCache 
} from "./utils/cacheUtils";
import {
  createImagesQuery,
  applySearchFilter,
  applyPagination,
  processQueryResponse
} from "./utils/queryUtils";
import { 
  fetchImageOptimized,
  fetchImagesBatch,
  invalidateCache
} from "./optimizedApiService";

/**
 * Fetch image metadata by key with improved caching
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  try {
    if (!key) {
      throw new Error('Image key is required');
    }
    
    // Normalize the key by trimming whitespace
    const normalizedKey = key.trim();
    console.log(`Fetching image with normalized key: "${normalizedKey}"`);

    // Use optimized fetch
    return await fetchImageOptimized(normalizedKey);
  } catch (error) {
    return handleApiError(error, `Unexpected error in fetchImageByKey for key "${key}"`, false) as null;
  }
};

/**
 * Fetch all website images with pagination and search
 */
export const fetchAllImages = async (
  page: number = 1, 
  pageSize: number = 20,
  searchTerm?: string
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    // Get all image keys first
    const { data: keys, error: keysError, count } = await supabase
      .from('website_images')
      .select('key', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (keysError) throw keysError;
    if (!keys || !count) return { images: [], total: 0 };

    // Fetch images in batch
    const imageKeys = keys.map(k => k.key);
    const images = await fetchImagesBatch(imageKeys);

    return {
      images,
      total: count
    };
  } catch (error) {
    handleApiError(error, 'Unexpected error in fetchAllImages', false);
    return { images: [], total: 0 };
  }
};

/**
 * Fetch images by category with pagination and search
 */
export const fetchImagesByCategory = async (
  category: string,
  page: number = 1, 
  pageSize: number = 20,
  searchTerm?: string
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    // Get image keys by category
    const { data: keys, error: keysError, count } = await supabase
      .from('website_images')
      .select('key', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (keysError) throw keysError;
    if (!keys || !count) return { images: [], total: 0 };

    // Fetch images in batch
    const imageKeys = keys.map(k => k.key);
    const images = await fetchImagesBatch(imageKeys);

    return {
      images,
      total: count
    };
  } catch (error) {
    handleApiError(error, 'Unexpected error in fetchImagesByCategory', false);
    return { images: [], total: 0 };
  }
};

// Re-export cache management functions from cacheUtils
export { clearImageCache, invalidateImageCache };
