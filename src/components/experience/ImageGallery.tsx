
import React, { useEffect, useState, useMemo, useRef } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { ViewportAwareGallery } from '../ui/image/components/ViewportAwareGallery';
import { getImageUrlByKey } from '@/services/images';

// Updated to use ONLY dynamic keys
const experienceImages = [
  {
    dynamicKey: "experience-villa-retreat",
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-workshop",
    alt: "Interactive workshop session with driven professionals",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-networking",
    alt: "Meaningful networking among ambitious individuals",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-collaboration",
    alt: "Collaborative problem-solving in a premium environment",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-evening-session",
    alt: "Evening mastermind session with panoramic views",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-gourmet-dining",
    alt: "Gourmet dining experience bringing people together",
    width: 800,
    height: 600
  }
];

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a persistent cache for image promises
  const imagePromisesRef = useRef<Record<string, Promise<string>>>({});
  
  // Create stable image keys for dependency tracking
  const imageKeys = useMemo(() => 
    experienceImages.map(img => img.dynamicKey), 
    []
  );
  
  // Use abortController for cleanup
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    
    const fetchAllImages = async () => {
      try {
        setIsLoading(true);
        
        // Only create new promises for keys that don't have promises yet
        imageKeys.forEach(key => {
          if (!imagePromisesRef.current[key]) {
            imagePromisesRef.current[key] = getImageUrlByKey(key);
          }
        });
        
        // Only wait for all promises if the component is still mounted
        if (signal.aborted) return;
        
        const results = await Promise.all(
          imageKeys.map(key => imagePromisesRef.current[key])
        );
        
        // Check if component is still mounted before updating state
        if (signal.aborted) return;
        
        // Filter out any null/undefined results
        const validUrls = results.filter(Boolean) as string[];
        console.log('[ExperienceGallery] All image URLs resolved:', validUrls.length);
        setImageUrls(validUrls);
      } catch (error) {
        // Only log error if not due to component unmounting
        if (!signal.aborted) {
          console.error("[ExperienceGallery] Error fetching gallery images:", error);
        }
      } finally {
        // Only update loading state if component is still mounted
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchAllImages();
    
    // Cleanup to prevent state updates after unmount
    return () => {
      abortController.abort();
    };
  }, [imageKeys]); // Only depends on imageKeys which is memoized and stable
  
  // Memoize the gallery component to prevent recreation on renders
  const GalleryComponent = useMemo(() => (
    <ViewportAwareGallery 
      imageSrcs={imageUrls}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1"
      priority={true} // Mark as high priority content
    >
      {experienceImages.map((image, index) => (
        <div key={index} className="aspect-[4/3] w-full">
          <ResponsiveImage 
            dynamicKey={image.dynamicKey}
            alt={image.alt}
            className="w-full h-full"
            loading={index < 2 ? "eager" : "lazy"}
            priority={index < 2} // First two images have higher priority
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            objectFit="cover"
          />
        </div>
      ))}
    </ViewportAwareGallery>
  ), [imageUrls]);
  
  return (
    <section className="w-full overflow-hidden">
      {GalleryComponent}
    </section>
  );
};

export default ImageGallery;
