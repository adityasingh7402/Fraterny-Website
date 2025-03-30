/**
 * Utility functions for generating and managing content-based hashes
 */

/**
 * Generate a content hash from a File object
 * This creates a unique identifier based on file content
 */
export const generateContentHash = async (file: File): Promise<string> => {
  try {
    // Use the SubtleCrypto API to create SHA-256 hash of file content
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Return a shortened version of the hash (first 10 chars is sufficient for our needs)
    return hashHex.substring(0, 10);
  } catch (error) {
    console.error('Error generating content hash:', error);
    // Fallback to timestamp-based identifier if hashing fails
    return `t${Date.now().toString(36)}`;
  }
};

/**
 * Generate a cache key that includes content hash
 */
export const generateCacheKey = (key: string, contentHash: string): string => {
  return `${key}:${contentHash}`;
};

/**
 * Extract the base key and content hash from a cache key
 */
export const parseCacheKey = (cacheKey: string): { baseKey: string; contentHash: string | null } => {
  const parts = cacheKey.split(':');
  if (parts.length >= 2) {
    return {
      baseKey: parts[0],
      contentHash: parts[1]
    };
  }
  return {
    baseKey: cacheKey,
    contentHash: null
  };
};

/**
 * Add content hash as a query parameter to a URL for cache busting
 */
export const addHashToUrl = (url: string, contentHash: string): string => {
  // If URL already has query params, append the hash
  if (url.includes('?')) {
    return `${url}&v=${contentHash}`;
  }
  // Otherwise add it as the first query param
  return `${url}?v=${contentHash}`;
};

/**
 * Parse content hash from URL if present
 */
export const getHashFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get('v');
  } catch (error) {
    return null;
  }
};
