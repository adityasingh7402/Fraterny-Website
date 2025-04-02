
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
  error?: string;
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
      // Create an AbortController for the health check
      const healthController = new AbortController();
      const healthTimeoutId = setTimeout(() => healthController.abort(), 5000); // 5-second timeout
      
      const healthResponse = await fetch(healthUrl, { 
        method: 'GET',
        signal: healthController.signal,
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(healthTimeoutId);
      
      if (healthResponse.ok) {
        try {
          const data = await healthResponse.json();
          if (data.status === 'ok') {
            console.log(`[CDN] Health check passed`);
            cdnAvailabilityCache = {
              isAvailable: true,
              timestamp: Date.now()
            };
            return true;
          }
        } catch (jsonError) {
          console.error('[CDN] Failed to parse health check response:', jsonError);
          // Continue to fallback test
        }
      }
    } catch (healthError) {
      console.error('[CDN] Health check failed:', healthError instanceof Error ? healthError.message : 'Unknown error');
      // Continue to fallback test
    }
    
    // Fallback to testing with an image
    const testUrl = `${CDN_URL}/images/hero/luxury-villa-mobile.webp`;
    console.log(`[CDN] Testing CDN connection with URL: ${testUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    try {
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log(`[CDN] Test result for ${testUrl}:`, response.status, response.ok);
      
      cdnAvailabilityCache = {
        isAvailable: response.ok,
        timestamp: Date.now(),
        error: response.ok ? undefined : `HTTP Error: ${response.status} ${response.statusText}`
      };
      
      return response.ok;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      
      if (fetchError.name === 'AbortError') {
        console.error('[CDN] Connection test timed out after 10 seconds');
        cdnAvailabilityCache = {
          isAvailable: false,
          timestamp: Date.now(),
          error: 'Connection timed out after 10 seconds'
        };
      } else {
        console.error('[CDN] Connection test failed:', errorMessage);
        cdnAvailabilityCache = {
          isAvailable: false,
          timestamp: Date.now(),
          error: errorMessage
        };
      }
      
      // Try one more test with a different path as a last resort
      try {
        const lastResortUrl = `${CDN_URL}/health`;
        const lastController = new AbortController();
        const lastTimeoutId = setTimeout(() => lastController.abort(), 5000); // 5-second timeout
        
        const lastResponse = await fetch(lastResortUrl, { 
          method: 'HEAD',
          signal: lastController.signal
        });
        
        clearTimeout(lastTimeoutId);
        
        cdnAvailabilityCache = {
          isAvailable: lastResponse.ok,
          timestamp: Date.now(),
          error: lastResponse.ok ? undefined : `HTTP Error: ${lastResponse.status} ${lastResponse.statusText}`
        };
        
        return lastResponse.ok;
      } catch (lastError) {
        const lastErrorMessage = lastError instanceof Error ? lastError.message : 'Unknown error';
        console.error('[CDN] Last resort test failed:', lastErrorMessage);
        cdnAvailabilityCache = {
          isAvailable: false,
          timestamp: Date.now(),
          error: lastErrorMessage
        };
        return false;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CDN] Connection test failed:', errorMessage);
    
    cdnAvailabilityCache = {
      isAvailable: false,
      timestamp: Date.now(),
      error: errorMessage
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
 * Get the last CDN error if any
 */
export const getCdnError = (): string | undefined => {
  return cdnAvailabilityCache.error;
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
