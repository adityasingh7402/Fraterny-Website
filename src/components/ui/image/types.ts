import { ResponsiveImageSource } from '../types';

// Add objectFit to the ResponsiveImageProps interface
export interface ResponsiveImageProps {
  src: string | ResponsiveImageSource;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  dynamicKey?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  debugCache?: boolean;
}
