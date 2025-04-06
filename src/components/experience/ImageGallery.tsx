
import React, { useEffect, useState, useMemo } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { ViewportAwareGallery } from '../ui/image/components/ViewportAwareGallery';
import { useReactQueryImages } from '@/hooks/useReactQueryImages';
import { supabase } from '@/integrations/supabase/client';
import { isValidImageKey } from '@/services/images/services/url/utils';

// Function to check if images exist in the database
const checkImagesExist = async (keys: string[]): Promise<Record<string, boolean>> => {
  if (!keys || keys.length === 0) return {};
  
  // Filter out invalid keys first
  const validKeys = keys.filter(key => isValidImageKey(key));
  
  if (validKeys.length === 0) {
    console.warn('No valid image keys provided to checkImagesExist');
    return {};
  }
  
  try {
    const { data, error } = await supabase
      .from('website_images')
      .select('key')
      .in('key', validKeys);
      
    if (error) {
      console.error('Error checking image existence:', error);
      return {};
    }
    
    // Create a map of which keys exist
    const existsMap: Record<string, boolean> = {};
    keys.forEach(key => {
      existsMap[key] = false; // Default to false
    });
    
    // Set true for keys that were found
    if (data) {
      data.forEach(img => {
        existsMap[img.key] = true;
      });
    }
    
    console.log('Image existence check results:', existsMap);
    return existsMap;
  } catch (error) {
    console.error('Unexpected error checking images:', error);
    return {};
  }
};

// Updated to use ONLY predefined, valid image keys
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
  const [existingKeys, setExistingKeys] = useState<Record<string, boolean>>({});
  
  // Create stable image keys for dependency tracking and log them for debugging
  const imageKeys = useMemo(() => {
    // Filter out any invalid keys
    const keys = experienceImages
      .map(img => img.dynamicKey)
      .filter(key => isValidImageKey(key));
      
    console.log('ImageGallery: Using valid image keys:', keys);
    
    // Log any invalid keys
    const invalidKeys = experienceImages
      .map(img => img.dynamicKey)
      .filter(key => !isValidImageKey(key));
      
    if (invalidKeys.length > 0) {
      console.error('ImageGallery: Found invalid image keys:', invalidKeys);
    }
    
    return keys;
  }, []);
  
  // Check which image keys exist in the database
  useEffect(() => {
    const checkImages = async () => {
      const results = await checkImagesExist(imageKeys);
      setExistingKeys(results);
    };
    
    checkImages();
  }, [imageKeys]);
  
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
    if (!imageUrlsData || Object.keys(imageUrlsData).length === 0 || imageKeys.length === 0) {
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
          // Validate the key first
          const isKeyValid = isValidImageKey(image.dynamicKey);
          
          // Check if this image exists in the database
          const imageExists = isKeyValid && existingKeys[image.dynamicKey];
          
          // Log the URL we're using for this image
          const imageUrl = imageUrlsData?.[image.dynamicKey];
          console.log(`ImageGallery: Rendering image ${index} with key "${image.dynamicKey}", valid: ${isKeyValid}, exists: ${imageExists}, URL: ${imageUrl || 'none'}`);
          
          return (
            <div key={index} className="aspect-[4/3] w-full">
              {isKeyValid && imageExists ? (
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
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 text-sm px-2 text-center">
                    {!isKeyValid 
                      ? `Invalid key format: ${image.dynamicKey}` 
                      : "Image not available"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </ViewportAwareGallery>
    );
  }, [imageUrlsData, existingKeys, imageKeys]);
  
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
