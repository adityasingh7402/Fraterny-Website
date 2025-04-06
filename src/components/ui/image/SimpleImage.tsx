
/**
 * Simple responsive image component that uses our unified image system
 */
import React from 'react';
import { useImageUrl } from '@/hooks/useImage';

type SimpleImageProps = {
  src?: string;
  dynamicKey?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  size?: 'small' | 'medium' | 'large';
  loading?: 'eager' | 'lazy';
  onClick?: () => void;
};

export const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  dynamicKey,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  size,
  loading = 'lazy',
  onClick
}) => {
  // If dynamicKey is provided, use our image system to fetch the URL
  const { url, isLoading, error } = useImageUrl(dynamicKey, size);
  
  // Use the url from our system, or fall back to the provided src, or ultimately to placeholder
  const imageSrc = dynamicKey ? (url || '/placeholder.svg') : (src || '/placeholder.svg');
  
  // Set up object-fit and sizing styles
  const style: React.CSSProperties = {
    objectFit,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto'
  };
  
  // Handle loading states
  if (dynamicKey && isLoading) {
    return (
      <div 
        className={`bg-gray-100 animate-pulse ${className}`} 
        style={{ width: style.width, height: style.height }}
        role="img"
        aria-label={`Loading ${alt}`}
      />
    );
  }
  
  // Handle error states
  if (dynamicKey && error) {
    console.warn(`Failed to load image with key: ${dynamicKey}`);
  }
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      onClick={onClick}
    />
  );
};
