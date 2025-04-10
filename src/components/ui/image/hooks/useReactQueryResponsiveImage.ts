import { useQuery } from '@tanstack/react-query';
import { getImageUrlsByKeys } from '@/services/images';
import { ResponsiveImageSource } from '../types';

interface UseReactQueryResponsiveImageOptions {
  key: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  useMobileSrc?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const useReactQueryResponsiveImage = (options: UseReactQueryResponsiveImageOptions) => {
  const {
    key,
    alt,
    className,
    loading = 'lazy',
    fetchPriority,
    onClick,
    fallbackSrc = '/placeholder.svg',
    width,
    height,
    sizes,
    useMobileSrc,
    objectFit = 'cover'
  } = options;

  const { data: urlData, isLoading } = useQuery({
    queryKey: ['image', key],
    queryFn: async () => {
      try {
        // Fetch all sizes in parallel using batch operations
        const [urls, urlsSmall, urlsMedium] = await Promise.all([
          getImageUrlsByKeys([key]),
          getImageUrlsByKeys([key], 'small'),
          getImageUrlsByKeys([key], 'medium')
        ]);

        return {
          desktop: urls[key] || fallbackSrc,
          mobile: urlsSmall[key] || fallbackSrc,
          tablet: urlsMedium[key] || fallbackSrc
        };
      } catch (error) {
        console.error('Error fetching responsive image URLs:', error);
        return {
          desktop: fallbackSrc,
          mobile: fallbackSrc,
          tablet: fallbackSrc
        };
      }
    }
  });

  return {
    sources: urlData,
    alt,
    className,
    loading,
    fetchPriority,
    onClick,
    fallbackSrc,
    width,
    height,
    sizes,
    useMobileSrc,
    objectFit,
    isLoading
  };
};
