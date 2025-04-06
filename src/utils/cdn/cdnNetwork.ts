
/**
 * CDN Network Module
 * Handles CDN connectivity testing and availability tracking
 */

import { CDN_URL, CACHE_EXPIRATION } from './cdnConfig';

// Cache object to store CDN availability information
let cdnAvailabilityCache: { 
  available: boolean; 
  timestamp: number;
  error?: string;
} | null = null;

/**
 * Check if CDN is available by making a network request
 * @returns Promise that resolves to true if CDN is available
 */
export const testCdnConnection = async (): Promise<boolean> => {
  try {
    console.log(`[CDN] Testing connection to ${CDN_URL}...`);
    
    // Create a new Image and attempt to load from CDN
    return new Promise((resolve) => {
      const testImage = new Image();
      const timestamp = Date.now();
      
      // Set a timeout to prevent hanging if CDN is unreachable
      const timeoutId = setTimeout(() => {
        console.warn('[CDN] Connection test timeout');
        
        // Update cache with error information
        cdnAvailabilityCache = {
          available: false,
          timestamp: Date.now(),
          error: 'Connection timeout'
        };
        
        resolve(false);
      }, 5000);
      
      testImage.onload = () => {
        clearTimeout(timeoutId);
        console.log('[CDN] Connection test successful');
        
        // Update cache
        cdnAvailabilityCache = {
          available: true,
          timestamp: Date.now()
        };
        
        resolve(true);
      };
      
      testImage.onerror = () => {
        clearTimeout(timeoutId);
        console.warn('[CDN] Connection test failed');
        
        // Update cache with error information
        cdnAvailabilityCache = {
          available: false,
          timestamp: Date.now(),
          error: 'Image failed to load'
        };
        
        resolve(false);
      };
      
      // Add timestamp to avoid caching
      testImage.src = `${CDN_URL}/test-connection.png?t=${timestamp}`;
    });
  } catch (error) {
    console.error('[CDN] Connection test failed:', error);
    
    // Update cache with error information
    cdnAvailabilityCache = {
      available: false,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : String(error)
    };
    
    return false;
  }
};

/**
 * Test the CDN availability and update the cache
 * This is a wrapper around testCdnConnection that's more user-friendly
 * @returns Promise that resolves to true if CDN is available
 */
export const testCdnAvailability = async (): Promise<boolean> => {
  return testCdnConnection();
};

/**
 * Get CDN availability from cache or check network if cache is invalid
 * @returns Promise that resolves to cached or fresh CDN availability
 */
export const getCdnAvailability = async (): Promise<boolean> => {
  // If cache is valid, return cached result
  if (isCdnAvailabilityCacheValid()) {
    return cdnAvailabilityCache!.available;
  }
  
  // Otherwise, test connection
  return await testCdnConnection();
};

/**
 * Get the latest CDN error message, if any
 * @returns Error message or null if no error
 */
export const getCdnError = (): string | null => {
  if (!cdnAvailabilityCache || !cdnAvailabilityCache.error) {
    return null;
  }
  
  return cdnAvailabilityCache.error;
};

/**
 * Check if CDN availability cache is still valid
 * @returns boolean indicating if cache is valid
 */
export const isCdnAvailabilityCacheValid = (): boolean => {
  if (!cdnAvailabilityCache) {
    return false;
  }
  
  const now = Date.now();
  return (now - cdnAvailabilityCache.timestamp) < CACHE_EXPIRATION;
};

/**
 * Reset CDN availability cache
 */
export const resetCdnAvailabilityCache = (): void => {
  cdnAvailabilityCache = null;
};

/**
 * Force CDN availability to a known state (for testing)
 * @param available Whether the CDN should be considered available
 * @param error Optional error message
 */
export const forceCdnAvailability = (available: boolean, error?: string): void => {
  cdnAvailabilityCache = {
    available,
    timestamp: Date.now(),
    error
  };
};
