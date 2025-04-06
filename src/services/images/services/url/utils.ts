
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { IMAGE_KEYS } from "@/pages/admin/images/components/upload/constants";

// Create a mapping of valid keys for fast lookup
const VALID_KEYS = new Set(IMAGE_KEYS.map(item => item.key));

/**
 * Check if a key is valid - non-empty and in our predefined list
 */
export const isValidImageKey = (key: string | null | undefined): boolean => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    return false;
  }
  
  const normalizedKey = key.trim();
  
  // In production, we still check against our predefined list
  // but log warnings instead of rejecting outright
  if (process.env.NODE_ENV === 'production') {
    const isPredefined = VALID_KEYS.has(normalizedKey);
    if (!isPredefined) {
      console.warn(`Image key not in predefined list: "${normalizedKey}"`);
    }
    return true; // Still return true to avoid breaking production
  }
  
  // In development, strictly validate against predefined keys
  return VALID_KEYS.has(normalizedKey);
};

/**
 * Safely extract contentHash from metadata
 */
export const getContentHashFromMetadata = (metadata: Json | null): string | null => {
  if (!metadata) return null;
  
  // If metadata is a string (JSON string), try to parse it
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed?.contentHash || null;
    } catch {
      return null;
    }
  }
  
  // If metadata is an object (already parsed JSON), access contentHash directly
  if (typeof metadata === 'object' && metadata !== null) {
    return (metadata as Record<string, any>).contentHash || null;
  }
  
  return null;
};

/**
 * Create a versioned URL with content hash or global version for cache busting
 */
export const createVersionedUrl = (
  url: string, 
  contentHash: string | null, 
  cacheVersion: string | null
): string => {
  if (!url) return url;
  
  // Check if url is already a valid URL object
  try {
    const versionedUrl = new URL(url);
    
    if (contentHash) {
      versionedUrl.searchParams.append('v', contentHash);
    } else if (cacheVersion) {
      versionedUrl.searchParams.append('v', cacheVersion);
    }
    
    return versionedUrl.toString();
  } catch (error) {
    // If the URL is not valid, return it unchanged
    console.error(`Invalid URL format: ${url}`, error);
    return url;
  }
};

/**
 * Create a signed URL for a storage path
 * Uses key directly to get public URL
 */
export const createSignedUrl = async (key: string): Promise<string> => {
  // First validate that we have a proper key
  if (!isValidImageKey(key)) {
    console.error(`Invalid key in createSignedUrl: "${key}"`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  console.log(`Getting public URL for normalized key: "${normalizedKey}"`);
  
  try {
    // First check if the key exists in the database
    const { data: imageRecord, error: lookupError } = await supabase
      .from('website_images')
      .select('id')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (lookupError || !imageRecord) {
      console.error(`Key "${normalizedKey}" not found in database:`, lookupError || 'No record found');
      return '/placeholder.svg';
    }
    
    // Only get public URL if we confirmed the key exists in the database
    // NOTE: Supabase storage.getPublicUrl() doesn't return error property, only data
    const { data } = await supabase.storage
      .from('website-images')
      .getPublicUrl(normalizedKey);
    
    if (!data || !data.publicUrl) {
      console.error(`Failed to get public URL for key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    console.log(`Generated public URL for key "${normalizedKey}": ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error(`Error creating signed URL for key "${key}":`, error);
    return '/placeholder.svg';
  }
};
