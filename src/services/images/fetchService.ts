
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";

// Cache for recently fetched images
const imageCache = new Map<string, {data: WebsiteImage | null, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch image metadata by key with caching
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  try {
    // Check cache first
    const cacheKey = `image:${key}`;
    const cached = imageCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`Cache hit for fetchImageByKey: ${key}`);
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching image with key "${key}":`, error);
      return null;
    }
    
    // Cache the result
    imageCache.set(cacheKey, {
      data: data as WebsiteImage | null,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Unexpected error in fetchImageByKey for key "${key}":`, error);
    return null;
  }
};

/**
 * Fetch all website images with pagination
 */
export const fetchAllImages = async (
  page: number = 1, 
  pageSize: number = 20
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    // First get the count of all images
    const { count, error: countError } = await supabase
      .from('website_images')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting images:', countError);
      return { images: [], total: 0 };
    }
    
    // Then fetch the actual page of data
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error('Error fetching images:', error);
      return { images: [], total: 0 };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
    };
  } catch (error) {
    console.error('Unexpected error in fetchAllImages:', error);
    return { images: [], total: 0 };
  }
};

/**
 * Fetch images by category with pagination
 */
export const fetchImagesByCategory = async (
  category: string,
  page: number = 1, 
  pageSize: number = 20
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    // First get the count of images in this category
    const { count, error: countError } = await supabase
      .from('website_images')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);
    
    if (countError) {
      console.error(`Error counting images in category "${category}":`, countError);
      return { images: [], total: 0 };
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error(`Error fetching images by category "${category}":`, error);
      return { images: [], total: 0 };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
    };
  } catch (error) {
    console.error(`Unexpected error in fetchImagesByCategory for category "${category}":`, error);
    return { images: [], total: 0 };
  }
};
