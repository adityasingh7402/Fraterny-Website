
import { useState, useEffect } from 'react';
import { getCdnUrl, testCdnConnection } from '@/utils/cdnUtils';

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
      
      // If we haven't tested the CDN yet, do it now
      if (isCdnAvailable === null) {
        isCdnAvailable = await testCdnConnection();
      }
      
      // Get the appropriate URL
      const cdnUrl = isCdnAvailable ? getCdnUrl(imagePath) : imagePath;
      
      if (isMounted) {
        setUrl(cdnUrl);
        setIsFallback(!isCdnAvailable);
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
