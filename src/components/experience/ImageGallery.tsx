
import React, { useEffect, useState, useMemo } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { ViewportAwareGallery } from '../ui/image/components/ViewportAwareGallery';
import { useReactQueryImages } from '@/hooks/useReactQueryImages';

// Updated to use ONLY dynamic keys - added console logging to help with debugging
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

/**
 * Optimized ImageGallery that leverages React Query for caching
 * and reduces redundant API calls
 */
const ImageGallery = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Create stable image keys for dependency tracking and log them for debugging
  const imageKeys = useMemo(() => {
    const keys = experienceImages.map(img => img.dynamicKey);
    console.log('ImageGallery: Using image keys:', keys);
    return keys;
  }, []);
  
  // Use React Query's built-in URL fetching
  const { useMultipleImageUrls } = useReactQueryImages();
  const { data: imageUrlsData, isLoading: urlsLoading } = useMultipleImageUrls(imageKeys);
  
  // Log when we receive URL data
  useEffect(() => {
    if (imageUrlsData) {
      console.log('ImageGallery: Received image URLs:', imageUrlsData);
    }
  }, [imageUrlsData]);
  
  // Update loading state based on URL fetching status
  useEffect(() => {
    setIsLoading(urlsLoading);
  }, [urlsLoading]);
  
  // Memoize the gallery component to prevent recreation on renders
  const GalleryComponent = useMemo(() => {
    // If no URLs are available yet, return an empty gallery
    if (!imageUrlsData || Object.keys(imageUrlsData).length === 0) {
      console.log('ImageGallery: No image URLs available yet, showing placeholders');
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          {experienceImages.map((_, index) => (
            <div key={index} className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
          ))}
        </div>
      );
    }
    
    console.log('ImageGallery: Rendering gallery with URLs:', imageUrlsData);
    
    return (
      <ViewportAwareGallery 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1"
        priority={true} // Mark as high priority content
      >
        {experienceImages.map((image, index) => {
          // Log the URL we're using for this image
          const imageUrl = imageUrlsData[image.dynamicKey];
          console.log(`ImageGallery: Rendering image ${index} with key "${image.dynamicKey}", URL: ${imageUrl || 'none'}`);
          
          return (
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
          );
        })}
      </ViewportAwareGallery>
    );
  }, [imageUrlsData]);
  
  return (
    <section className="w-full overflow-hidden">
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 min-h-[300px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index} 
              className="aspect-[4/3] w-full bg-gray-100 animate-pulse rounded"
            />
          ))}
        </div>
      ) : (
        GalleryComponent
      )}
    </section>
  );
};

export default ImageGallery;
