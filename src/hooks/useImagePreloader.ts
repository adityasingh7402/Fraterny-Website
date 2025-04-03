
import { useEffect, useRef, useState } from 'react';
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
  const [loadingStatus, setLoadingStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  
  useEffect(() => {
    if (!enabled || !imageSrcs || imageSrcs.length === 0) {
      return;
    }
    
    // Skip preloading on extremely poor connections unless high priority
    const poorConnection = network.saveDataEnabled && 
      ['slow-2g', '2g'].includes(network.effectiveConnectionType);
    
    if (poorConnection && priority !== 'high') {
      console.log('[ImagePreloader] Skipping preload due to poor network conditions');
      return;
    }
    
    // Filter out already loaded images and empty/invalid URLs
    const imagesToLoad = imageSrcs
      .filter(src => src && src.trim() !== '' && !loadedImagesRef.current.has(src))
      .filter(src => !src.startsWith('data:') && !src.includes('placeholder'));
    
    if (imagesToLoad.length === 0) {
      return;
    }
    
    console.log(`[ImagePreloader] Preloading ${imagesToLoad.length} images (priority: ${priority})`);
    
    // Update loading status for all images
    const newStatus: Record<string, 'loading' | 'loaded' | 'error'> = {};
    imagesToLoad.forEach(src => {
      newStatus[src] = 'loading';
    });
    setLoadingStatus(prev => ({ ...prev, ...newStatus }));
    
    // Create link rel=preload elements for high priority images
    if (priority === 'high' && typeof document !== 'undefined') {
      imagesToLoad.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.crossOrigin = 'anonymous'; // Add cross-origin support
        link.onload = () => {
          loadedImagesRef.current.add(src);
          setLoadingStatus(prev => ({ ...prev, [src]: 'loaded' }));
          onLoad?.(src);
        };
        link.onerror = (e) => {
          setLoadingStatus(prev => ({ ...prev, [src]: 'error' }));
          onError?.(src, new Error(`Failed to preload image: ${src}`));
        };
        document.head.appendChild(link);
      });
    } 
    // Use Image for lower priority preloading
    else {
      // Schedule preloading with appropriate delay
      const delay = priority === 'auto' ? 100 : 300;
      
      const timeoutId = setTimeout(() => {
        imagesToLoad.forEach(src => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // Add cross-origin support
          img.onload = () => {
            loadedImagesRef.current.add(src);
            setLoadingStatus(prev => ({ ...prev, [src]: 'loaded' }));
            onLoad?.(src);
          };
          img.onerror = () => {
            setLoadingStatus(prev => ({ ...prev, [src]: 'error' }));
            onError?.(src, new Error(`Failed to preload image: ${src}`));
          };
          img.src = src;
        });
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [imageSrcs, enabled, priority, network.saveDataEnabled, network.effectiveConnectionType, onLoad, onError]);
  
  return {
    preloadedImages: loadedImagesRef.current,
    loadingStatus
  };
}
