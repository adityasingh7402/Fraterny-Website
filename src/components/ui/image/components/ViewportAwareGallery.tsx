
import React, { useEffect, useState } from 'react';
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

  // Track when gallery is approaching viewport
  useEffect(() => {
    if (isVisible || priority) {
      setIsNearViewport(true);
    }
  }, [isVisible, priority]);

  // Log visibility state for debugging
  useEffect(() => {
    console.log(`[ViewportAwareGallery] Near viewport: ${isNearViewport}, Visible: ${isVisible}, Priority: ${priority}`);
  }, [isNearViewport, isVisible, priority]);

  // Preload images when gallery is near viewport
  const { preloadedImages } = useImagePreloader(
    imageSrcs,
    isNearViewport,
    { 
      priority: priority ? 'high' : 'low',
      onLoad: (src) => console.log(`[Gallery] Preloaded: ${src}`),
      onError: (src, error) => console.error(`[Gallery] Failed to preload: ${src}`, error)
    }
  );

  return (
    <div 
      ref={galleryRef} 
      className={`viewport-aware-gallery ${className || ''}`}
      data-preloaded={preloadedImages.size > 0 ? 'true' : 'false'}
      data-near-viewport={isNearViewport ? 'true' : 'false'}
      data-visible={isVisible ? 'true' : 'false'}
      data-priority={priority ? 'true' : 'false'}
    >
      {children}
    </div>
  );
};
