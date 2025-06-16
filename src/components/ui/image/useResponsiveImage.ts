import { useState, useEffect } from 'react';
import {
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getImagePlaceholdersByKey,
  clearImageUrlCacheForKey,
  getGlobalCacheVersion
} from '@/services/images';
import { toast } from 'sonner';
import { ImageLoadingState, ImageCacheEntry, MemoryCacheEntry } from './types';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';
// FIXED: Memory cache fallback for when sessionStorage fails on mobile devices
const memoryCache = new Map<string, MemoryCacheEntry>();

// Helper function to clean expired memory cache entries
const cleanMemoryCache = () => {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.timestamp + entry.ttl) {
      memoryCache.delete(key);
    }
  }
};

// Clean memory cache every 5 minutes
setInterval(cleanMemoryCache, 5 * 60 * 1000);

// Add a localStorage-based mutex for atomic sessionStorage writes
const acquireLock = async (lockKey: string): Promise<boolean> => {
  const lockValue = Date.now().toString();
  localStorage.setItem(lockKey, lockValue);
  await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to allow other tabs to detect the lock
  return localStorage.getItem(lockKey) === lockValue;
};

const releaseLock = (lockKey: string): void => {
  localStorage.removeItem(lockKey);
};

// Refactor cacheImageInfo to use the mutex
const cacheImageInfo = async (cacheKey: string, imageInfo: ImageCacheEntry): Promise<void> => {
  const lockKey = `lock:${cacheKey}`;
  const lockAcquired = await acquireLock(lockKey);
  if (!lockAcquired) {
    console.warn('Failed to acquire lock for cache write, skipping cache update');
    return;
  }
  try {
    if (navigator.onLine) {
      sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
      console.log(`💾 [Cache] Stored in sessionStorage: ${cacheKey}`);
    }
  } catch (storageError) {
    console.warn('📱 [Mobile Fix] SessionStorage failed, using memory cache fallback:', storageError);
    memoryCache.set(cacheKey, {
      data: imageInfo,
      timestamp: Date.now(),
      ttl: 10 * 60 * 1000 // 10 minutes
    });
    console.log(`🧠 [Memory Cache] Stored in memory: ${cacheKey}`);
  } finally {
    releaseLock(lockKey);
  }
};

// Refactor getCachedImageInfo to use the mutex
// const getCachedImageInfo = async (cacheKey: string): Promise<ImageCacheEntry | null> => {
//   const lockKey = `lock:${cacheKey}`;
//   const lockAcquired = await acquireLock(lockKey);
//   if (!lockAcquired) {
//     console.warn('Failed to acquire lock for cache read, falling back to memory cache');
//     const memoryEntry = memoryCache.get(cacheKey);
//     if (memoryEntry && Date.now() <= memoryEntry.timestamp + memoryEntry.ttl) {
//       console.log(`🧠 [Cache Hit] Memory cache: ${cacheKey}`);
//       return memoryEntry.data;
//     }
//     return null;
//   }
//   try {
//     const cached = sessionStorage.getItem(cacheKey);
//     if (cached) {
//       console.log(`💾 [Cache Hit] SessionStorage: ${cacheKey}`);
//       return JSON.parse(cached) as ImageCacheEntry;
//     }
//   } catch (e) {
//     console.warn('📱 [Mobile Fix] SessionStorage read failed, checking memory cache');
//   } finally {
//     releaseLock(lockKey);
//   }
//   const memoryEntry = memoryCache.get(cacheKey);
//   if (memoryEntry && Date.now() <= memoryEntry.timestamp + memoryEntry.ttl) {
//     console.log(`🧠 [Cache Hit] Memory cache: ${cacheKey}`);
//     return memoryEntry.data;
//   }
//   console.log(`❌ [Cache Miss] No cache found for: ${cacheKey}`);
//   return null;
// };

// Mobile-specific keys
// const mobilePreferredKeys = new Set([
//   'hero-background',
//   'pricing-hero',
//   'process-hero',
//   'experience-hero',
// ]);
// Dynamic mobile key detection - checks if a mobile variant exists
const hasMobileVariant = (key: string): boolean => {
  // Common patterns for mobile variants
  const mobilePatterns = [
    'hero-background', 'pricing-hero', 'process-hero', 'experience-hero',
    'villalab-', 'tribe-', 'depth-', 'experience-'
  ];
  
  return mobilePatterns.some(pattern => key.startsWith(pattern) || key.includes(pattern));
};

