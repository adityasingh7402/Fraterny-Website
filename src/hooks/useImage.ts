
/**
 * React hook for accessing images
 */
import { useState, useEffect } from 'react';
import { getImageUrl, getImageUrlBySize, getMultipleImageUrls } from '@/services/images/ImageService';

type ImageSize = 'small' | 'medium' | 'large';

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
          ? await getImageUrlBySize(key, size)
          : await getImageUrl(key);

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
  useEffect(() => {
    if (!keys?.length) return;

    // This just gets the URLs and prepopulates the cache
    getMultipleImageUrls(keys).catch(e => {
      console.warn('Image preloading error:', e);
    });
  }, [keys?.join(',')]);
};

// Export all hooks
export default {
  useImageUrl,
  useMultipleImageUrls,
  useImagePreloader
};
