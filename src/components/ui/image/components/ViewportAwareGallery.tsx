
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
  const [debugEnabled, setDebugEnabled] = useState(false);
  
  // Create a more stable ref with a consistent identity
  const [galleryRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '500px', // Increased to ensure more eager loading
    triggerOnce: false,
    threshold: 0.01, // Trigger with minimal visibility
  });

  // Unique identifier for this gallery instance for better logging
  const galleryId = useMemo(() => `gallery-${Math.floor(Math.random() * 10000)}`, []);

  // Memoize the image sources to prevent unnecessary re-renders
  const imageSourcesToPreload = useMemo(() => {
    if (!imageSrcs || imageSrcs.length === 0) return undefined;
    return [...imageSrcs];
  }, [imageSrcs?.length, imageSrcs ? JSON.stringify(imageSrcs) : null]);

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

  // More controlled logging - only log when state changes AND debug is enabled
  useEffect(() => {
    if (debugEnabled) {
      console.log(`[ViewportAwareGallery:${galleryId}] Near viewport: ${isNearViewport}, Visible: ${isVisible}, Priority: ${priority}`);
    }
  }, [isNearViewport, isVisible, priority, debugEnabled, galleryId]);

  // Preload images when gallery is near viewport
  const { preloadedImages } = useImagePreloader(
    imageSourcesToPreload,
    isNearViewport,
    { 
      priority: priority ? 'high' : 'low',
      name: `gallery-${galleryId}`,
      // Use inline functions but they depend on stable values
      onLoad: useCallback((src) => {
        if (debugEnabled) console.log(`[Gallery:${galleryId}] Preloaded: ${src}`);
      }, [debugEnabled, galleryId]),
      onError: useCallback((src, error) => {
        console.error(`[Gallery:${galleryId}] Failed to preload: ${src}`, error);
      }, [galleryId])
    }
  );

  // Pass stable attributes to the DOM
  const galleryAttributes = useMemo(() => ({
    'data-preloaded': preloadedImages.size > 0 ? 'true' : 'false',
    'data-near-viewport': isNearViewport ? 'true' : 'false',
    'data-visible': isVisible ? 'true' : 'false',
    'data-priority': priority ? 'true' : 'false',
    'data-gallery-id': galleryId,
  }), [isNearViewport, isVisible, preloadedImages.size, priority, galleryId]);

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
