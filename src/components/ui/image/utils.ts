
/**
 * Utility functions for image components
 */

/**
 * Create standardized props for image elements
 */
export const createImageProps = (
  src: string,
  alt: string,
  className?: string,
  loading: 'lazy' | 'eager' = 'lazy',
  sizes?: string,
  width?: number,
  height?: number,
  fallbackSrc?: string,
  fetchPriority?: 'high' | 'low' | 'auto'
) => {
  // Validate src to ensure it's not empty
  if (!src || src.trim() === '') {
    console.warn('Empty image src provided, using fallback');
    src = fallbackSrc || '/placeholder.svg';
  }

  // Basic props every image should have
  const props: {
    src: string;
    alt: string;
    className: string;
    loading: 'lazy' | 'eager';
    style: React.CSSProperties;
    width?: number;
    height?: number;
    sizes?: string;
    fetchpriority?: 'high' | 'low' | 'auto';
  } = {
    src,
    alt: alt || 'Image', // Always provide alt text
    className: className || '',
    loading,
    style: {} as React.CSSProperties
  };

  // Add width and height if provided for better performance
  if (width) props.width = width;
  if (height) props.height = height;
  
  // Add sizes attribute for responsive images if provided
  if (sizes) props.sizes = sizes;

  // Additional props for improved performance
  if (fetchPriority) {
    // @ts-ignore - This is a valid attribute but TypeScript doesn't know about it
    props.fetchpriority = fetchPriority;
  }

  return props;
};
