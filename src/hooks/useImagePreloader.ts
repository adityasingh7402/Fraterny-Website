import { useEffect, useRef, useState, useCallback } from 'react';
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
  
  // Use ref to track loaded images instead of directly updating state in event handlers
  const loadedImagesRef = useRef<Set<string>>(new Set());
  // Track images that are currently in the loading process to prevent duplicates
  const loadingImagesRef = useRef<Set<string>>(new Set());
  const [loadingStatus, setLoadingStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  
  // Memoize callbacks to prevent recreation on every render
  const handleImageLoad = useCallback((src: string) => {
    if (!loadedImagesRef.current.has(src)) {
      loadedImagesRef.current.add(src);
      loadingImagesRef.current.delete(src);
      
      // Batch state updates
      setLoadingStatus(prev => ({ ...prev, [src]: 'loaded' }));
      onLoad?.(src);
    }
  }, [onLoad]);
  
  const handleImageError = useCallback((src: string, error: Error) => {
    loadingImagesRef.current.delete(src);
    
    // Batch state updates
    setLoadingStatus(prev => ({ ...prev, [src]: 'error' }));
    onError?.(src, error);
  }, [onError]);
  
  useEffect(() => {
    // Skip if disabled or no images to load
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
    
    // Filter out already loaded/loading images and empty/invalid URLs
    const imagesToLoad = imageSrcs
      .filter(src => src && src.trim() !== '' && 
              !loadedImagesRef.current.has(src) && 
              !loadingImagesRef.current.has(src))
      .filter(src => !src.startsWith('data:') && !src.includes('placeholder'));
    
    if (imagesToLoad.length === 0) {
      return;
    }
    
    // Log only once per batch
    if (imagesToLoad.length > 0) {
      console.log(`[ImagePreloader] Preloading ${imagesToLoad.length} images (priority: ${priority})`);
    }
    
    // Update loading status for all images
    const newStatus: Record<string, 'loading' | 'loaded' | 'error'> = {};
    imagesToLoad.forEach(src => {
      loadingImagesRef.current.add(src);
      newStatus[src] = 'loading';
    });
    
    // Batch update loading status
    setLoadingStatus(prev => ({ ...prev, ...newStatus }));
    
    // Keep track of created elements for proper cleanup
    const createdElements: HTMLLinkElement[] = [];
    
    // Create link rel=preload elements for high priority images
    if (priority === 'high' && typeof document !== 'undefined') {
      imagesToLoad.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.crossOrigin = 'anonymous';
        
        // Store reference for cleanup
        createdElements.push(link);
        
        // Use stable callback references to avoid recreation on render
        link.onload = () => handleImageLoad(src);
        link.onerror = (e) => handleImageError(src, new Error(`Failed to preload image: ${src}`));
        
        document.head.appendChild(link);
      });
    } 
    // Use Image objects for lower priority preloading
    else {
      // Schedule preloading with appropriate delay
      const delay = priority === 'auto' ? 100 : 300;
      
      // Store timeout ID for cleanup
      const timeoutId = setTimeout(() => {
        imagesToLoad.forEach(src => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          // Use stable callback references
          img.onload = () => handleImageLoad(src);
          img.onerror = () => handleImageError(src, new Error(`Failed to preload image: ${src}`));
          
          img.src = src;
        });
      }, delay);
      
      // Return cleanup function to cancel timeout if component unmounts
      return () => {
        clearTimeout(timeoutId);
      };
    }
    
    // Return cleanup function to remove created elements
    return () => {
      createdElements.forEach(element => {
        if (element.parentNode) {
          // Remove event listeners before removing from DOM
          element.onload = null;
          element.onerror = null;
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [
    enabled, 
    // Stringify array for stable dependency comparison
    imageSrcs ? JSON.stringify(imageSrcs) : null, 
    priority, 
    network.saveDataEnabled, 
    network.effectiveConnectionType,
    handleImageLoad,
    handleImageError
  ]);
  
  return {
    preloadedImages: loadedImagesRef.current,
    loadingStatus
  };
}
