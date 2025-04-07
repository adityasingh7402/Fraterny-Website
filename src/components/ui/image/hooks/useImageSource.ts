
import { ResponsiveImageSource } from '../types';

type ImageSourceResult = {
  resolvedSrc: string | ResponsiveImageSource | undefined;
};

/**
 * Function to resolve the appropriate image source based on available images
 * Now accepts isMobile as a parameter instead of using a hook internally
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
    if (hasDynamicDesktop) {
      // For blogs, we use the same image for both mobile and desktop
      // So we prioritize desktop image even on mobile devices if mobile image doesn't exist
      if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
        // Use mobile image if on mobile device and mobile image exists
        resolvedSrc = mobileDynamicSrc;
      } else if (desktopDynamicSrc) {
        // Otherwise use desktop image for both device types
        resolvedSrc = desktopDynamicSrc;
      }
    }
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    if (hasDynamicDesktop) {
      // If we have both desktop and mobile images
      if (hasDynamicMobile && mobileDynamicSrc) {
        // Create a new responsive object with both dynamic sources
        resolvedSrc = {
          mobile: mobileDynamicSrc,
          desktop: desktopDynamicSrc!
        };
      } 
      // If we only have the desktop image, use it for both mobile and desktop
      else if (desktopDynamicSrc) {
        resolvedSrc = {
          mobile: desktopDynamicSrc,
          desktop: desktopDynamicSrc
        };
      }
    }
  }
  
  return { resolvedSrc };
};
