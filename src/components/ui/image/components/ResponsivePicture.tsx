
import React, { useState, useEffect, SyntheticEvent, CSSProperties } from 'react';

interface ResponsivePictureProps {
  src: {
    mobile?: string;
    tablet?: string;
    desktop: string;
  };
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  mobileCutoff?: string;
  tabletCutoff?: string;
}

/**
 * ResponsivePicture component for delivering optimized images based on screen size
 */
export const ResponsivePicture = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  onLoad,
  onError,
  width,
  height,
  sizes = '100vw',
  mobileCutoff = '640px',
  tabletCutoff = '1024px',
}: ResponsivePictureProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src.desktop, src.tablet, src.mobile]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) onError(e);
  };

  const imgStyle: CSSProperties = {
    display: loaded ? 'block' : 'none',
  };

  // Image dimensions
  if (width) {
    imgStyle.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    imgStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  if (error) {
    return (
      <img
        src="/placeholder.svg"
        alt={alt}
        className={className}
        style={imgStyle}
        width={width}
        height={height}
      />
    );
  }

  return (
    <picture className={className}>
      {src.mobile && (
        <source srcSet={src.mobile} media={`(max-width: ${mobileCutoff})`} />
      )}
      {src.tablet && (
        <source
          srcSet={src.tablet}
          media={`(min-width: ${mobileCutoff}) and (max-width: ${tabletCutoff})`}
        />
      )}
      <source srcSet={src.desktop} media={`(min-width: ${tabletCutoff})`} />
      <img
        src={src.desktop}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        onClick={() => {}}
        width={width}
        height={height}
        sizes={sizes}
        style={imgStyle}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  );
};
