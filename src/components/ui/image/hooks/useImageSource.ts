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
  
  console.log('useImageSource inputs:', { 
    isMobile, 
    hasDynamicMobile,
    mobileDynamicSrc,
    hasDynamicDesktop,
    desktopDynamicSrc,
    srcType: typeof src 
  });
  
  // Handle string src with dynamic sources
  if (typeof src === 'string' || src === undefined) {
    if (hasDynamicDesktop) {
      // On mobile device with mobile image available, prioritize mobile image
      if (isMobile && hasDynamicMobile && mobileDynamicSrc) {
        console.log('Using mobile dynamic source for string src on mobile');
        resolvedSrc = mobileDynamicSrc;
      } 
      // Otherwise use desktop image
      else if (desktopDynamicSrc) {
        console.log('Using desktop dynamic source for string src');
        resolvedSrc = desktopDynamicSrc;
      }
    }
  } 
  // Handle responsive object src
  else if (typeof src === 'object') {
    console.log('Processing responsive object:', src);
    
    // If on mobile device, prioritize mobile source regardless of dynamic availability
    if (isMobile) {
      console.log('On mobile device, prioritizing mobile source');
      
      // If we have a dynamic mobile source, use it
      if (hasDynamicMobile && mobileDynamicSrc) {
        console.log('Using dynamic mobile source on mobile');
        resolvedSrc = mobileDynamicSrc;
      }
      // Otherwise use the mobile property from the responsive object if available
      else if (src.mobile) {
        console.log('Using static mobile source on mobile');
        resolvedSrc = src.mobile;
      }
      // Fallback to desktop source if no mobile source available
      else if (hasDynamicDesktop && desktopDynamicSrc) {
        console.log('No mobile source, falling back to dynamic desktop source');
        resolvedSrc = desktopDynamicSrc;
      }
      else {
        console.log('No mobile source, falling back to static desktop source');
        resolvedSrc = src.desktop;
      }
    }
    // On desktop, use desktop source
    else {
      console.log('On desktop device, using desktop source');
      // If we have a dynamic desktop source, use it
      if (hasDynamicDesktop && desktopDynamicSrc) {
        console.log('Using dynamic desktop source on desktop');
        resolvedSrc = desktopDynamicSrc;
      }
      // Otherwise use the desktop property from the responsive object
      else {
        console.log('Using static desktop source on desktop');
        resolvedSrc = src.desktop;
      }
    }
  }
  
  console.log('Final resolved source:', resolvedSrc);
  return { resolvedSrc };
};
