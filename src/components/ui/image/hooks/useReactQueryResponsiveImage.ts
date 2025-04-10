import { useQuery } from '@tanstack/react-query';
import { getImageUrlByKeyAndSize } from '@/services/images';
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
      const desktopUrl = await getImageUrlByKeyAndSize(key, 'large');
      const mobileUrl = await getImageUrlByKeyAndSize(key, 'small');
      const tabletUrl = await getImageUrlByKeyAndSize(key, 'medium');

      return {
        desktop: desktopUrl,
        mobile: mobileUrl,
        tablet: tabletUrl
      };
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