// Add type for placeholders
interface ImagePlaceholders {
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
}

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

  // Listen for cross-tab cache version changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'global_cache_version') {
        console.log('Global cache version changed, invalidating local cache');
        clearImageUrlCacheForKey(e.key);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // FIXED: Smart viewport change detection that doesn't over-clear cache
  useEffect(() => {
    // Only process if we have a dynamicKey and mobile state is defined
    if (isMobile !== undefined && dynamicKey) {
      const storageKey = `viewport_state_${dynamicKey}`;
      const previousState = sessionStorage.getItem(storageKey);
      
      // Parse previous state to get more context
      let previousData = null;
      try {
        previousData = previousState ? JSON.parse(previousState) : null;
      } catch (e) {
        console.warn('Could not parse previous viewport state');
      }
      
      const currentData = {
        isMobile,
        timestamp: Date.now(),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      };
      
      console.log(`📱 [Viewport Check] ${dynamicKey}: isMobile=${isMobile}, previous=${previousData?.isMobile}`);
      
      // Only clear cache if this is a SIGNIFICANT viewport change with debounce
      if (previousData && 
          previousData.isMobile !== isMobile && 
          Math.abs(currentData.timestamp - previousData.timestamp) > 1000) { // 1 second debounce
        
        console.log(`🔄 [Significant Change] Viewport change detected for ${dynamicKey}, clearing cache`);
        // Only clear THIS image's cache with reason tracking
        clearImageUrlCacheForKey(dynamicKey, 'significant-viewport-change');
      } else if (previousData?.isMobile === isMobile) {
        console.log(`⚡ [No Change] Mobile state unchanged for ${dynamicKey}, keeping cache`);
      } else if (!previousData) {
        console.log(`📝 [Initial Load] First time loading ${dynamicKey}, no cache clear needed`);
      } else {
        console.log(`⏱️ [Debounced] Change too recent for ${dynamicKey}, skipping cache clear`);
      }
      
      // Store current state for future comparisons
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(currentData));
      } catch (e) {
        console.warn('Could not store viewport state - storage may be full');
        // Don't fail the whole operation if storage is full
      }
    }
  }, [isMobile, dynamicKey]);

  useEffect(() => {
    if (!dynamicKey) return;

    // const shouldUseMobile = isMobile && mobilePreferredKeys.has(dynamicKey);
    // const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;
    const shouldUseMobile = isMobile && hasMobileVariant(dynamicKey);
    const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;

    // setState(prev => ({ ...prev, isLoading: true, error: false }));
    // Don't start loading until mobile detection is complete (isMobile is not undefined)
    if (isMobile === undefined) {
      // Set initial loading state but don't fetch yet
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: false,
        dynamicSrc: null 
      }));
      return; // Wait for mobile detection to complete
    }
    // ADD THESE DEBUG LOGS HERE:
    console.log(`🔍 [useResponsiveImage] Debug Info:`, {
      dynamicKey,
      isMobile,
      hasMobileVariant: hasMobileVariant(dynamicKey),
      shouldUseMobile,
      effectiveKey,
      timestamp: new Date().toISOString()
    });

    setState(prev => ({ ...prev, isLoading: true, error: false }));

    // if (process.env.NODE_ENV === 'development') {
    //   clearImageUrlCacheForKey(effectiveKey);
    // }
    if (process.env.NODE_ENV === 'development' && debugCache) {
      console.log(`🔧 [Dev Mode] Debug cache enabled, clearing cache for ${effectiveKey}`);
      clearImageUrlCacheForKey(effectiveKey);
    }

    // FIXED: Improved fetchImageWithRetry with better error handling
    const fetchImageWithRetry = async (
      key: string,
      size?: 'small' | 'medium' | 'large',
      attempt = 1,
      startTime = Date.now()
    ): Promise<ImageCacheEntry> => {
      const maxRetries = 4;
      const baseDelay = 500;
      const maxDelay = 2000;
      const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15

      try {
        console.log(`⏱️ [Performance] Starting network request at ${Date.now() - startTime}ms (attempt ${attempt})`);
        
        // Get URL with proper error handling
        let url: string | undefined;
        try {
          url = size 
            ? await getImageUrlByKeyAndSize(key, size)
            : await getImageUrlByKey(key);
        } catch (urlError) {
          console.error(`❌ [URL Error] Failed to get URL for ${key}:`, urlError);
          throw new Error(`Failed to get URL: ${urlError instanceof Error ? urlError.message : 'Unknown error'}`);
        }

        // Validate URL
        if (!url) {
          throw new Error(`No URL returned for image key: ${key}`);
        }

        // Validate URL format
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error(`Invalid URL format for ${key}: ${url}`);
        }

        // Get placeholders with proper error handling
        let placeholders: ImagePlaceholders;
        try {
          placeholders = await getImagePlaceholdersByKey(key);
        } catch (placeholderError) {
          console.warn(`⚠️ [Placeholder Error] Using fallback for ${key}:`, placeholderError);
          placeholders = {
            tinyPlaceholder: null,
            colorPlaceholder: null
          };
        }

        // Get global version
        const globalVersion = await getGlobalCacheVersion();

        // Create image entry
        const imageEntry: ImageCacheEntry = {
          url,
          aspectRatio: undefined, // Will be updated when image loads
          tinyPlaceholder: placeholders.tinyPlaceholder,
          colorPlaceholder: placeholders.colorPlaceholder,
          contentHash: null, // Will be updated when image loads
          lastUpdated: new Date().toISOString(), // Convert to string
          timestamp: Date.now(),
          globalVersion,
          networkType: network.effectiveConnectionType,
          deviceType: isMobile ? 'mobile' : 'desktop',
          estimatedSize: isMobile ? '~200KB' : '~800KB'
        };

        // Cache the entry
        await cacheImageInfo(key, imageEntry);
        console.log(`✅ [Success] Image loaded and cached: ${key}`);

        return imageEntry;

      } catch (error) {
        console.error(`❌ [Retry ${attempt}/${maxRetries}] Error at ${Date.now() - startTime}ms for ${key}:`, error);

        if (attempt < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) * jitter, maxDelay);
          console.log(`🔄 [Retry] Retrying ${key} in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchImageWithRetry(key, size, attempt + 1, startTime);
        }

        console.error(`💥 [Final Failure] Failed to load image ${key} after ${maxRetries} attempts:`, error);
        throw error;
      }
    };

    // Update the fetch function to use the new fetchImageWithRetry
    const fetchImage = async (key: string, size?: 'small' | 'medium' | 'large'): Promise<void> => {
      try {
        const imageEntry = await fetchImageWithRetry(key, size);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: false,
          dynamicSrc: imageEntry.url,
          aspectRatio: imageEntry.aspectRatio,
          tinyPlaceholder: imageEntry.tinyPlaceholder,
          colorPlaceholder: imageEntry.colorPlaceholder,
          contentHash: imageEntry.contentHash,
          isCached: true,
          lastUpdated: imageEntry.lastUpdated
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: true
        }));
        toast.error(`Failed to load image: ${key}`);
      }
    };

    // FIXED: Remove arbitrary delays and prioritize based on image importance
    const isHeroImage = dynamicKey?.includes('hero-background');
    const isCriticalImage = isHeroImage || dynamicKey?.includes('hero-') || 
                           dynamicKey?.includes('pricing-hero') || 
                           dynamicKey?.includes('experience-hero');
    
    // Only delay on truly slow connections, and only for non-critical images
    const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
      ? (isCriticalImage ? 0 : 200)  // Reduced delay for non-critical images
      : 0; // No delays for 3G and above

    console.log(`🚀 [Priority] ${effectiveKey} is critical: ${isCriticalImage}, connection: ${network.effectiveConnectionType}, delay: ${delay}ms`);

    const startTime = performance.now();
    console.log(`⏱️ [Performance] Starting image load for ${effectiveKey} at ${startTime}ms`);

    // Add a small delay to prevent rapid re-renders
    const smallDelay = 100;
    const timeoutId = setTimeout(() => {
      fetchImage(effectiveKey, size).catch(error => {
        console.error('Error in fetchImage:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: true
        }));
      });
    }, smallDelay);

    return () => clearTimeout(timeoutId);
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType, isMobile]);

  return state;
};

// const getImageAspectRatio = (url: string): Promise<number | undefined> => {
//   return new Promise(resolve => {
//     if (url === '/placeholder.svg') {
//       resolve(16 / 9);
//       return;
//     }

//     const img = new Image();
//     img.onload = () => resolve(img.width / img.height);
//     img.onerror = () => resolve(undefined);
//     img.src = url;
//   });
// };