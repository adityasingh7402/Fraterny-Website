import { ResponsiveImageSource } from '../types';

type ImageSourceResult = {
  resolvedSrc: string | ResponsiveImageSource | undefined;
};

/**
 * Function to resolve the appropriate image source based on available images
 * Strictly respects device-specific image requirements
 */
export const useImageSource = (
  src: string | ResponsiveImageSource | undefined,
  hasDynamicDesktop: boolean,
  hasDynamicMobile: boolean,
  desktopDynamicSrc: string | null,
  mobileDynamicSrc: string | null,
  isMobile: boolean,
): ImageSourceResult => {
  let resolvedSrc = src;
  
  // Handle string src with dynamic sources
  if (typeof src === 'string' || src === undefined) {
    if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
      // Use mobile image if on mobile device and mobile image exists
      resolvedSrc = mobileDynamicSrc;
    } else if (!isMobile && hasDynamicDesktop && desktopDynamicSrc) {
      // Use desktop image if on desktop device and desktop image exists
      resolvedSrc = desktopDynamicSrc;
    }
    // No fallbacks - if mobile image doesn't exist for mobile device, keep original src
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
      // Replace just the mobile source while preserving the rest
      resolvedSrc = {
        ...src,
        mobile: mobileDynamicSrc
      };
    } else if (!isMobile && hasDynamicDesktop && desktopDynamicSrc) {
      // Replace just the desktop source while preserving the rest
      resolvedSrc = {
        ...src,
        desktop: desktopDynamicSrc
      };
    }
    // No fallbacks - if mobile image doesn't exist for mobile device, keep original src
  }
  
  return { resolvedSrc };
};
