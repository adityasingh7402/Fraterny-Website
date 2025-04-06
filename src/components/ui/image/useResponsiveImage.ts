import { useState, useEffect } from 'react';
import { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize, 
  clearImageUrlCacheForKey,
  getGlobalCacheVersion
} from '@/services/images';
import { toast } from 'sonner';
import { ImageLoadingState } from './types';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useImageCache } from './hooks/useImageCache';
import { getImageAspectRatio } from './hooks/useImageAspectRatio';
import { usePlaceholderStrategy } from './hooks/usePlaceholderStrategy';
import { useNetworkLoadingStrategy } from './hooks/useNetworkLoadingStrategy';

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
  const { getCachedImageData, saveImageToCache, shouldClearCacheInDevelopment } = useImageCache();
  const { shouldFetchPlaceholdersFirst, fetchPlaceholders } = usePlaceholderStrategy();
  const { getLoadingDelay } = useNetworkLoadingStrategy();
  
  // Fetch dynamic image if dynamicKey is provided
  useEffect(() => {
    if (!dynamicKey) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    
    // Clear cache for this key to ensure we get fresh data in development
    if (shouldClearCacheInDevelopment()) {
      clearImageUrlCacheForKey(dynamicKey);
    }
    
    const fetchImage = async () => {
      try {
        // Get the global cache version for proper cache coordination
        const globalVersion = await getGlobalCacheVersion();
        
        // Create a cache key that includes size and version
        const cacheKey = `perfcache:${dynamicKey}:${size || 'original'}:${globalVersion || ''}`;
        
        // Check if we have a valid cached version
        const cachedImageInfo = getCachedImageData(cacheKey);
        
        if (cachedImageInfo) {
          if (debugCache) console.log(`Using cached image data for ${dynamicKey}`);
          
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
        
        // Determine if we should prioritize placeholders on slow connections
        const fetchPlaceholdersFirst = shouldFetchPlaceholdersFirst();
        
        // Get placeholders for better user experience on slow connections
        let tinyPlaceholder = null;
        let colorPlaceholder = null;
        
        if (fetchPlaceholdersFirst) {
          const placeholders = await fetchPlaceholders(dynamicKey, true);
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
        
        // Fetch placeholders in parallel with the main image for faster loading
        const placeholdersPromise = !fetchPlaceholdersFirst ? 
          fetchPlaceholders(dynamicKey) : 
          Promise.resolve({ tinyPlaceholder, colorPlaceholder });
        
        // Load the image URL based on whether size is specified
        let imageUrl: string;
        let extractedContentHash = null;
        
        // If size is specified, try to get that specific size
        if (size) {
          imageUrl = await getImageUrlByKeyAndSize(dynamicKey, size);
          extractedContentHash = extractContentHashFromUrl(imageUrl);
          
          if (imageUrl === '/placeholder.svg') {
            throw new Error(`Image not found for key: ${dynamicKey}`);
          }
        } else {
          // Otherwise get the original image
          imageUrl = await getImageUrlByKey(dynamicKey);
          extractedContentHash = extractContentHashFromUrl(imageUrl);
          
          if (imageUrl === '/placeholder.svg') {
            throw new Error(`Image not found for key: ${dynamicKey}`);
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
        
        // Prepare image info for caching
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
        
        // Save to cache for future use
        saveImageToCache(cacheKey, imageInfo);
        
        // Update component state with the loaded image
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
        
        // Don't show toast for development placeholder images
        if (!dynamicKey.includes('villalab-') && !dynamicKey.includes('hero-') && !dynamicKey.includes('experience-')) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
            duration: 3000,
          });
        }
      }
    };
    
    // Add appropriate delay based on network conditions
    const delay = getLoadingDelay();
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
 * Extract content hash from image URL
 */
const extractContentHashFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || null;
  } catch (err) {
    // Ignore URL parsing errors
    return null;
  }
};
