
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { imageCache } from "./cacheService";

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

    // Check cache first
    const cacheKey = `image:${normalizedKey}`;
    const cached = imageCache.get(cacheKey);
    
    if (cached !== undefined) {
      console.log(`Cache hit for fetchImageByKey: ${normalizedKey}`);
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
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
    imageCache.set(cacheKey, data as WebsiteImage | null);
    
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
    let query = supabase.from('website_images').select('*', { count: 'exact' });
    
    // Add search functionality if search term is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      // Search in key, description, alt_text and category
      query = query.or(`key.ilike.%${term}%,description.ilike.%${term}%,alt_text.ilike.%${term}%,category.ilike.%${term}%`);
    }
    
    // Add pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      return handleApiError(error, 'Error fetching images', false) as unknown as { images: WebsiteImage[], total: number };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
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
    let query = supabase
      .from('website_images')
      .select('*', { count: 'exact' })
      .eq('category', category);
    
    // Add search functionality if search term is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      // Search in key, description and alt_text
      query = query.or(`key.ilike.%${term}%,description.ilike.%${term}%,alt_text.ilike.%${term}%`);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      return handleApiError(error, `Error fetching images by category "${category}"`, false) as unknown as { images: WebsiteImage[], total: number };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
    };
  } catch (error) {
    handleApiError(error, `Unexpected error in fetchImagesByCategory for category "${category}"`, false);
    return { images: [], total: 0 };
  }
};

/**
 * Clear image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
  console.log('Image cache cleared');
};

/**
 * Invalidate cache for specific image
 */
export const invalidateImageCache = (key: string): void => {
  imageCache.invalidate(key);
  console.log(`Cache invalidated for image with key: ${key}`);
};
