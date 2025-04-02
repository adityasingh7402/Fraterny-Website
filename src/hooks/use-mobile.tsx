
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export type MobileDetectionState = {
  isDetecting: boolean;
  isMobile: boolean;
}

export function useIsMobile(): MobileDetectionState {
  const [state, setState] = React.useState<MobileDetectionState>({
    isDetecting: true, // Start with detecting state
    isMobile: false
  });

  // Initialize immediately with current window size to avoid flicker
  React.useEffect(() => {
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
    
    // Small timeout to ensure DOM is fully ready
    // This helps with SSR and initial render consistency
    const initialDetectionTimeout = setTimeout(() => {
      checkIfMobile();
    }, 10);
    
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
