
import { useEffect, useRef } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto';
  onLoad?: (src: string) => void;
  onError?: (src: string, error: Error) => void;
}

/**
 * Hook that preloads images before they are needed
 * Adapts preloading strategy based on network conditions
 */
export function useImagePreloader(
  imageSrcs: string[] | null | undefined,
  enabled: boolean = true,
  options: PreloadOptions = {}
) {
  const { priority = 'low', onLoad, onError } = options;
  const network = useNetworkStatus();
  const loadedImagesRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    if (!enabled || !imageSrcs || imageSrcs.length === 0) {
      return;
    }
    
    // Don't preload if on slow connection and data saver is enabled
    if (network.saveDataEnabled && ['slow-2g', '2g'].includes(network.effectiveConnectionType)) {
      console.log('[ImagePreloader] Skipping preload due to poor network conditions');
      return;
    }
    
    // Filter out already loaded images
    const imagesToLoad = imageSrcs.filter(src => !loadedImagesRef.current.has(src));
    
    if (imagesToLoad.length === 0) {
      return;
    }
    
    console.log(`[ImagePreloader] Preloading ${imagesToLoad.length} images`);
    
    // Create link rel=preload elements for high priority images
    if (priority === 'high' && typeof document !== 'undefined') {
      imagesToLoad.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.onload = () => {
          loadedImagesRef.current.add(src);
          onLoad?.(src);
        };
        link.onerror = (e) => {
          onError?.(src, new Error(`Failed to preload image: ${src}`));
        };
        document.head.appendChild(link);
      });
    } 
    // Use Image for lower priority preloading
    else {
      // Schedule preloading with some delay for low priority images
      const delay = priority === 'auto' ? 200 : 500;
      
      const timeoutId = setTimeout(() => {
        imagesToLoad.forEach(src => {
          const img = new Image();
          img.onload = () => {
            loadedImagesRef.current.add(src);
            onLoad?.(src);
          };
          img.onerror = () => {
            onError?.(src, new Error(`Failed to preload image: ${src}`));
          };
          img.src = src;
        });
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [imageSrcs, enabled, priority, network.saveDataEnabled, network.effectiveConnectionType]);
  
  return {
    preloadedImages: loadedImagesRef.current,
  };
}
