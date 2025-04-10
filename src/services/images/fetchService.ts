import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { urlCache } from "./cacheService";
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

    // Invalidate any URL cache for this key to ensure we get fresh data
    urlCache.invalidate(`key:${normalizedKey}`);

    // Check cache first
    const cached = getCachedImage(normalizedKey);
    if (cached !== undefined) {
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('id, key, alt_text, description, category, storage_path, metadata, sizes, width, height, created_at, updated_at')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching image with key "${normalizedKey}":`, error);
      return handleApiError(error, `Error fetching image with key "${normalizedKey}"`, false) as null;
    }
    
    if (!data) {
      console.warn(`No image found with key "${normalizedKey}"`);
    } else {
      console.log(`Found image with key "${normalizedKey}":`, data.id);
    }
    
    // Cache the result
    cacheImage(normalizedKey, data as WebsiteImage | null);
    
    return data;
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
    let query = createImagesQuery();
    
    // Add search functionality if search term is provided
    query = applySearchFilter(query, searchTerm);
    
    // Add pagination
    const { data, error, count } = await applyPagination(query, page, pageSize);
    
    return processQueryResponse(data, error, count, 'Error fetching images');
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
    let query = createImagesQuery().eq('category', category);
    
    // Add search functionality if search term is provided
    query = applySearchFilter(query, searchTerm);
    
    // Add pagination
    const { data, error, count } = await applyPagination(query, page, pageSize);
    
    return processQueryResponse(
      data, 
      error, 
      count, 
      `Error fetching images by category "${category}"`
    );
  } catch (error) {
    handleApiError(error, `Unexpected error in fetchImagesByCategory for category "${category}"`, false);
    return { images: [], total: 0 };
  }
};

// Re-export cache management functions from cacheUtils
export { clearImageCache, invalidateImageCache };
