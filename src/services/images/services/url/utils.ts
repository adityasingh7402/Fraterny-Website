
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
  
  const versionedUrl = new URL(url);
  
  if (contentHash) {
    versionedUrl.searchParams.append('v', contentHash);
  } else if (cacheVersion) {
    versionedUrl.searchParams.append('v', cacheVersion);
  }
  
  return versionedUrl.toString();
};

/**
 * Create a signed URL for an image from Supabase storage
 */
export const createSignedUrl = async (
  storagePath: string,
  expirySeconds: number = 60 * 60
): Promise<string> => {
  if (!storagePath) return '/placeholder.svg';

  const { data: { signedUrl }, error } = await supabase.storage
    .from('images')
    .createSignedUrl(storagePath, expirySeconds);
  
  if (error || !signedUrl) {
    console.error(`Error creating signed URL for "${storagePath}":`, error);
    return '/placeholder.svg';
  }
  
  return signedUrl;
};
