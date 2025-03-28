
import { trackPageView } from '@/services/analyticsService';

/**
 * Initializes analytics tracking for the application
 */
export const initializeAnalytics = (): void => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Set up navigation tracking using History API
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  // Override pushState
  history.pushState = function(state, title, url) {
    originalPushState.apply(this, [state, title, url]);
    handleUrlChange(url?.toString() || window.location.pathname);
  };
  
  // Override replaceState
  history.replaceState = function(state, title, url) {
    originalReplaceState.apply(this, [state, title, url]);
    handleUrlChange(url?.toString() || window.location.pathname);
  };
  
  // Listen for popstate events (browser back/forward buttons)
  window.addEventListener('popstate', () => {
    handleUrlChange(window.location.pathname);
  });
};

// Helper to handle URL changes
const handleUrlChange = (url: string): void => {
  const path = url.split('?')[0]; // Remove query parameters
  trackPageView(path);
};
