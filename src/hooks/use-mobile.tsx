
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  // Initialize immediately with current window size to avoid flicker
  React.useEffect(() => {
    // Set initial value synchronously
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
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
    console.log('useIsMobile hook value:', isMobile)
  }, [isMobile])

  return isMobile
}
