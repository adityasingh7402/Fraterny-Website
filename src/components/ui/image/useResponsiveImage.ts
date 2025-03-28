
import { useState, useEffect } from 'react';
import { getImageUrlByKey, getImageUrlByKeyAndSize } from '@/services/images';
import { toast } from 'sonner';
import { ImageLoadingState } from './types';
import { clearImageUrlCacheForKey } from '@/services/images';

/**
 * Custom hook to handle dynamic image loading from storage
 */
export const useResponsiveImage = (
  dynamicKey?: string,
  size?: 'small' | 'medium' | 'large'
): ImageLoadingState => {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: !!dynamicKey,
    error: false,
    dynamicSrc: null,
    aspectRatio: undefined
  });
  
  // Fetch dynamic image if dynamicKey is provided
  useEffect(() => {
    if (!dynamicKey) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    
    // Clear cache for this key to ensure we get fresh data
    clearImageUrlCacheForKey(dynamicKey);
    
    const fetchImage = async () => {
      try {
        console.log(`Fetching image with key: ${dynamicKey}, size: ${size || 'original'}`);
        
        // If size is specified, try to get that specific size
        if (size) {
          const url = await getImageUrlByKeyAndSize(dynamicKey, size);
          console.log(`Fetched image URL for ${dynamicKey}: ${url}`);
          setState(prev => ({ ...prev, dynamicSrc: url, isLoading: false }));
        } else {
          // Otherwise get the original image
          const url = await getImageUrlByKey(dynamicKey);
          console.log(`Fetched image URL for ${dynamicKey}: ${url}`);
          setState(prev => ({ ...prev, dynamicSrc: url, isLoading: false }));
        }
      } catch (error) {
        console.error(`Failed to load image with key ${dynamicKey}:`, error);
        setState(prev => ({ ...prev, error: true, isLoading: false }));
        
        // Don't show toast for development placeholder images or expected fallbacks
        if (!dynamicKey.includes('villalab-') && !dynamicKey.includes('hero-') && !dynamicKey.includes('experience-')) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
            duration: 3000,
          });
        }
      }
    };
    
    fetchImage();
  }, [dynamicKey, size]);
  
  return state;
};
