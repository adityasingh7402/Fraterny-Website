
import React, { useEffect, useState } from 'react';
import { useMultipleImageUrls } from '@/hooks/useDirectImage';
import { SimpleImage } from '@/components/ui/image/SimpleImage';
import { isValidImageKey } from '@/services/images/validation';
import ImageDiagnostics from '@/components/diagnostics/ImageDiagnostics';

// Strictly predefined image keys for the experience gallery
const experienceImages = [
  {
    key: "experience-villa-retreat",
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
    width: 800,
    height: 600
  },
  {
    key: "experience-workshop",
    alt: "Interactive workshop session with driven professionals",
    width: 800,
    height: 600
  },
  {
    key: "experience-networking",
    alt: "Meaningful networking among ambitious individuals",
    width: 800,
    height: 600
  },
  {
    key: "experience-collaboration",
    alt: "Collaborative problem-solving in a premium environment",
    width: 800,
    height: 600
  },
  {
    key: "experience-evening-session",
    alt: "Evening mastermind session with panoramic views",
    width: 800,
    height: 600
  },
  {
    key: "experience-gourmet-dining",
    alt: "Gourmet dining experience bringing people together",
    width: 800,
    height: 600
  }
];

/**
 * Simplified ImageGallery that uses our direct image hooks
 */
const SimpleImageGallery = () => {
  const imageKeys = experienceImages.map(img => img.key);
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  
  // Use our simplified hook to get all image URLs at once
  const { urls, isLoading, error } = useMultipleImageUrls(imageKeys);
  
  // Log diagnostic information
  useEffect(() => {
    console.log("[SimpleImageGallery] Image keys:", imageKeys);
    console.log("[SimpleImageGallery] Loaded URLs:", urls);
    console.log("[SimpleImageGallery] Loading state:", isLoading);
    console.log("[SimpleImageGallery] Error state:", error);
  }, [imageKeys, urls, isLoading, error]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 min-h-[300px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="aspect-[4/3] w-full bg-gray-100 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }
  
  return (
    <section className="w-full overflow-hidden">
      {/* Enhanced diagnostic panel with more information */}
      {showDiagnostics && (
        <div className="mb-8">
          <div className="bg-blue-50 p-4 mb-4 rounded border border-blue-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Image System Diagnostics</h3>
              <button 
                onClick={() => setShowDiagnostics(false)} 
                className="text-sm text-blue-600 underline"
              >
                Hide
              </button>
            </div>
            <p className="text-sm mt-1">
              This panel helps diagnose image loading issues and will be removed in production.
            </p>
          </div>
          <ImageDiagnostics />
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
        {experienceImages.map((image, index) => (
          <div key={index} className="aspect-[4/3] w-full">
            <SimpleImage 
              dynamicKey={image.key}
              alt={image.alt}
              className="w-full h-full"
              width={image.width}
              height={image.height}
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimpleImageGallery;
