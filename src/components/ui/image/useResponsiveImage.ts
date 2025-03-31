
import { useState, useEffect } from 'react';
import { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize, 
  getImagePlaceholdersByKey,
  clearImageUrlCacheForKey,
  getGlobalCacheVersion
} from '@/services/images';
import { toast } from 'sonner';
import { ImageLoadingState } from './types';

/**
 * Custom hook to handle dynamic image loading from storage
 * Enhanced with versioning and cache coordination
 */
export const useResponsiveImage = (
  dynamicKey?: string,
  size?: 'small' | 'medium' | 'large',
  debugCache?: boolean
): ImageLoadingState => {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: !!dynamicKey,
    error: false,
    dynamicSrc: null,
    aspectRatio: undefined,
    tinyPlaceholder: null,
    colorPlaceholder: null,
    contentHash: null,
    isCached: false,
    lastUpdated: null
  });
  
  // Fetch dynamic image if dynamicKey is provided
  useEffect(() => {
    if (!dynamicKey) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    
    // Clear cache for this key to ensure we get fresh data in development
    if (process.env.NODE_ENV === 'development') {
      clearImageUrlCacheForKey(dynamicKey);
    }
    
    const fetchImage = async () => {
      try {
        // Get the global cache version for proper cache coordination
        const globalVersion = await getGlobalCacheVersion();
        
        // Load from performance cache if available
        const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}:${globalVersion || ''}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        let cachedImageInfo: any = null;
        
        // Check if we have a valid cached version that's not too old
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            
            // Use cache if it's less than 5 minutes old
            if (cacheAge < 5 * 60 * 1000) {
              cachedImageInfo = parsed;
              if (debugCache) console.log(`Using cached image data for ${dynamicKey}`);
            }
          } catch (e) {
            console.error('Error parsing cached image data:', e);
          }
        }
        
        // If we have valid cached data, use it
        if (cachedImageInfo) {
          setState(prev => ({ 
            ...prev, 
            dynamicSrc: cachedImageInfo.url, 
            isLoading: false,
            aspectRatio: cachedImageInfo.aspectRatio,
            tinyPlaceholder: cachedImageInfo.tinyPlaceholder,
            colorPlaceholder: cachedImageInfo.colorPlaceholder,
            contentHash: cachedImageInfo.contentHash,
            isCached: true,
            lastUpdated: cachedImageInfo.lastUpdated
          }));
          return;
        }
        
        if (debugCache) console.log(`Fetching image with key: ${dynamicKey}, size: ${size || 'original'}`);
        
        // Fetch placeholders in parallel with the main image for faster loading
        const placeholdersPromise = getImagePlaceholdersByKey(dynamicKey);
        
        // Handle mobile variant keys
        const isMobileKey = dynamicKey.includes('-mobile');
        let imageUrl: string;
        let fallbackToDesktop = false;
        
        // Extract any content hash and cache metadata from the URL
        let extractedContentHash = null;
        
        // If size is specified, try to get that specific size
        if (size) {
          imageUrl = await getImageUrlByKeyAndSize(dynamicKey, size);
          
          // Extract content hash from URL
          try {
            const urlObj = new URL(imageUrl);
            extractedContentHash = urlObj.searchParams.get('v') || null;
          } catch (err) {
            // Ignore URL parsing errors
          }
          
          if (imageUrl === '/placeholder.svg' && isMobileKey) {
            // If this is a mobile key and we got a placeholder,
            // try the desktop version instead (removing the -mobile suffix)
            const desktopKey = dynamicKey.replace('-mobile', '');
            console.log(`Mobile image not found, trying desktop key: ${desktopKey}`);
            imageUrl = await getImageUrlByKeyAndSize(desktopKey, size);
            fallbackToDesktop = true;
          }
        } else {
          // Otherwise get the original image
          imageUrl = await getImageUrlByKey(dynamicKey);
          
          // Extract content hash from URL
          try {
            const urlObj = new URL(imageUrl);
            extractedContentHash = urlObj.searchParams.get('v') || null;
          } catch (err) {
            // Ignore URL parsing errors
          }
          
          if (imageUrl === '/placeholder.svg' && isMobileKey) {
            // If this is a mobile key and we got a placeholder,
            // try the desktop version instead (removing the -mobile suffix)
            const desktopKey = dynamicKey.replace('-mobile', '');
            console.log(`Mobile image not found, trying desktop key: ${desktopKey}`);
            imageUrl = await getImageUrlByKey(desktopKey);
            fallbackToDesktop = true;
          }
        }
        
        // Get placeholders
        let { tinyPlaceholder, colorPlaceholder } = await placeholdersPromise;
        
        // If we switched to desktop key but don't have placeholders, try getting them from desktop key
        if (fallbackToDesktop && (!tinyPlaceholder && !colorPlaceholder)) {
          const desktopKey = dynamicKey.replace('-mobile', '');
          const desktopPlaceholders = await getImagePlaceholdersByKey(desktopKey);
          tinyPlaceholder = desktopPlaceholders.tinyPlaceholder;
          colorPlaceholder = desktopPlaceholders.colorPlaceholder;
        }
        
        // Get image dimensions for aspect ratio
        const aspectRatio = await getImageAspectRatio(imageUrl);
        
        // Cache this response in sessionStorage for faster subsequent loads
        // Include the global version in the cached data for cache coordination
        const imageInfo = {
          url: imageUrl,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          timestamp: Date.now(),
          lastUpdated: new Date().toISOString(),
          globalVersion
        };
        
        sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
        
        setState(prev => ({ 
          ...prev, 
          dynamicSrc: imageUrl, 
          isLoading: false,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          isCached: false,
          lastUpdated: imageInfo.lastUpdated
        }));
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
  }, [dynamicKey, size, debugCache]);
  
  return state;
};

/**
 * Helper function to get image aspect ratio from a URL
 */
const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise((resolve) => {
    // For placeholder images, return a default aspect ratio
    if (url === '/placeholder.svg') {
      resolve(16/9);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
};
