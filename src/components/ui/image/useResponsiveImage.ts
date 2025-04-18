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

// Mobile-specific keys
const mobilePreferredKeys = new Set([
  'hero-background',
  'pricing-hero',
  'process-hero',
  'experience-hero',
]);

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

    const shouldUseMobile = isMobile && mobilePreferredKeys.has(dynamicKey);
    const effectiveKey = shouldUseMobile ? `${dynamicKey}-mobile` : dynamicKey;

    setState(prev => ({ ...prev, isLoading: true, error: false }));

    if (process.env.NODE_ENV === 'development') {
      clearImageUrlCacheForKey(effectiveKey);
    }

    const fetchImage = async () => {
      try {
        const globalVersion = await getGlobalCacheVersion();
        const cacheKey = `perfcache:${effectiveKey}:${size || 'original'}:${globalVersion || ''}`;
        const cachedData = navigator.onLine ? sessionStorage.getItem(cacheKey) : null;

        let cachedImageInfo: any = null;
        const cacheExpiryTime = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType)
          ? 15 * 60 * 1000
          : 5 * 60 * 1000;

        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheAge = Date.now() - parsed.timestamp;
            if (cacheAge < cacheExpiryTime) {
              cachedImageInfo = parsed;
              if (debugCache) console.log(`Using cached image data for ${effectiveKey}`);
            }
          } catch (e) {
            console.error('Error parsing cached image data:', e);
          }
        }

        let tinyPlaceholder = null;
        let colorPlaceholder = null;

        if (['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
          const placeholders = await getImagePlaceholdersByKey(effectiveKey);
          tinyPlaceholder = placeholders.tinyPlaceholder;
          colorPlaceholder = placeholders.colorPlaceholder;

          if (tinyPlaceholder) {
            setState(prev => ({
              ...prev,
              tinyPlaceholder,
              colorPlaceholder,
            }));
          }
        }

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

        if (debugCache) console.log(`Fetching image with key: ${effectiveKey}, size: ${size || 'original'}`);

        const placeholdersPromise = !tinyPlaceholder ? getImagePlaceholdersByKey(effectiveKey) : Promise.resolve({ tinyPlaceholder, colorPlaceholder });

        let imageUrl: string;
        let extractedContentHash = null;

        if (size) {
          imageUrl = await getImageUrlByKeyAndSize(effectiveKey, size);
        } else {
          imageUrl = await getImageUrlByKey(effectiveKey);
        }

        try {
          const urlObj = new URL(imageUrl);
          extractedContentHash = urlObj.searchParams.get('v') || null;
        } catch (err) {}

        const { tinyPlaceholder: tp, colorPlaceholder: cp } = await placeholdersPromise;
        tinyPlaceholder = tinyPlaceholder || tp;
        colorPlaceholder = colorPlaceholder || cp;

        const aspectRatio = await getImageAspectRatio(imageUrl);

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

        if (!['hero-', 'pricing-', 'process-', 'experience-'].some(k => dynamicKey?.includes(k))) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
            duration: 3000,
          });
        }
      }
    };

    const delay = !navigator.onLine || ['slow-2g', '2g'].includes(network.effectiveConnectionType)
      ? 300 : 0;

    const timeoutId = setTimeout(fetchImage, delay);
    return () => clearTimeout(timeoutId);
  }, [dynamicKey, size, debugCache, network.online, network.effectiveConnectionType]);

  return state;
};

const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise(resolve => {
    if (url === '/placeholder.svg') {
      resolve(16 / 9);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img.width / img.height);
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
};
