
import { useState, useEffect } from 'react';
import { 
  getCdnUrl, 
  isCdnEnabled, 
  getCdnAvailability,
  parseSupabaseUrl
} from '@/utils/cdn';
import { isValidUrl } from '@/utils/debugUtils';

/**
 * Hook to get a CDN URL for an image, with fallback to direct URL
 * Now with better error handling and validation
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeUrl = async () => {
      // Reset error state on new path
      setError(null);
      
      if (!imagePath) {
        if (isMounted) {
          setUrl(null);
          setIsLoading(false);
        }
        return;
      }
      
      // Skip CDN check if CDN is disabled via settings and not forced
      const cdnEnabled = forceCdn || isCdnEnabled();
      
      if (!cdnEnabled) {
        if (isMounted) {
          setUrl(imagePath);
          setIsFallback(true);
          setIsLoading(false);
        }
        return;
      }
      
      try {
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
            // Check if it's a Supabase URL that we need to transform
            const isSupabaseUrl = imagePath.includes('supabase.co/storage/v1/object/public') || 
                                 imagePath.includes('supabase.in/storage/v1/object/public');
            
            if (isSupabaseUrl) {
              console.log('[CDN] Transforming Supabase URL:', imagePath);
            }
            
            processedUrl = getCdnUrl(imagePath, forceCdn) || imagePath;
            
            // Validate the URL
            if (!isValidUrl(processedUrl)) {
              throw new Error(`Invalid URL generated: ${processedUrl}`);
            }
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
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Unknown error processing image URL'));
        }
        
        // Still set a URL to avoid breaking the UI
        if (isMounted) {
          setUrl(imagePath);
          setIsFallback(true);
          setIsLoading(false);
        }
      }
    };
    
    initializeUrl();
    
    return () => {
      isMounted = false;
    };
  }, [imagePath, forceCdn]);
  
  return { url, isFallback, isLoading, error };
};

export default useCdnImage;
