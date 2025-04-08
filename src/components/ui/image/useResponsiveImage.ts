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
import { isMobileDevice, getDeviceType, isLowBandwidth } from '@/utils/deviceUtils';
import { CACHE_CONFIG } from '@/services/images/constants';

/**
 * Custom hook to handle dynamic image loading from storage
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
    
    // Clear any existing cache for this key
    clearImageUrlCacheForKey(dynamicKey);
    
    const fetchImage = async (retries: number = CACHE_CONFIG.MAX_RETRIES) => {
      try {
        // Check session storage for cached image data
        const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}`;
        const cached = sessionStorage.getItem(cacheKey);
        let cachedImageInfo: any = null;
        
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === 'object') {
              cachedImageInfo = parsed;
              if (debugCache) console.log(`Using cached image data for ${dynamicKey}`);
            }
          } catch (e) {
            console.error('Error parsing cached image data:', e);
          }
        }
        
        // Get placeholders for progressive loading
        const placeholders = await getImagePlaceholdersByKey(dynamicKey);
        let { tinyPlaceholder, colorPlaceholder } = placeholders;
        
        // Show placeholder immediately while full image loads
        if (tinyPlaceholder || colorPlaceholder) {
          setState(prev => ({
            ...prev,
            tinyPlaceholder: tinyPlaceholder || prev.tinyPlaceholder,
            colorPlaceholder: colorPlaceholder || prev.colorPlaceholder,
          }));
        }
        
        // If we have cached data, use it
        if (cachedImageInfo) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: false,
            dynamicSrc: cachedImageInfo.url,
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
        
        // Determine if we should try mobile version
        const isMobile = isMobileDevice();
        const baseKey = dynamicKey.replace(/-mobile$/, ''); // Remove any existing -mobile suffix
        const mobileKey = `${baseKey}-mobile`;
        const shouldTryMobile = isMobile;
        
        if (debugCache) {
          console.log(`[useResponsiveImage] Device: ${getDeviceType()}`);
          console.log(`[useResponsiveImage] Original key: ${dynamicKey}`);
          console.log(`[useResponsiveImage] Base key: ${baseKey}`);
          console.log(`[useResponsiveImage] Mobile key: ${mobileKey}`);
          console.log(`[useResponsiveImage] Should try mobile: ${shouldTryMobile}`);
        }
        
        // Adjust size based on bandwidth
        const adjustedSize = isLowBandwidth() && size === 'large' ? 'medium' : size;
        
        let imageUrl: string;
        let fallbackToDesktop = false;
        let extractedContentHash = null;
        
        if (adjustedSize) {
          if (shouldTryMobile) {
            // Try mobile key first
            imageUrl = await getImageUrlByKeyAndSize(mobileKey, adjustedSize);
            if (imageUrl === '/placeholder.svg') {
              if (debugCache) console.log(`[useResponsiveImage] Mobile image not found, falling back to desktop`);
              // Fall back to desktop key
              imageUrl = await getImageUrlByKeyAndSize(baseKey, adjustedSize);
              fallbackToDesktop = true;
            } else if (debugCache) {
              console.log(`[useResponsiveImage] Using mobile image: ${imageUrl}`);
            }
          } else {
            // Use desktop key
            imageUrl = await getImageUrlByKeyAndSize(baseKey, adjustedSize);
            if (debugCache) console.log(`[useResponsiveImage] Using desktop image: ${imageUrl}`);
          }
        } else {
          // Similar logic for non-sized images
          if (shouldTryMobile) {
            imageUrl = await getImageUrlByKey(mobileKey);
            if (imageUrl === '/placeholder.svg') {
              if (debugCache) console.log(`[useResponsiveImage] Mobile image not found, falling back to desktop`);
              imageUrl = await getImageUrlByKey(baseKey);
              fallbackToDesktop = true;
            } else if (debugCache) {
              console.log(`[useResponsiveImage] Using mobile image: ${imageUrl}`);
            }
          } else {
            imageUrl = await getImageUrlByKey(baseKey);
            if (debugCache) console.log(`[useResponsiveImage] Using desktop image: ${imageUrl}`);
          }
        }
        
        // Extract content hash from URL
        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {
          // Ignore URL parsing errors
        }
        
        // If we fell back to desktop, try to get desktop placeholders
        if (fallbackToDesktop && (!tinyPlaceholder && !colorPlaceholder)) {
          const desktopKey = dynamicKey.replace('-mobile', '');
          const desktopPlaceholders = await getImagePlaceholdersByKey(desktopKey);
          tinyPlaceholder = desktopPlaceholders.tinyPlaceholder;
          colorPlaceholder = desktopPlaceholders.colorPlaceholder;
        }
        
        // Get image dimensions for aspect ratio and original dimensions
        const { aspectRatio, width, height } = await getImageAspectRatio(imageUrl);
        
        const imageInfo = {
          url: imageUrl,
          aspectRatio,
          tinyPlaceholder,
          colorPlaceholder,
          contentHash: extractedContentHash,
          isCached: true,
          lastUpdated: new Date().toISOString(),
          originalWidth: width,
          originalHeight: height
        };
        
        // Cache the image info in sessionStorage
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
        } catch (e) {
          console.warn('Failed to cache image data in sessionStorage:', e);
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: false,
          dynamicSrc: imageUrl,
          aspectRatio,
          tinyPlaceholder: tinyPlaceholder || prev.tinyPlaceholder,
          colorPlaceholder: colorPlaceholder || prev.colorPlaceholder,
          contentHash: extractedContentHash,
          isCached: true,
          lastUpdated: imageInfo.lastUpdated,
          originalWidth: width,
          originalHeight: height
        }));
      } catch (error) {
        console.error(`Failed to load image with key ${dynamicKey}:`, error);
        
        // Retry if we have retries left
        if (retries > 0) {
          console.log(`Retrying image load for ${dynamicKey} (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.RETRY_DELAY));
          return fetchImage(retries - 1);
        }
        
        // Don't show toast for development placeholder images or expected fallbacks
        if (!dynamicKey.includes('placeholder')) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
          });
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: true
        }));
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
