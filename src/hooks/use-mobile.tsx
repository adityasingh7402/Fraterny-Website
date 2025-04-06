
import * as React from "react"

// Define mobile breakpoint as a constant that can be exported and reused
export const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with window check to get correct value on first render
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    // Default to false for SSR
    return false
  })

  React.useEffect(() => {
    // Set the initial value immediately
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Create the media query listener for more reliable detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler for media query changes
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Add listener for media query changes
    mql.addEventListener("change", onChange)
    
    // Clean up
    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}
