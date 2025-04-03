
/**
 * Performance monitoring utility for React components and API calls
 */

interface PerformanceData {
  componentRenders: Record<string, number>;
  apiCalls: Record<string, number>;
  renderTime: Record<string, number[]>;
}

// Store performance data
const performanceData: PerformanceData = {
  componentRenders: {},
  apiCalls: {},
  renderTime: {}
};

// Only enable in development mode by default
const isEnabled = process.env.NODE_ENV === 'development';

/**
 * Track a component render
 * @param componentName Name of the component
 * @param renderTime Time taken to render (optional)
 */
export const trackRender = (componentName: string, renderTime?: number): void => {
  if (!isEnabled) return;
  
  if (!performanceData.componentRenders[componentName]) {
    performanceData.componentRenders[componentName] = 0;
  }
  
  performanceData.componentRenders[componentName]++;
  
  if (renderTime) {
    if (!performanceData.renderTime[componentName]) {
      performanceData.renderTime[componentName] = [];
    }
    performanceData.renderTime[componentName].push(renderTime);
  }
};

/**
 * Track an API call
 * @param endpoint API endpoint called
 */
export const trackApiCall = (endpoint: string): void => {
  if (!isEnabled) return;
  
  if (!performanceData.apiCalls[endpoint]) {
    performanceData.apiCalls[endpoint] = 0;
  }
  
  performanceData.apiCalls[endpoint]++;
};

/**
 * Get performance report
 * @returns Current performance data
 */
export const getPerformanceReport = (): PerformanceData => {
  return structuredClone(performanceData);
};

/**
 * Reset all performance counters
 */
export const resetPerformanceCounters = (): void => {
  Object.keys(performanceData.componentRenders).forEach(key => {
    performanceData.componentRenders[key] = 0;
  });
  
  Object.keys(performanceData.apiCalls).forEach(key => {
    performanceData.apiCalls[key] = 0;
  });
  
  Object.keys(performanceData.renderTime).forEach(key => {
    performanceData.renderTime[key] = [];
  });
};

/**
 * Create a performance hook for React components
 * @param componentName Name of the component
 * @returns useRenderTracker hook
 */
export const useRenderTracker = (componentName: string) => {
  if (!isEnabled) return { id: componentName };
  
  const startTime = performance.now();
  
  // Track the render
  trackRender(componentName);
  
  // Return an object that can be used for additional tracking
  return {
    id: componentName,
    endRender: () => {
      const renderTime = performance.now() - startTime;
      // Update render time data
      if (!performanceData.renderTime[componentName]) {
        performanceData.renderTime[componentName] = [];
      }
      performanceData.renderTime[componentName].push(renderTime);
    }
  };
};

/**
 * Print the current performance report to console
 */
export const logPerformanceReport = (): void => {
  if (!isEnabled) return;
  
  console.group('Performance Report');
  
  console.log('Component Render Count:');
  const sortedComponents = Object.entries(performanceData.componentRenders)
    .sort(([, a], [, b]) => b - a);
  
  console.table(
    sortedComponents.reduce((acc, [name, count]) => {
      acc[name] = { count };
      return acc;
    }, {} as Record<string, { count: number }>)
  );
  
  console.log('API Call Count:');
  const sortedApi = Object.entries(performanceData.apiCalls)
    .sort(([, a], [, b]) => b - a);
  
  console.table(
    sortedApi.reduce((acc, [name, count]) => {
      acc[name] = { count };
      return acc;
    }, {} as Record<string, { count: number }>)
  );
  
  console.log('Render Time (Average in ms):');
  const renderTimeAvg = Object.entries(performanceData.renderTime)
    .reduce((acc, [name, times]) => {
      if (times.length > 0) {
        const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
        acc[name] = { avg: Math.round(avg * 100) / 100, samples: times.length };
      }
      return acc;
    }, {} as Record<string, { avg: number, samples: number }>);
  
  console.table(renderTimeAvg);
  
  console.groupEnd();
};

// Expose the API
export default {
  trackRender,
  trackApiCall,
  getPerformanceReport,
  resetPerformanceCounters,
  useRenderTracker,
  logPerformanceReport
};
