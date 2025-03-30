
import { useState, useEffect } from 'react';
import { getImageUrlByKey, getImageUrlByKeyAndSize, clearImageUrlCacheForKey } from '@/services/images';
import { toast } from 'sonner';
import { ImageLoadingState } from './types';

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
        
        // Handle mobile variant keys
        const isMobileKey = dynamicKey.includes('-mobile');
        
        // If size is specified, try to get that specific size
        if (size) {
          const url = await getImageUrlByKeyAndSize(dynamicKey, size);
          console.log(`Fetched image URL for ${dynamicKey}: ${url}`);
          
          if (url === '/placeholder.svg' && isMobileKey) {
            // If this is a mobile key and we got a placeholder,
            // try the desktop version instead (removing the -mobile suffix)
            const desktopKey = dynamicKey.replace('-mobile', '');
            console.log(`Mobile image not found, trying desktop key: ${desktopKey}`);
            const desktopUrl = await getImageUrlByKeyAndSize(desktopKey, size);
            
            if (desktopUrl !== '/placeholder.svg') {
              // Successfully found a desktop image to use
              console.log(`Using desktop image for mobile: ${desktopUrl}`);
              
              // Get image dimensions for aspect ratio
              const aspectRatio = await getImageAspectRatio(desktopUrl);
              
              setState(prev => ({ 
                ...prev, 
                dynamicSrc: desktopUrl, 
                isLoading: false,
                aspectRatio 
              }));
              return;
            }
          }
          
          // Get image dimensions for aspect ratio
          const aspectRatio = await getImageAspectRatio(url);
          
          setState(prev => ({ 
            ...prev, 
            dynamicSrc: url, 
            isLoading: false,
            aspectRatio 
          }));
        } else {
          // Otherwise get the original image
          const url = await getImageUrlByKey(dynamicKey);
          console.log(`Fetched image URL for ${dynamicKey}: ${url}`);
          
          if (url === '/placeholder.svg' && isMobileKey) {
            // If this is a mobile key and we got a placeholder,
            // try the desktop version instead (removing the -mobile suffix)
            const desktopKey = dynamicKey.replace('-mobile', '');
            console.log(`Mobile image not found, trying desktop key: ${desktopKey}`);
            const desktopUrl = await getImageUrlByKey(desktopKey);
            
            if (desktopUrl !== '/placeholder.svg') {
              // Successfully found a desktop image to use
              console.log(`Using desktop image for mobile: ${desktopUrl}`);
              
              // Get image dimensions for aspect ratio
              const aspectRatio = await getImageAspectRatio(desktopUrl);
              
              setState(prev => ({ 
                ...prev, 
                dynamicSrc: desktopUrl, 
                isLoading: false,
                aspectRatio 
              }));
              return;
            }
          }
          
          // Get image dimensions for aspect ratio
          const aspectRatio = await getImageAspectRatio(url);
          
          setState(prev => ({ 
            ...prev, 
            dynamicSrc: url, 
            isLoading: false,
            aspectRatio 
          }));
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

/**
 * Helper function to get image aspect ratio from a URL
 */
const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
};
