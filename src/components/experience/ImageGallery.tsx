
import React, { useEffect, useState, useMemo } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { ViewportAwareGallery } from '../ui/image/components/ViewportAwareGallery';
import { useReactQueryImages } from '@/hooks/useReactQueryImages';
import { supabase } from '@/integrations/supabase/client';
import { isValidImageKey } from '@/services/images/services/url/utils';
import { IMAGE_KEYS } from '@/pages/admin/images/components/upload/constants';

// Enhanced validation function to ensure keys are predefined and valid
const isImageKeyPredefined = (key: string): boolean => {
  // First check that key is a valid format
  if (!isValidImageKey(key)) {
    console.warn(`Invalid image key format: "${key}"`);
    return false;
  }
  
  // Then verify it's in our predefined list
  const isPredefined = IMAGE_KEYS.some(item => item.key === key);
  if (!isPredefined) {
    console.warn(`Image key "${key}" is not in predefined list`);
  }
  
  return isPredefined;
};

// Function to check if images exist in the database with enhanced validation
const checkImagesExist = async (keys: string[]): Promise<Record<string, boolean>> => {
  if (!keys || keys.length === 0) {
    console.warn('No keys provided to checkImagesExist');
    return {};
  }
  
  // Filter out non-predefined keys first
  const validKeys = keys.filter(key => isImageKeyPredefined(key));
  
  if (validKeys.length === 0) {
    console.warn('No valid predefined image keys to check');
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

// Strictly predefined image keys for the experience gallery
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
  
  // Create stable image keys for dependency tracking and validate them
  const imageKeys = useMemo(() => {
    // Validate each key against predefined list
    const keys = experienceImages
      .map(img => img.dynamicKey)
      .filter(key => isImageKeyPredefined(key));
      
    // Log final validated keys
    console.log('ImageGallery: Using predefined image keys:', keys);
    
    // Log any keys that were filtered out
    const invalidKeys = experienceImages
      .map(img => img.dynamicKey)
      .filter(key => !isImageKeyPredefined(key));
      
    if (invalidKeys.length > 0) {
      console.error('ImageGallery: Found non-predefined image keys:', invalidKeys);
    }
    
    return keys;
  }, []);
  
  // Check which image keys exist in the database
  useEffect(() => {
    const checkImages = async () => {
      if (imageKeys.length === 0) {
        console.warn('No valid keys to check existence for');
        return;
      }
      
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
          // Validate the key is predefined
          const isKeyPredefined = isImageKeyPredefined(image.dynamicKey);
          
          // Check if this image exists in the database
          const imageExists = isKeyPredefined && existingKeys[image.dynamicKey];
          
          // Get the URL for this image (if available)
          const imageUrl = isKeyPredefined ? imageUrlsData?.[image.dynamicKey] : null;
          
          console.log(`ImageGallery: Rendering image ${index} with key "${image.dynamicKey}", predefined: ${isKeyPredefined}, exists: ${imageExists}, URL: ${imageUrl || 'none'}`);
          
          return (
            <div key={index} className="aspect-[4/3] w-full">
              {isKeyPredefined && imageExists ? (
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
                    {!isKeyPredefined 
                      ? `Key not in predefined list: ${image.dynamicKey}` 
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
