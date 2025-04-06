
/**
 * Utility functions for content hashing and cache coordination
 */

/**
 * Generate a content hash for a file
 */
export const generateContentHash = async (file: File): Promise<string> => {
  try {
    // For now, use a timestamp-based hash
    // In production, would use crypto.subtle for a proper hash
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  } catch (error) {
    console.error('Error generating content hash:', error);
    return `fallback-${Date.now()}`;
  }
};

/**
 * Add a hash parameter to a URL for cache busting
 */
export const addHashToUrl = (url: string, hash: string): string => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('v', hash);
    return urlObj.toString();
  } catch (error) {
    // For non-valid URLs, append as a query string
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${hash}`;
  }
};

/**
 * Generate a cache key from image key and other parameters
 */
export const generateCacheKey = (
  imageKey: string,
  size?: string,
  version?: string
): string => {
  const parts = [imageKey];
  
  if (size) {
    parts.push(size);
  }
  
  if (version) {
    parts.push(version);
  }
  
  return parts.join(':');
};

/**
 * Parse a cache key to extract components
 */
export const parseCacheKey = (
  cacheKey: string
): { key: string; size?: string; version?: string } => {
  const parts = cacheKey.split(':');
  
  return {
    key: parts[0],
    size: parts.length > 1 ? parts[1] : undefined,
    version: parts.length > 2 ? parts[2] : undefined
  };
};
