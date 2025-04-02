
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
 * Create a signed URL for an image from Supabase storage
 */
export const createSignedUrl = async (
  storagePath: string,
  expirySeconds: number = 60 * 60
): Promise<string> => {
  if (!storagePath) return '/placeholder.svg';
  
  try {
    console.log(`Generating signed URL for: ${storagePath}`);
    
    // Get signed URL from Supabase storage - Fixed bucket name to match upload service
    const { data, error } = await supabase.storage
      .from('website-images')
      .createSignedUrl(storagePath, expirySeconds);
    
    // Debug the response
    console.log(`Signed URL response for ${storagePath}:`, { data, error });
    
    // Check if we have valid data and signedUrl
    if (error) {
      console.error(`Error creating signed URL for "${storagePath}":`, error);
      return '/placeholder.svg';
    }
    
    if (!data || !data.signedUrl) {
      console.error(`No signed URL returned for "${storagePath}"`);
      return '/placeholder.svg';
    }
    
    console.log(`Successfully generated signed URL for "${storagePath}": ${data.signedUrl.substring(0, 50)}...`);
    
    return data.signedUrl;
  } catch (err) {
    console.error(`Failed to create signed URL for "${storagePath}":`, err);
    return '/placeholder.svg';
  }
};
