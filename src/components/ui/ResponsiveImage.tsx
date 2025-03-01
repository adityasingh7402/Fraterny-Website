
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
  
  // Inline fallback image as a data URI of a simple placeholder
  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4ODg4Ij5JbWFnZSB1bmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
  
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
