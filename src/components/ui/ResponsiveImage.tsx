
import React, { useEffect, useState } from 'react';
import { getImageUrlByKey } from '@/services/imageService';

interface ResponsiveImageProps {
  src: {
    mobile: string;
    tablet?: string;
    desktop: string;
  } | string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  dynamicKey?: string; // New prop for fetching from Supabase by key
}

/**
 * ResponsiveImage component that serves different image sizes based on screen width
 * For best performance, provide WebP images with proper sizes
 * Can now load images from Supabase storage by providing a dynamicKey
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  onClick,
  dynamicKey
}: ResponsiveImageProps) => {
  const [dynamicSrc, setDynamicSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!dynamicKey);
  
  // Fetch dynamic image if dynamicKey is provided
  useEffect(() => {
    if (dynamicKey) {
      setIsLoading(true);
      getImageUrlByKey(dynamicKey)
        .then(url => {
          setDynamicSrc(url);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(`Failed to load image with key ${dynamicKey}:`, error);
          setIsLoading(false);
        });
    }
  }, [dynamicKey]);
  
  // If we're still loading a dynamic image, show a loading placeholder
  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} aria-label={`Loading ${alt}`}></div>
    );
  }
  
  // If we have a dynamicSrc, use that instead of the props.src
  const imageSrc = dynamicSrc || src;
  
  // If imageSrc is a string (from dynamicKey), use the same image for all sizes
  if (typeof imageSrc === 'string') {
    // Create a props object for the img element and conditionally add fetchPriority
    const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: imageSrc,
      alt,
      className,
      loading,
      decoding: "async",
      onError: (e) => {
        console.warn(`Failed to load image: ${e.currentTarget.src}`);
        e.currentTarget.src = "/placeholder.svg";
      }
    };
    
    if (fetchPriority) {
      imgProps.fetchPriority = fetchPriority;
    }
    
    return <img {...imgProps} onClick={onClick} />;
  }
  
  // Use tablet image if provided, otherwise fall back to desktop
  const tabletSrc = imageSrc.tablet || imageSrc.desktop;
  
  // Handle image loading error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    e.currentTarget.src = "/placeholder.svg";
  };
  
  // Create a props object for the img element and conditionally add fetchPriority
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: imageSrc.desktop, // Fallback for browsers that don't support <picture>
    alt,
    className,
    loading,
    decoding: "async",
    onError: handleError
  };
  
  // Only add fetchPriority if it exists
  if (fetchPriority) {
    imgProps.fetchPriority = fetchPriority;
  }
  
  return (
    <picture onClick={onClick}>
      <source media="(max-width: 640px)" srcSet={imageSrc.mobile} />
      <source media="(max-width: 1024px)" srcSet={tabletSrc} />
      <source media="(min-width: 1025px)" srcSet={imageSrc.desktop} />
      <img {...imgProps} />
    </picture>
  );
};

export default ResponsiveImage;
