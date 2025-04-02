
/**
 * Utilities for debugging application issues
 */

/**
 * Debug Supabase storage paths to ensure they are correctly formatted
 * @param storagePath The storage path to validate
 * @returns Boolean indicating if path is valid and logs information
 */
export const debugStoragePath = (storagePath: string): boolean => {
  if (!storagePath) {
    console.error('Storage path is empty');
    return false;
  }
  
  // Check for common issues in storage paths
  if (storagePath.startsWith('/')) {
    console.warn(`Storage path should not start with a slash: ${storagePath}`);
  }
  
  if (storagePath.includes('//')) {
    console.error(`Storage path contains double slashes: ${storagePath}`);
    return false;
  }
  
  // Log the full path for debugging
  console.log(`Validating storage path: ${storagePath}`);
  
  return true;
};

/**
 * Monitor network requests to identify issues
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
