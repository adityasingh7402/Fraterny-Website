
import React from 'react';

interface ResponsiveImageProps {
  src: {
    mobile: string;
    tablet?: string;
    desktop: string;
  };
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
}

/**
 * ResponsiveImage component that serves different image sizes based on screen width
 * For best performance, provide WebP images with proper sizes
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  onClick
}: ResponsiveImageProps) => {
  // Use tablet image if provided, otherwise fall back to desktop
  const tabletSrc = src.tablet || src.desktop;
  
  // Fallback image as a placeholder
  const fallbackImage = "/placeholder.svg";
  
  // Handle image loading error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    e.currentTarget.src = fallbackImage;
  };
  
  // Create a props object for the img element and conditionally add fetchPriority
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: src.desktop, // Fallback for browsers that don't support <picture>
    alt,
    className,
    loading,
    decoding: "async",
    onError: handleError
  };
  
  // Only add fetchPriority if it exists (TypeScript will handle this correctly)
  if (fetchPriority) {
    imgProps.fetchPriority = fetchPriority;
  }
  
  return (
    <picture onClick={onClick}>
      <source media="(max-width: 640px)" srcSet={src.mobile} />
      <source media="(max-width: 1024px)" srcSet={tabletSrc} />
      <source media="(min-width: 1025px)" srcSet={src.desktop} />
      <img {...imgProps} />
    </picture>
  );
};

export default ResponsiveImage;
