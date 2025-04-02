
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export type MobileDetectionState = {
  isDetecting: boolean;
  isMobile: boolean;
}

export function useIsMobile(): MobileDetectionState {
  // Initialize with server-safe values
  const [state, setState] = React.useState<MobileDetectionState>(() => {
    // Check if we can access window during initial render
    if (typeof window !== 'undefined') {
      const isCurrentlyMobile = window.innerWidth < MOBILE_BREAKPOINT;
      return {
        // Still mark as detecting briefly to allow for hydration consistency
        isDetecting: true,
        isMobile: isCurrentlyMobile
      };
    }
    
    return {
      isDetecting: true,
      isMobile: false
    };
  });

  // Use layout effect for synchronous detection before paint
  // This runs before useEffect and before the browser paints
  React.useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkIfMobile = () => {
      const isCurrentlyMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setState({
        isDetecting: false, // Detection complete
        isMobile: isCurrentlyMobile
      });
      console.log(`[useIsMobile] Window width: ${window.innerWidth}px, detected as: ${isCurrentlyMobile ? 'MOBILE' : 'DESKTOP'}`);
    };
    
    // Execute immediately for fastest possible detection
    checkIfMobile();
    
    const handleResize = () => {
      checkIfMobile();
    }
    
    // Add event listener for resize
    window.addEventListener('resize', handleResize)
    
    // Also check on orientation change for mobile devices
    window.addEventListener('orientationchange', handleResize)
    
    // Create a matchMedia instance for more reliable updates
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    if (mql.addEventListener) {
      mql.addEventListener('change', handleResize)
    } else {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Complete detection after a very short delay to ensure proper hydration
    const initialDetectionTimeout = setTimeout(() => {
      if (state.isDetecting) {
        checkIfMobile();
      }
    }, 5); // Reduced from 10ms to 5ms for faster detection
    
    return () => {
      clearTimeout(initialDetectionTimeout);
      window.removeEventListener('resize', handleResize) 
      window.removeEventListener('orientationchange', handleResize)
      
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleResize)
      } else {
        // Fallback for older browsers
        mql.removeListener(handleResize)
      }
    }
  }, [])

  // For debugging
  React.useEffect(() => {
    console.log(`[useIsMobile] Current device detection state:`, state.isDetecting ? 'DETECTING' : (state.isMobile ? 'MOBILE' : 'DESKTOP'));
  }, [state])

  return state
}
