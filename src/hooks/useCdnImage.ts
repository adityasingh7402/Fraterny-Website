
import { useState, useEffect } from 'react';
import { getCdnUrl, testCdnConnection, isCdnEnabled } from '@/utils/cdnUtils';

/**
 * Global cache for CDN availability status
 */
let isCdnAvailable: boolean | null = null;

/**
 * Hook to get a CDN URL for an image, with fallback to direct URL
 * 
 * @param imagePath - Original image path
 * @returns URL to use (CDN or original) and loading state
 */
export const useCdnImage = (imagePath: string | null | undefined) => {
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
      
      // Skip CDN check if CDN is disabled via settings
      const cdnEnabled = isCdnEnabled();
      
      // If CDN is enabled and we haven't tested it yet, do it now
      if (cdnEnabled && isCdnAvailable === null) {
        isCdnAvailable = await testCdnConnection();
      }
      
      // Get the appropriate URL
      const shouldUseCdn = cdnEnabled && isCdnAvailable;
      const processedUrl = shouldUseCdn ? getCdnUrl(imagePath) : imagePath;
      
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
  }, [imagePath]);
  
  return { url, isFallback, isLoading };
};

export default useCdnImage;
