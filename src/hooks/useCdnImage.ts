
import { useState, useEffect } from 'react';
import { 
  getCdnUrl, 
  isCdnEnabled, 
  getCdnAvailability,
  parseSupabaseUrl
} from '@/utils/cdn';
import { isValidUrl } from '@/utils/debugUtils';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';

/**
 * Hook to get a CDN URL for an image, with fallback to direct URL
 * Enhanced with localStorage persistence for improved performance
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
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeUrl = async () => {
      // Reset error state on new path
      setError(null);
      
      if (!imagePath) {
        if (isMounted) {
          setUrl(null);
          setIsLoading(false);
          setIsCached(false);
        }
        return;
      }
      
      // Generate a consistent cache key for this request
      const normalizedKey = imagePath.trim();
      const cacheKey = `cdnimage:${normalizedKey}:${forceCdn ? 'forced' : 'auto'}`;
      
      // Check localStorage cache first
      let cachedData = null;
      try {
        if (localStorageCacheService.isValid()) {
          cachedData = localStorageCacheService.getUrl(cacheKey);
        }
      } catch (err) {
        console.warn('Failed to check localStorage cache:', err);
      }
      
      if (cachedData && isValidUrl(cachedData)) {
        if (isMounted) {
          setUrl(cachedData);
          setIsFallback(false); // Assume cached URLs are CDN URLs
          setIsLoading(false);
          setIsCached(true);
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
          setIsCached(false);
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
        
        // Cache the result for future use
        try {
          if (localStorageCacheService.isValid()) {
            // Use priority 3 for CDN URLs
            localStorageCacheService.setUrl(cacheKey, processedUrl, 3);
          }
        } catch (err) {
          console.warn('Failed to cache CDN URL in localStorage:', err);
        }
        
        if (isMounted) {
          setUrl(processedUrl);
          setIsFallback(!shouldUseCdn);
          setIsLoading(false);
          setIsCached(false);
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
          setIsCached(false);
        }
      }
    };
    
    initializeUrl();
    
    return () => {
      isMounted = false;
    };
  }, [imagePath, forceCdn]);
  
  return { url, isFallback, isLoading, error, isCached };
};

export default useCdnImage;
