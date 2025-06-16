import React, { useState, useEffect, useMemo } from 'react';
import { getImageUrlByKey } from '@/services/images/services/urlService';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveImageProps {
  dynamicKey: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  dynamicKey,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '100vw'
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();

  // Load image URL
  useEffect(() => {
    let mounted = true;
    
    const loadImage = async () => {
      try {
        const deviceKey = isMobile
          ? dynamicKey.endsWith('-mobile') ? dynamicKey : `${dynamicKey}-mobile`
          : dynamicKey;
        
        const url = await getImageUrlByKey(deviceKey);
        
        if (mounted) {
          if (url && url !== '/placeholder.svg') {
            setImageUrl(url);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error loading image:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();
    
    return () => {
      mounted = false;
    };
  }, [dynamicKey, isMobile]);

  // Memoize image attributes
  const imageAttributes = useMemo(() => {
    const attrs: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: imageUrl,
      alt,
      className: `${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`,
      loading: priority ? 'eager' : loading,
      decoding: priority ? 'sync' : 'async',
      sizes,
      onLoad: () => setIsLoading(false)
    };

    // Add fetchpriority as a data attribute to avoid React warning
    if (priority) {
      (attrs as any)['data-fetchpriority'] = 'high';
    }

    return attrs;
  }, [imageUrl, alt, className, isLoading, loading, priority, sizes]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return <img {...imageAttributes} />;
};

export default ResponsiveImage;
