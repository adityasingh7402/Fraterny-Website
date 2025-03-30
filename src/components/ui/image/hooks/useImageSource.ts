
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
  isMobile: boolean, // Now passed as a parameter instead of using the hook
): ImageSourceResult => {
  let resolvedSrc = src;
  
  // Handle string src with dynamic sources
  if (typeof src === 'string' || src === undefined) {
    if (hasDynamicDesktop) {
      if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
        // Use mobile image if on mobile device and mobile image exists
        resolvedSrc = mobileDynamicSrc;
      } else {
        // Otherwise use desktop image
        resolvedSrc = desktopDynamicSrc!;
      }
    }
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    if (hasDynamicDesktop && hasDynamicMobile && mobileDynamicSrc) {
      // Create a new responsive object with both dynamic sources
      resolvedSrc = {
        mobile: mobileDynamicSrc,
        desktop: desktopDynamicSrc!
      };
    } else if (hasDynamicDesktop) {
      // If only desktop exists, use it for both
      resolvedSrc = {
        mobile: desktopDynamicSrc!,
        desktop: desktopDynamicSrc!
      };
    }
    // else keep original responsive object
  }
  
  return { resolvedSrc };
};
