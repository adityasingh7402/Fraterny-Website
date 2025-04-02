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
    console.log(`[CDN] Testing connection to ${CDN_URL}/health...`);
    
    // We'll use a simple HEAD request to check if the CDN is available
    const response = await fetch(`${CDN_URL}/website-images/placeholder.svg`, {
      method: 'HEAD',
      cache: 'no-cache',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    
    const available = response.ok;
    console.log(`[CDN] Test result: ${available ? 'Connected' : 'Disconnected'}`);
    
    // Update cache
    cdnAvailabilityCache = {
      available,
      timestamp: Date.now(),
      error: available ? undefined : `HTTP status: ${response.status}`
    };
    
    return available;
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
