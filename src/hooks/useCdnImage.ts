
import { useState, useEffect } from 'react';
import { getCdnUrl, testCdnConnection, isCdnEnabled } from '@/utils/cdnUtils';

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

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Check if the cached CDN availability status is still valid
 */
const isCdnAvailabilityCacheValid = (): boolean => {
  return (
    cdnAvailabilityCache.isAvailable !== null &&
    Date.now() - cdnAvailabilityCache.timestamp < CACHE_EXPIRATION
  );
};

/**
 * Hook to get a CDN URL for an image, with fallback to direct URL
 * 
 * @param imagePath - Original image path
 * @param forceCdn - Force using CDN regardless of settings (optional)
 * @returns URL to use (CDN or original) and loading state
 */
export const useCdnImage = (
  imagePath: string | null | undefined,
  forceCdn?: boolean
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initializeUrl = async () => {
      if (!imagePath) {
        setUrl(null);
        setIsLoading(false);
        return;
      }
      
      // Skip CDN check if CDN is disabled via settings and not forced
      const cdnEnabled = forceCdn || isCdnEnabled();
      
      if (!cdnEnabled) {
        setUrl(imagePath);
        setIsFallback(true);
        setIsLoading(false);
        return;
      }
      
      // If CDN is enabled and the cache has expired, test connection
      if (!isCdnAvailabilityCacheValid()) {
        try {
          const isAvailable = await testCdnConnection();
          cdnAvailabilityCache = {
            isAvailable,
            timestamp: Date.now()
          };
          
          // Log the availability result for debugging
          console.log(`[useCdnImage] CDN availability test result: ${isAvailable}`);
        } catch (error) {
          console.error('Error testing CDN connection:', error);
          cdnAvailabilityCache = {
            isAvailable: false,
            timestamp: Date.now()
          };
        }
      }
      
      // Get the appropriate URL
      const shouldUseCdn = cdnEnabled && cdnAvailabilityCache.isAvailable;
      let processedUrl = imagePath;
      
      if (shouldUseCdn) {
        try {
          // Get the URL through CDN
          processedUrl = getCdnUrl(imagePath, forceCdn) || imagePath;
          console.log(`[useCdnImage] Processed URL: ${processedUrl} (original: ${imagePath})`);
        } catch (error) {
          console.error('Error processing CDN URL:', error);
          processedUrl = imagePath; // Fallback to direct URL on error
        }
      }
      
      if (isMounted) {
        setUrl(processedUrl);
        setIsFallback(!shouldUseCdn);
        setIsLoading(false);
      }
    };
    
    initializeUrl();
    
    return () => {
      isMounted = false;
    };
  }, [imagePath, forceCdn]);
  
  return { url, isFallback, isLoading };
};

export default useCdnImage;
