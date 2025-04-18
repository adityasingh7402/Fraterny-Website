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
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Helper function to determine the appropriate image key based on device type
 */
const getEffectiveImageKey = (
  baseKey: string,
  isMobile: boolean,
  forceDesktop: boolean = false
): { key: string; isMobileVariant: boolean } => {
  if (forceDesktop) {
    return { key: baseKey.replace('-mobile', ''), isMobileVariant: false };
  }
  
  const hasMobileSuffix = baseKey.includes('-mobile');
  const shouldUseMobile = isMobile && !hasMobileSuffix;
  
  return {
    key: shouldUseMobile ? `${baseKey}-mobile` : baseKey,
    isMobileVariant: shouldUseMobile || hasMobileSuffix
  };
};

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!dynamicKey) return;
    
    // Make a single, definitive decision about which variant to use
    const { key: effectiveKey, isMobileVariant } = getEffectiveImageKey(dynamicKey, isMobile);
    
    if (debugCache) {
      console.log(`Image loading strategy for ${dynamicKey}:`, {
        isMobile,
        effectiveKey,
        isMobileVariant,
        originalKey: dynamicKey
      });
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    
    // Clear cache for this key to ensure we get fresh data in development
    if (process.env.NODE_ENV === 'development') {
      clearImageUrlCacheForKey(effectiveKey);
    }
    
    const fetchImage = async () => {
      try {
        // Get the global cache version for proper cache coordination
        const globalVersion = await getGlobalCacheVersion();
        
        // Create a cache key that includes the variant decision
        const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
        const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;
        
        // Check cache first
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType) 
              ? 15 * 60 * 1000  // 15 minutes for slower connections
              : 5 * 60 * 1000;  // 5 minutes for faster connections
            const cacheAge = Date.now() - parsed.timestamp;
            
            if (cacheAge < cacheExpiryTime) {
              setState(prev => ({
                ...prev,
                dynamicSrc: parsed.url,
                isLoading: false,
                aspectRatio: parsed.aspectRatio,
                tinyPlaceholder: parsed.tinyPlaceholder,
                colorPlaceholder: parsed.colorPlaceholder,
                contentHash: parsed.contentHash,
                isCached: true,
                lastUpdated: parsed.lastUpdated
              }));
              return;
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
          const placeholders = await getImagePlaceholdersByKey(effectiveKey);
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;
          
          // Show placeholder immediately while full image loads
          if (tinyPlaceholder) {
            setState(prev => ({
              ...prev,
              tinyPlaceholder,
              colorPlaceholder,
            }));
          }
        }
        
        if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);
        
        // Fetch placeholders in parallel with the main image for faster loading
        const placeholdersPromise = !fetchPlaceholdersFirst ? 
          getImagePlaceholdersByKey(effectiveKey) : 
          Promise.resolve({ tinyPlaceholder, colorPlaceholder });
        
        // Try to load the image with the definitive key
        const imageUrl = size 
          ? await getImageUrlByKeyAndSize(effectiveKey, size)
          : await getImageUrlByKey(effectiveKey);
        
        // Only fallback to desktop if we get a placeholder AND we're using a mobile key
        if (imageUrl === '/placeholder.svg' && isMobileVariant) {
          const { key: desktopKey } = getEffectiveImageKey(dynamicKey, isMobile, true);
          const desktopUrl = size 
            ? await getImageUrlByKeyAndSize(desktopKey, size)
            : await getImageUrlByKey(desktopKey);
            
          if (desktopUrl !== '/placeholder.svg') {
            // Get placeholders for desktop version if needed
            if (!fetchPlaceholdersFirst) {
              const desktopPlaceholders = await getImagePlaceholdersByKey(desktopKey);
              tinyPlaceholder = desktopPlaceholders.tinyPlaceholder;
              colorPlaceholder = desktopPlaceholders.colorPlaceholder;
            }
            
            // Cache and use the desktop version
            const aspectRatio = await getImageAspectRatio(desktopUrl);
            let extractedContentHash = null;
            
            try {
              const urlObj = new URL(desktopUrl);
              extractedContentHash = urlObj.searchParams.get('v') || null;
            } catch (err) {
              // Ignore URL parsing errors
            }
            
            const imageInfo = {
              url: desktopUrl,
              aspectRatio,
              tinyPlaceholder,
              colorPlaceholder,
              contentHash: extractedContentHash,
              timestamp: Date.now(),
              lastUpdated: new Date().toISOString(),
              globalVersion,
              networkType: network.effectiveConnectionType
            };
            
            if (navigator.onLine) {
              try {
                sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
              } catch (e) {
                console.warn('Failed to cache image data in sessionStorage:', e);
              }
            }
            
            setState(prev => ({ 
              ...prev, 
              dynamicSrc: desktopUrl, 
              isLoading: false,
              aspectRatio,
              tinyPlaceholder,
              colorPlaceholder,
              contentHash: extractedContentHash,
              isCached: false,
              lastUpdated: imageInfo.lastUpdated
            }));
            return;
          }
        }
        
        // Get placeholders if we didn't fetch them earlier
        if (!fetchPlaceholdersFirst) {
          const placeholders = await placeholdersPromise;
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;
        }
        
        // Get image dimensions for aspect ratio
        const aspectRatio = await getImageAspectRatio(imageUrl);
        let extractedContentHash = null;
        
        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {
          // Ignore URL parsing errors
        }
        
        // Cache this response in sessionStorage for faster subsequent loads
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
        
        if (navigator.onLine) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
          } catch (e) {
            console.warn('Failed to cache image data in sessionStorage:', e);
          }
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
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType, isMobile]);
  
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
