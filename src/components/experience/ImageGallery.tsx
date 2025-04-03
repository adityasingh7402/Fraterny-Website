
import React, { useEffect, useState } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { ViewportAwareGallery } from '../ui/image/components/ViewportAwareGallery';
import { useImagePreloader } from '@/hooks/useImagePreloader';
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
  // Pre-resolve image keys to URLs for preloading
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Prefetch all images aggressively on mount
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setIsLoading(true);
        const urls = await Promise.all(
          experienceImages.map(img => getImageUrlByKey(img.dynamicKey))
        );
        
        // Filter out any null/undefined results
        const validUrls = urls.filter(Boolean) as string[];
        console.log('[ExperienceGallery] All image URLs resolved:', validUrls.length);
        setImageUrls(validUrls);
      } catch (error) {
        console.error("[ExperienceGallery] Error fetching gallery images:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllImages();
  }, []);
  
  return (
    <section className="w-full overflow-hidden">
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
    </section>
  );
};

export default ImageGallery;
