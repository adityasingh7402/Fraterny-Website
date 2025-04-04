
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
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * Custom hook to handle dynamic image loading from storage
 * Enhanced with versioning, cache coordination, and mobile optimization
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
  
  const network = useNetworkStatus();
  
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
        
        // Load from performance cache if available and network is not offline
        const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}:${globalVersion || ''}`;
        const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;
        let cachedImageInfo: any = null;
        
        // Check if we have a valid cached version that's not too old
        // Use a shorter cache expiry on slow connections
        const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType) 
          ? 15 * 60 * 1000  // 15 minutes for slower connections
          : 5 * 60 * 1000;  // 5 minutes for faster connections
          
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            
            // Use cache if it's less than the expiry time
            if (cacheAge < cacheExpiryTime) {
              cachedImageInfo = parsed;
              if (debugCache) console.log(`Using cached image data for ${dynamicKey}`);
            }
          } catch (e) {
            console.error('Error parsing cached image data:', e);
          }
        }
        
        // Give priority to placeholders on slow connections
        const fetchPlaceholdersFirst = ['slow-2g', '2g'].includes(network.effectiveConnectionType);
        
        // If we're on a slow connection, start by loading placeholders
        let tinyPlaceholder = null;
        let colorPlaceholder = null;
        
        if (fetchPlaceholdersFirst) {
          const placeholders = await getImagePlaceholdersByKey(dynamicKey);
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;
          
          // Show placeholder immediately while full image loads
          if (tinyPlaceholder) {
            setState(prev => ({
              ...prev,
              tinyPlaceholder,
              colorPlaceholder,
              // Don't set isLoading to false yet, we're still loading the full image
            }));
          }
        }
        
        // If we have valid cached data, use it
        if (cachedImageInfo) {
          setState(prev => ({ 
            ...prev, 
            dynamicSrc: cachedImageInfo.url, 
            isLoading: false,
            aspectRatio: cachedImageInfo.aspectRatio,
            tinyPlaceholder: cachedImageInfo.tinyPlaceholder || prev.tinyPlaceholder,
            colorPlaceholder: cachedImageInfo.colorPlaceholder || prev.colorPlaceholder,
            contentHash: cachedImageInfo.contentHash,
            isCached: true,
            lastUpdated: cachedImageInfo.lastUpdated
          }));
          return;
        }
        
        if (debugCache) console.log(`Fetching image with key: ${dynamicKey}, size: ${size || 'original'}`);
        
        // Fetch placeholders in parallel with the main image for faster loading
        const placeholdersPromise = !fetchPlaceholdersFirst ? 
          getImagePlaceholdersByKey(dynamicKey) : 
          Promise.resolve({ tinyPlaceholder, colorPlaceholder });
        
        // Handle mobile variant keys
        const isMobileKey = dynamicKey.includes('-mobile');
        let imageUrl: string;
        let fallbackToDesktop = false;
        
        // Extract any content hash and cache metadata from the URL
        let extractedContentHash = null;
        
    // Assume fetchService returns image object with CDN-based `url`
const imageMetadata = await getImageByKey(dynamicKey); // Your existing API call
imageUrl = imageMetadata?.url;
if (!imageUrl) {
  throw new Error(`No image URL found for key: ${dynamicKey}`);
}      
        // Get placeholders if we didn't fetch them earlier
        if (!fetchPlaceholdersFirst) {
          const placeholders = await placeholdersPromise;
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;
        }
        
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
          globalVersion,
          networkType: network.effectiveConnectionType
        };
        
        try {
          // Only cache if we're online
          if (navigator.onLine) {
            sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
          }
        } catch (e) {
          console.warn('Failed to cache image data in sessionStorage:', e);
        }
        
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
    
    // For slow connections or offline mode, use a small delay to avoid 
    // excessive requests during poor connectivity
    const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType) 
      ? 300 : 0;
      
    const timeoutId = setTimeout(() => {
      fetchImage();
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType]);
  
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
