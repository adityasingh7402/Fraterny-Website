import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

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
 * Now uses key directly instead of storage path
 */
export const createSignedUrl = async (key: string): Promise<string> => {
  if (!key) return '/placeholder.svg';
  
  try {
    console.log(`Getting public URL for key: ${key}`);
    
    // Get public URL (not signed, since we're using public bucket access)
    const { data } = await supabase.storage
      .from('website-images')
      .getPublicUrl(key);
      
    if (!data || !data.publicUrl) {
      console.error(`Failed to get public URL for key: ${key}`);
      return '/placeholder.svg';
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error(`Error creating signed URL for key ${key}:`, error);
    return '/placeholder.svg';
  }
};
