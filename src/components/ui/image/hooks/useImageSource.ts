import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveImageSource } from '../types';

type ImageSourceResult = {
  resolvedSrc: string | ResponsiveImageSource | undefined;
};

/**
 * Hook to resolve the appropriate image source based on device and available images
 */
export const useImageSource = (
  src: string | ResponsiveImageSource | undefined,
  hasDynamicDesktop: boolean,
  hasDynamicMobile: boolean,
  desktopDynamicSrc: string | null,
  mobileDynamicSrc: string | null,
): ImageSourceResult => {
  const isMobile = useIsMobile();
  let resolvedSrc = src;
  
  // Handle string src with dynamic sources
  if (typeof src === 'string' || src === undefined) {
    if (hasDynamicDesktop) {
      if (isMobile && hasDynamicMobile) {
        // Use mobile image if on mobile device and mobile image exists
        resolvedSrc = mobileDynamicSrc!;
      } else {
        // Otherwise use desktop image
        resolvedSrc = desktopDynamicSrc!;
      }
    }
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    if (hasDynamicDesktop && hasDynamicMobile) {
      // Create a new responsive object with both dynamic sources
      resolvedSrc = {
        mobile: mobileDynamicSrc!,
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
