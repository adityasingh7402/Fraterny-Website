import React, { useState, useEffect, useMemo } from 'react';
import { getImageUrlByKey } from '@/services/images/services/urlService';
import { useIsMobile } from '@/hooks/use-mobile';
import { getImageDataForSEO } from '@/services/images';

interface ResponsiveImageProps {
  dynamicKey: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  seoEnhanced?: boolean;  // Enable SEO features
  showCaption?: boolean;  // Show caption below image
  includeSchema?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  dynamicKey,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  seoEnhanced = false,
  showCaption = false,
  includeSchema = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const [seoData, setSeoData] = useState<any>(null);

  // Load image URL
  useEffect(() => {
    let mounted = true;
    
    // const loadImage = async () => {
    //   try {
    //     const deviceKey = isMobile
    //       ? dynamicKey.endsWith('-mobile') ? dynamicKey : `${dynamicKey}-mobile`
    //       : dynamicKey;
        
    //     const url = await getImageUrlByKey(deviceKey);
        
    //     if (mounted) {
    //       if (url && url !== '/placeholder.svg') {
    //         setImageUrl(url);
    //       } else {
    //         setError(true);
    //       }
    //     }
    //   } catch (err) {
    //     console.error('Error loading image:', err);
    //     if (mounted) {
    //       setError(true);
    //     }
    //   } finally {
    //     if (mounted) {
    //       setIsLoading(false);
    //     }
    //   }
    // };

    const loadImage = async () => {
  try {
    const deviceKey = isMobile
      ? dynamicKey.endsWith('-mobile') ? dynamicKey : `${dynamicKey}-mobile`
      : dynamicKey;
    
    // Fetch URL (existing logic)
    const url = await getImageUrlByKey(deviceKey);
    
    // NEW: Fetch SEO data if enhanced mode is enabled
    if (seoEnhanced) {
      const imageData = await getImageDataForSEO(dynamicKey);
      if (mounted && imageData) {
        setSeoData(imageData.seo);
      }
    }
    
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
  }, [dynamicKey, isMobile, seoEnhanced]);

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

  // SEO-enhanced rendering
if (seoEnhanced && seoData) {
  const enhancedAttributes = {
    ...imageAttributes,
    title: seoData.title || imageAttributes.title,
    'data-keywords': seoData.focusKeywords?.join(', ') || undefined,
    'data-schema-type': seoData.schemaType || 'ImageObject'
  };

  // If showing caption, wrap in figure element
  if (showCaption && seoData.caption) {
    return (
      <figure className={`${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
        <img {...enhancedAttributes} className="" />
        <figcaption className="mt-2 text-sm text-gray-600 italic">
          {seoData.caption}
          {seoData.copyright && (
            <small className="block text-xs text-gray-500 mt-1">
              {seoData.copyright}
            </small>
          )}
        </figcaption>
      </figure>
    );
  }

  // Enhanced image without caption
  return <img {...enhancedAttributes} />;
}

// Default rendering (existing logic)
return <img {...imageAttributes} />;
};

export default ResponsiveImage;
