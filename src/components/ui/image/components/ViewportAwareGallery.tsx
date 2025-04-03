
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface ViewportAwareGalleryProps {
  children: React.ReactNode;
  imageSrcs?: string[];
  preloadThreshold?: number; // How many images ahead to preload
  className?: string;
  priority?: boolean; // New prop to indicate if gallery should be treated as high priority
}

export const ViewportAwareGallery: React.FC<ViewportAwareGalleryProps> = ({
  children,
  imageSrcs,
  preloadThreshold = 3,
  className,
  priority = false,
}) => {
  const [isNearViewport, setIsNearViewport] = useState(priority); // Start as true if priority
  
  const [galleryRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '500px', // Increased to ensure more eager loading
    triggerOnce: false,
    threshold: 0.01, // Trigger with minimal visibility
  });

  // Memoize the image sources to prevent unnecessary re-renders
  const imageSourcesToPreload = useMemo(() => {
    return imageSrcs && imageSrcs.length > 0 ? [...imageSrcs] : undefined;
  }, [imageSrcs]);

  // Track when gallery is approaching viewport - with useCallback to stabilize function reference
  const updateNearViewport = useCallback((isVisible: boolean) => {
    if (isVisible || priority) {
      setIsNearViewport(true);
    }
  }, [priority]);

  // Update near viewport state only when visibility changes
  useEffect(() => {
    updateNearViewport(isVisible);
  }, [isVisible, updateNearViewport]);

  // More controlled logging - only log when state changes
  useEffect(() => {
    console.log(`[ViewportAwareGallery] Near viewport: ${isNearViewport}, Visible: ${isVisible}, Priority: ${priority}`);
  }, [isNearViewport, isVisible, priority]);

  // Preload images when gallery is near viewport
  const { preloadedImages } = useImagePreloader(
    imageSourcesToPreload,
    isNearViewport,
    { 
      priority: priority ? 'high' : 'low',
      // Use inline functions but they depend on stable values
      onLoad: useCallback((src) => console.log(`[Gallery] Preloaded: ${src}`), []),
      onError: useCallback((src, error) => console.error(`[Gallery] Failed to preload: ${src}`, error), [])
    }
  );

  // Pass stable attributes to the DOM
  const galleryAttributes = useMemo(() => ({
    'data-preloaded': preloadedImages.size > 0 ? 'true' : 'false',
    'data-near-viewport': isNearViewport ? 'true' : 'false',
    'data-visible': isVisible ? 'true' : 'false',
    'data-priority': priority ? 'true' : 'false',
  }), [isNearViewport, isVisible, preloadedImages.size, priority]);

  return (
    <div 
      ref={galleryRef} 
      className={`viewport-aware-gallery ${className || ''}`}
      {...galleryAttributes}
    >
      {children}
    </div>
  );
};
