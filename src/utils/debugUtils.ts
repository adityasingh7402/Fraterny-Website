
/**
 * Utilities for debugging application issues
 */

/**
 * Debug and normalize Supabase storage paths to ensure they are correctly formatted
 * @param storagePath The storage path to validate and normalize
 * @returns The normalized path if valid, or null if invalid
 */
export const debugStoragePath = (storagePath: string): boolean => {
  if (!storagePath) {
    console.error('Storage path is empty');
    return false;
  }
  
  // Create a normalized version of the path
  let normalizedPath = storagePath;
  
  // Remove leading slashes
  if (normalizedPath.startsWith('/')) {
    console.warn(`Storage path should not start with a slash: ${storagePath}`);
    normalizedPath = normalizedPath.substring(1);
  }
  
  // Check for and fix common issues
  if (normalizedPath.includes('//')) {
    console.error(`Storage path contains double slashes: ${storagePath}`);
    return false;
  }
  
  // Log the full normalized path for debugging
  if (normalizedPath !== storagePath) {
    console.log(`Normalized storage path from "${storagePath}" to "${normalizedPath}"`);
  } else {
    console.log(`Validated storage path: ${storagePath}`);
  }
  
  return true;
};

/**
 * Monitor network requests to identify issues
 * @param url The URL being requested
 * @param method The HTTP method
 * @returns Object with methods to call on success or failure
 */
export const monitorNetworkRequest = (url: string, method: string = 'GET') => {
  console.log(`Network request: ${method} ${url}`);
  
  // Record the timing
  const startTime = performance.now();
  
  // Return a function to call when the request completes
  return {
    success: () => {
      const duration = performance.now() - startTime;
      console.log(`✅ Request succeeded: ${method} ${url} (${duration.toFixed(0)}ms)`);
    },
    failure: (error: any) => {
      const duration = performance.now() - startTime;
      console.error(`❌ Request failed: ${method} ${url} (${duration.toFixed(0)}ms)`, error);
    }
  };
};

/**
 * Validate a URL to ensure it's correctly formatted
 * @param url The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  // Skip validation for data URLs or placeholders
  if (url.startsWith('data:') || url.includes('placeholder')) {
    return true;
  }
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.warn(`Invalid URL format: ${url}`);
    return false;
  }
};
