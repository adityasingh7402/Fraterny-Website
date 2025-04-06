
import * as React from "react"

const MOBILE_BREAKPOINT = 768

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
    
    // Create the media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler for media query changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add listener for resize/media query changes
    mql.addEventListener("change", onChange)
    
    // Also listen for resize events as a fallback
    window.addEventListener('resize', onChange)
    
    // Clean up
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])

  // Debugging log to check mobile detection
  React.useEffect(() => {
    console.log(`[useIsMobile] Device detected as: ${isMobile ? 'mobile' : 'desktop'}, width: ${typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px`)
  }, [isMobile])

  return isMobile
}
