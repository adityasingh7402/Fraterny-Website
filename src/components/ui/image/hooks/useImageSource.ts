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
      // On mobile device with mobile image available, prioritize mobile image
      if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
        resolvedSrc = mobileDynamicSrc;
      } 
      // Otherwise use desktop image
      else if (desktopDynamicSrc) {
        resolvedSrc = desktopDynamicSrc;
      }
    }
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    // If dynamic sources are available, use them and override the static sources
    if (hasDynamicDesktop) {
      // Create a new responsive object with dynamic sources
      resolvedSrc = {
        // For mobile view, prefer the mobile dynamic image if available
        mobile: (isMobile && hasDynamicMobile && mobileDynamicSrc) ? mobileDynamicSrc : 
                (mobileDynamicSrc || src.mobile),
        
        // For desktop, use the desktop dynamic image
        desktop: desktopDynamicSrc || src.desktop
      };
    }
    // If no dynamic sources but on mobile device, ensure we use the mobile property
    else if (isMobile) {
      // Ensure mobile source is prioritized on mobile devices
      resolvedSrc = src.mobile || src.desktop;
    }
  }
  
  return { resolvedSrc };
};
