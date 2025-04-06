
import { useState, useEffect } from 'react';
import { isValidUrl } from '@/utils/debugUtils';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook provides direct image URLs from Supabase with local caching
 * Uses image key directly instead of storage path
 */
export const useCdnImage = (
  imagePath: string | null | undefined
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeUrl = async () => {
      // Reset error state on new path
      setError(null);
      
      // Improved validation for empty/undefined keys
      if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
        if (isMounted) {
          setUrl(null);
          setIsLoading(false);
          setIsCached(false);
        }
        return;
      }
      
      // Generate a consistent cache key for this request
      const normalizedKey = imagePath.trim();
      const cacheKey = `directimage:${normalizedKey}`;
      
      console.log(`useCdnImage: Processing key: "${normalizedKey}"`);
      
      // Check localStorage cache first
      let cachedData = null;
      try {
        if (localStorageCacheService.isValid()) {
          cachedData = localStorageCacheService.getUrl(cacheKey);
          if (cachedData) {
            console.log(`useCdnImage: Found cached URL for key "${normalizedKey}": ${cachedData}`);
          }
        }
      } catch (err) {
        console.warn('Failed to check localStorage cache:', err);
      }
      
      if (cachedData && isValidUrl(cachedData)) {
        if (isMounted) {
          setUrl(cachedData);
          setIsLoading(false);
          setIsCached(true);
        }
        return;
      }
      
      try {
        // Use key directly to get public URL
        console.log(`useCdnImage: Getting public URL for key: "${normalizedKey}"`);
        
        const { data } = await supabase.storage
          .from('website-images')
          .getPublicUrl(normalizedKey);
          
        if (!data || !data.publicUrl) {
          console.error(`useCdnImage: No public URL returned for key "${normalizedKey}"`);
          throw new Error(`No public URL returned for key "${normalizedKey}"`);
        }
        
        const processedUrl = data.publicUrl;
        console.log(`useCdnImage: Got public URL for key "${normalizedKey}": ${processedUrl}`);
        
        // Cache the result for future use
        try {
          if (localStorageCacheService.isValid()) {
            localStorageCacheService.setUrl(cacheKey, processedUrl, 3);
          }
        } catch (err) {
          console.warn('Failed to cache URL in localStorage:', err);
        }
        
        if (isMounted) {
          setUrl(processedUrl);
          setIsLoading(false);
          setIsCached(false);
        }
      } catch (error) {
        console.error(`useCdnImage error for key "${normalizedKey}":`, error);
        
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Unknown error processing image URL'));
        }
        
        // Still set a URL to avoid breaking the UI
        if (isMounted) {
          setUrl('/placeholder.svg');
          setIsLoading(false);
          setIsCached(false);
        }
      }
    };
    
    initializeUrl();
    
    return () => {
      isMounted = false;
    };
  }, [imagePath]);
  
  return { 
    url, 
    isLoading, 
    error, 
    isCached,
    isFallback: false, // Always false now as we don't use CDN fallback
  };
};

export default useCdnImage;
