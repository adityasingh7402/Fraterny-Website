
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  // Initialize immediately with current window size to avoid flicker
  React.useEffect(() => {
    const checkIfMobile = () => {
      const isCurrentlyMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isCurrentlyMobile);
      console.log(`[useIsMobile] Window width: ${window.innerWidth}px, detected as: ${isCurrentlyMobile ? 'MOBILE' : 'DESKTOP'}`);
    };
    
    // Set initial value and log it
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
    
    return () => {
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
    console.log('[useIsMobile] Current device state:', isMobile ? 'MOBILE' : 'DESKTOP');
  }, [isMobile])

  return isMobile
}
