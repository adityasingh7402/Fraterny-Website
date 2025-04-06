
/**
 * React hook for accessing images
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';
import { STORAGE_BUCKET_NAME } from '@/services/images/constants';

type ImageSize = 'small' | 'medium' | 'large';

/**
 * Get a public URL for an image by key
 */
const getImageUrlByKey = async (key: string): Promise<string> => {
  if (!key) return '/placeholder.svg';
  
  // Check cache first
  const cacheKey = `img-url:${key}`;
  try {
    if (localStorageCacheService.isValid()) {
      const cachedUrl = localStorageCacheService.getUrl(cacheKey);
      if (cachedUrl) return cachedUrl;
    }
  } catch (err) {
    console.warn('Failed to check localStorage cache:', err);
  }
  
  try {
    // Get public URL using supabase client
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(key);
      
    if (!data || !data.publicUrl) {
      console.error(`No public URL returned for key "${key}"`);
      return '/placeholder.svg';
    }
    
    const url = data.publicUrl;
    
    // Cache the result
    try {
      if (localStorageCacheService.isValid()) {
        localStorageCacheService.setUrl(cacheKey, url, 3);
      }
    } catch (err) {
      console.warn('Failed to cache URL in localStorage:', err);
    }
    
    return url;
  } catch (err) {
    console.error(`Error getting public URL for "${key}":`, err);
    return '/placeholder.svg';
  }
};

/**
 * Get a sized variant of an image
 */
const getImageUrlByKeyAndSize = async (key: string, size: ImageSize): Promise<string> => {
  if (!key) return '/placeholder.svg';
  
  // Size variants are stored with a suffix
  const sizedKey = `${key}-${size}`;
  
  // Check if the sized variant exists first
  try {
    const { data: existsData, error: existsError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(sizedKey);
      
    if (existsData && existsData.publicUrl) {
      return existsData.publicUrl;
    }
  } catch (err) {
    console.warn(`Sized variant "${sizedKey}" not found, falling back to original`);
  }
  
  // Fall back to the original image if sized variant doesn't exist
  return getImageUrlByKey(key);
};

/**
 * Get multiple image URLs at once
 */
const getMultipleImageUrls = async (keys: string[]): Promise<Record<string, string>> => {
  if (!keys?.length) return {};
  
  const result: Record<string, string> = {};
  
  // Process in batches of 10 to avoid overwhelming the system
  for (let i = 0; i < keys.length; i += 10) {
    const batch = keys.slice(i, i + 10);
    
    // Create a promise for each key in the batch
    const promises = batch.map(key => getImageUrlByKey(key));
    
    try {
      const urls = await Promise.all(promises);
      
      // Add results to the result map
      batch.forEach((key, index) => {
        result[key] = urls[index];
      });
    } catch (err) {
      console.error('Error processing batch of image URLs:', err);
      
      // Add placeholder for failed batch
      batch.forEach(key => {
        result[key] = '/placeholder.svg';
      });
    }
  }
  
  return result;
};

/**
 * Hook to get an image URL by key
 */
export const useImageUrl = (key: string | undefined, size?: ImageSize) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!key);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!key) {
      setUrl(null);
      setIsLoading(false);
      setError(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchImage = async () => {
      try {
        const imageUrl = size 
          ? await getImageUrlByKeyAndSize(key, size)
          : await getImageUrlByKey(key);

        if (isMounted) {
          setUrl(imageUrl);
          setIsLoading(false);
          setError(imageUrl === '/placeholder.svg');
        }
      } catch (err) {
        console.error(`Error loading image "${key}":`, err);

        if (isMounted) {
          setUrl('/placeholder.svg');
          setIsLoading(false);
          setError(true);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [key, size]);

  return { url, isLoading, error };
};

/**
 * Hook to get multiple image URLs at once
 */
export const useMultipleImageUrls = (keys: string[] | undefined) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(!!keys?.length);
  const [error, setError] = useState<boolean>(false);

  // Create a stable dependency for the effect
  const keysString = keys?.filter(Boolean).sort().join(',') || '';

  useEffect(() => {
    if (!keys?.length) {
      setUrls({});
      setIsLoading(false);
      setError(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchImages = async () => {
      try {
        const imageUrls = await getMultipleImageUrls(keys);

        if (isMounted) {
          setUrls(imageUrls);
          setIsLoading(false);
          setError(Object.keys(imageUrls).length === 0);
        }
      } catch (err) {
        console.error('Error loading multiple images:', err);

        if (isMounted) {
          setUrls({});
          setIsLoading(false);
          setError(true);
        }
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [keysString]);

  return { urls, isLoading, error };
};

/**
 * Hook to preload images
 */
export const useImagePreloader = (keys: string[] | undefined) => {
  const preloadImages = useCallback(async () => {
    if (!keys?.length) return;
    
    try {
      // Just get the URLs to populate the cache
      await getMultipleImageUrls(keys);
    } catch (e) {
      console.warn('Image preloading error:', e);
    }
  }, [keys?.join(',')]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);
};

// Export all hooks
export default {
  useImageUrl,
  useMultipleImageUrls,
  useImagePreloader
};

// Export functions for direct use
export {
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getMultipleImageUrls
};
