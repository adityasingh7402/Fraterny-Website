
import * as React from "react"

// Align with Tailwind's md breakpoint
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a proper value based on window width if available, false as a safe fallback
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false; // Safe default for SSR
  });

  React.useEffect(() => {
    // Create media query list for detecting changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Handler function to update state
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add listener for screen size changes
    mql.addEventListener("change", onChange);
    
    // Set initial value
    onChange();
    
    // Clean up listener when component unmounts
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return the boolean value directly, no need for double negation
  return isMobile;
}
