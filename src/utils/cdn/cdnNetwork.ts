
/**
 * CDN Network Module
 * Handles network testing and availability checks for the CDN
 */

import { CDN_URL, CACHE_EXPIRATION } from './cdnConfig';

/**
 * Global cache for CDN availability status with expiration
 */
type CdnAvailabilityCache = {
  isAvailable: boolean | null;
  timestamp: number;
};

let cdnAvailabilityCache: CdnAvailabilityCache = {
  isAvailable: null,
  timestamp: 0
};

/**
 * Check if the cached CDN availability status is still valid
 */
export const isCdnAvailabilityCacheValid = (): boolean => {
  return (
    cdnAvailabilityCache.isAvailable !== null &&
    Date.now() - cdnAvailabilityCache.timestamp < CACHE_EXPIRATION
  );
};

/**
 * Test if the CDN is working by fetching a test image
 */
export const testCdnConnection = async (): Promise<boolean> => {
  try {
    // First try the health endpoint
    const healthUrl = `${CDN_URL}/health`;
    console.log(`[CDN] Testing CDN health with URL: ${healthUrl}`);
    
    try {
      const healthResponse = await fetch(healthUrl, { 
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        if (data.status === 'ok' && data.supabase === 'healthy') {
          console.log(`[CDN] Health check passed`);
          cdnAvailabilityCache = {
            isAvailable: true,
            timestamp: Date.now()
          };
          return true;
        }
      }
    } catch (healthError) {
      console.error('[CDN] Health check failed:', healthError);
      // Continue to fallback test
    }
    
    // Fallback to testing with an image
    const testUrl = `${CDN_URL}/images/hero/luxury-villa-mobile.webp`;
    console.log(`[CDN] Testing CDN connection with URL: ${testUrl}`);
    
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log(`[CDN] Test result for ${testUrl}:`, response.status, response.ok);
    
    cdnAvailabilityCache = {
      isAvailable: response.ok,
      timestamp: Date.now()
    };
    
    return response.ok;
  } catch (error) {
    console.error('[CDN] Connection test failed:', error);
    
    cdnAvailabilityCache = {
      isAvailable: false,
      timestamp: Date.now()
    };
    
    return false;
  }
};

/**
 * Get the cached CDN availability or test if not cached
 */
export const getCdnAvailability = async (): Promise<boolean> => {
  if (!isCdnAvailabilityCacheValid()) {
    await testCdnConnection();
  }
  return cdnAvailabilityCache.isAvailable || false;
};

/**
 * Reset the CDN availability cache
 */
export const resetCdnAvailabilityCache = (): void => {
  cdnAvailabilityCache = {
    isAvailable: null,
    timestamp: 0
  };
};
