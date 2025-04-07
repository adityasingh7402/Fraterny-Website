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

// Mobile device detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * Custom hook to handle dynamic image loading from storage
 * Enhanced with versioning, cache coordination, and mobile optimization
 * Now preserves original image dimensions for consistent display
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
    lastUpdated: null,
    originalWidth: undefined,
    originalHeight: undefined
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
            lastUpdated: cachedImageInfo.lastUpdated,
            originalWidth: cachedImageInfo.originalWidth,
            originalHeight: cachedImageInfo.originalHeight
          }));
          return;
        }
        
        if (debugCache) console.log(`Fetching image with key: ${dynamicKey}, size: ${size || 'original'}`);
        
        // Fetch placeholders in parallel with the main image for faster loading
        const placeholdersPromise = !fetchPlaceholdersFirst ? 
          getImagePlaceholdersByKey(dynamicKey) : 
          Promise.resolve({ tinyPlaceholder, colorPlaceholder });
        
        // Determine if we should use mobile key
        const isMobile = isMobileDevice();
        const mobileKey = `${dynamicKey}-mobile`;
        const shouldTryMobile = isMobile && !dynamicKey.includes('-mobile');
        
        // Try mobile key first if we're on mobile
        let imageUrl: string;
        let fallbackToDesktop = false;
        let extractedContentHash = null;
        
        if (size) {
          if (shouldTryMobile) {
            // Try mobile key first
            imageUrl = await getImageUrlByKeyAndSize(mobileKey, size);
            if (imageUrl === '/placeholder.svg') {
              // Fall back to desktop key
              imageUrl = await getImageUrlByKeyAndSize(dynamicKey, size);
              fallbackToDesktop = true;
            }
          } else {
            // Use provided key (could be mobile or desktop)
            imageUrl = await getImageUrlByKeyAndSize(dynamicKey, size);
            if (imageUrl === '/placeholder.svg' && dynamicKey.includes('-mobile')) {
              // If mobile key fails, try desktop version
              const desktopKey = dynamicKey.replace('-mobile', '');
              imageUrl = await getImageUrlByKeyAndSize(desktopKey, size);
              fallbackToDesktop = true;
            }
          }
        } else {
          // Similar logic for non-sized images
          if (shouldTryMobile) {
            imageUrl = await getImageUrlByKey(mobileKey);
            if (imageUrl === '/placeholder.svg') {
              imageUrl = await getImageUrlByKey(dynamicKey);
              fallbackToDesktop = true;
            }
          } else {
            imageUrl = await getImageUrlByKey(dynamicKey);
            if (imageUrl === '/placeholder.svg' && dynamicKey.includes('-mobile')) {
              const desktopKey = dynamicKey.replace('-mobile', '');
              imageUrl = await getImageUrlByKey(desktopKey);
              fallbackToDesktop = true;
            }
          }
        }
        
        // Extract content hash from URL
        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {
          // Ignore URL parsing errors
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
        
        // Get image dimensions for aspect ratio and original dimensions
        const { aspectRatio, width, height } = await getImageAspectRatio(imageUrl);
        
        // Cache this response in sessionStorage for faster subsequent loads
        // Include the global version in the cached data for cache coordination
        const imageInfo = {
          url: imageUrl,
          aspectRatio,
          originalWidth: width,
          originalHeight: height,
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
          originalWidth: width,
          originalHeight: height,
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
 * Helper function to get image aspect ratio and dimensions from a URL
 * Enhanced to return original width and height
 */
const getImageAspectRatio = (url: string): Promise<{
  aspectRatio: number | undefined, 
  width: number | undefined, 
  height: number | undefined
}> => {
  return new Promise((resolve) => {
    // For placeholder images, return a default aspect ratio
    if (url === '/placeholder.svg') {
      resolve({
        aspectRatio: 16/9,
        width: undefined,
        height: undefined
      });
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve({
        aspectRatio,
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => resolve({
      aspectRatio: undefined,
      width: undefined,
      height: undefined
    });
    img.src = url;
  });
};
