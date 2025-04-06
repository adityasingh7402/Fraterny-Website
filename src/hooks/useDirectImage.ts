
import { useState, useEffect } from 'react';
import { getImageUrl, getMultipleImageUrls } from '@/services/images/directImageService';
import { isValidImageKey } from '@/services/images/validation';

/**
 * Simple hook to fetch an image URL by key
 */
export const useImageUrl = (imageKey: string | undefined) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!imageKey);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    if (!imageKey) {
      setUrl(null);
      setIsLoading(false);
      setError(false);
      return;
    }
    
    // Validate immediately
    if (!isValidImageKey(imageKey)) {
      console.error(`Invalid image key in useImageUrl: "${imageKey}"`);
      setUrl('/placeholder.svg');
      setIsLoading(false);
      setError(true);
      return;
    }
    
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        const imageUrl = await getImageUrl(imageKey);
        
        if (isMounted) {
          setUrl(imageUrl);
          setIsLoading(false);
          setError(imageUrl === '/placeholder.svg');
        }
      } catch (err) {
        console.error(`Error loading image "${imageKey}":`, err);
        
        if (isMounted) {
          setUrl('/placeholder.svg');
          setIsLoading(false);
          setError(true);
        }
      }
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [imageKey]);
  
  return { url, isLoading, error };
};

/**
 * Hook to get multiple image URLs at once
 */
export const useMultipleImageUrls = (imageKeys: string[] | undefined) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(!!imageKeys?.length);
  const [error, setError] = useState<boolean>(false);
  
  // Create a stable key for effect dependency
  const keysString = imageKeys?.filter(Boolean).sort().join(',') || '';
  
  useEffect(() => {
    if (!imageKeys?.length) {
      setUrls({});
      setIsLoading(false);
      setError(false);
      return;
    }
    
    let isMounted = true;
    
    const loadImages = async () => {
      try {
        const imageUrls = await getMultipleImageUrls(imageKeys);
        
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
    
    loadImages();
    
    return () => {
      isMounted = false;
    };
  }, [keysString]);
  
  return { urls, isLoading, error };
};
