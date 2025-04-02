
import { useState, useEffect } from 'react';
import { 
  getCdnUrl, 
  isCdnEnabled, 
  getCdnAvailability
} from '@/utils/cdn';

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
      
      // Check CDN availability
      let cdnAvailable = false;
      try {
        cdnAvailable = await getCdnAvailability();
      } catch (error) {
        console.error('Error checking CDN availability:', error);
      }
      
      // Get the appropriate URL
      const shouldUseCdn = cdnEnabled && cdnAvailable;
      let processedUrl = imagePath;
      
      if (shouldUseCdn) {
        try {
          processedUrl = getCdnUrl(imagePath, forceCdn) || imagePath;
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
