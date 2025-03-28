
/**
 * Performance monitoring utility to track and report Web Vitals
 */

// Core Web Vitals thresholds
const LCP_THRESHOLD = 2500; // ms
const FID_THRESHOLD = 100;  // ms
const CLS_THRESHOLD = 0.1;  // score

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return; // Not supported
  }

  try {
    // LCP monitoring
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      const lcpGood = lcp < LCP_THRESHOLD;
      
      console.log(`LCP: ${lcp.toFixed(1)}ms - ${lcpGood ? 'Good ✅' : 'Needs improvement ⚠️'}`);
      
      // Report to analytics if desired
      // reportMetric('LCP', lcp);
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID monitoring
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Cast to PerformanceEventTiming to access processingStart
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        const fidGood = fid < FID_THRESHOLD;
        
        console.log(`FID: ${fid.toFixed(1)}ms - ${fidGood ? 'Good ✅' : 'Needs improvement ⚠️'}`);
        
        // Report to analytics if desired
        // reportMetric('FID', fid);
      });
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
    
    // CLS monitoring
    let clsValue = 0;
    let clsEntries: LayoutShift[] = [];
    
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry) => {
        // Cast to LayoutShift to access hadRecentInput and value
        const layoutShift = entry as LayoutShift;
        
        // Only count layout shifts without recent user input
        if (!layoutShift.hadRecentInput) {
          const firstSessionEntry = clsEntries.length === 0;
          const timestampDelta = firstSessionEntry ? 0 : layoutShift.startTime - clsEntries[clsEntries.length - 1].startTime;
          
          // If entry is within 1 second of the previous entry, add to current session
          if (firstSessionEntry || timestampDelta < 1000) {
            clsEntries.push(layoutShift);
            clsValue += layoutShift.value;
          } else {
            // Start a new session
            clsEntries = [layoutShift];
            clsValue = layoutShift.value;
          }
        }
      });
      
      const clsGood = clsValue < CLS_THRESHOLD;
      console.log(`CLS: ${clsValue.toFixed(3)} - ${clsGood ? 'Good ✅' : 'Needs improvement ⚠️'}`);
      
      // Report to analytics if desired
      // reportMetric('CLS', clsValue);
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Navigation timing
    const pageLoadTime = () => {
      setTimeout(() => {
        const navigations = performance.getEntriesByType('navigation');
        if (navigations.length > 0) {
          const navigation = navigations[0] as PerformanceNavigationTiming;
          // Total page load time
          const pageLoad = navigation.loadEventEnd - navigation.startTime;
          console.log(`Page load time: ${pageLoad.toFixed(0)}ms`);
          
          // Time to first byte
          const ttfb = navigation.responseStart - navigation.requestStart;
          console.log(`TTFB: ${ttfb.toFixed(0)}ms`);
          
          // DOM content loaded
          const dcl = navigation.domContentLoadedEventEnd - navigation.startTime;
          console.log(`DOM Content Loaded: ${dcl.toFixed(0)}ms`);
        }
      }, 0);
    };
    
    window.addEventListener('load', pageLoadTime);
    
    // Return a cleanup function
    return () => {
      // Cleanup observers when component unmounts
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener('load', pageLoadTime);
    };
  } catch (error) {
    console.error('Error setting up performance monitoring:', error);
  }
}

// Track resource timing for specific resources
export function trackResourceTiming(resourceType: string) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const url = entry.name;
        if (url.includes(resourceType)) {
          const duration = entry.duration;
          console.debug(`Resource timing [${resourceType}]: ${duration.toFixed(0)}ms - ${url.split('/').pop()}`);
        }
      });
    });
    
    resourceObserver.observe({ type: 'resource', buffered: true });
    
    // Return cleanup function
    return () => resourceObserver.disconnect();
  } catch (error) {
    console.error('Error tracking resource timing:', error);
    return undefined;
  }
}

// Define missing types from the Performance API
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
