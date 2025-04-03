
import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface ViewportAwareGalleryProps {
  children: React.ReactNode;
  imageSrcs?: string[];
  preloadThreshold?: number; // How many images ahead to preload
  className?: string;
}

export const ViewportAwareGallery: React.FC<ViewportAwareGalleryProps> = ({
  children,
  imageSrcs,
  preloadThreshold = 3,
  className,
}) => {
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [galleryRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '400px', // Start loading when gallery is 400px from viewport
    triggerOnce: false,
  });

  // Track when gallery is approaching viewport
  useEffect(() => {
    if (isVisible) {
      setIsNearViewport(true);
    }
  }, [isVisible]);

  // Preload images when gallery is near viewport
  const { preloadedImages } = useImagePreloader(
    imageSrcs,
    isNearViewport,
    { priority: 'low' }
  );

  return (
    <div ref={galleryRef} className={className}>
      {/* 
        Pass visibility status to children that might need it
        via React.Children.map if needed
      */}
      {children}
    </div>
  );
};
