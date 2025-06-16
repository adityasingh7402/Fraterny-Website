/**
 * Lightweight analytics for homepage - no heavy dependencies
 * This replaces the heavy analytics system imports to reduce bundle size
 */

interface PageView {
  path: string;
  timestamp: number;
  sessionId: string;
}

// Track initialization state
let isInitialized = false;
let originalPushState: typeof history.pushState;
let originalReplaceState: typeof history.replaceState;

// Generate a simple session ID
const getSessionId = (): string => {
  try {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    // Fallback to a simple timestamp if sessionStorage is not available
    return `session_${Date.now()}`;
  }
};

/**
 * Lightweight page view tracking - stores locally without heavy imports
 */
export const trackSimplePageView = (path: string): void => {
  try {
    const pageView: PageView = {
      path,
      timestamp: Date.now(),
      sessionId: getSessionId()
    };
    
    // Get existing page views
    const existingViews = JSON.parse(localStorage.getItem('lightweight_page_views') || '[]');
    
    // Add new view and keep only last 100 entries to prevent storage bloat
    existingViews.push(pageView);
    const recentViews = existingViews.slice(-100);
    
    // Store back to localStorage
    localStorage.setItem('lightweight_page_views', JSON.stringify(recentViews));
    
    // Simple console logging for development
    console.log(`📊 Page view tracked: ${path}`);
  } catch (error) {
    // Fail silently if localStorage is not available
    console.warn('Could not track page view:', error);
  }
};

/**
 * Clean up analytics event listeners and overrides
 */
const cleanupAnalytics = (): void => {
  if (originalPushState && originalReplaceState) {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  }
  window.removeEventListener('popstate', handlePopState);
};

/**
 * Handle popstate events
 */
const handlePopState = (): void => {
  trackSimplePageView(window.location.pathname);
};

/**
 * Initialize lightweight analytics - just sets up basic tracking
 */
export const initializeLightweightAnalytics = (): void => {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }
  
  try {
    // Store original history methods
    originalPushState = history.pushState;
    originalReplaceState = history.replaceState;
    
    // Track initial page view
    trackSimplePageView(window.location.pathname);
    
    // Override pushState
    history.pushState = function(state, title, url) {
      originalPushState.apply(this, [state, title, url]);
      trackSimplePageView(url?.toString() || window.location.pathname);
    };
    
    // Override replaceState  
    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(this, [state, title, url]);
      trackSimplePageView(url?.toString() || window.location.pathname);
    };
    
    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handlePopState);
    
    // Mark as initialized
    isInitialized = true;
    console.log('🚀 Lightweight analytics initialized');
    
    // Clean up on page unload
    window.addEventListener('unload', cleanupAnalytics);
  } catch (error) {
    console.warn('Failed to initialize analytics:', error);
    // Attempt cleanup if initialization failed
    cleanupAnalytics();
  }
};

/**
 * Simple days left counter without heavy imports
 */
export const updateDaysLeftSimple = (registrationDate?: string): void => {
  try {
    if (!registrationDate) {
      return;
    }

    // Parse the target date
    const targetDate = new Date(registrationDate);
    if (isNaN(targetDate.getTime())) {
      return;
    }

    // Calculate days left
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    // Store in localStorage for other components to use
    localStorage.setItem('days_left_count', daysLeft.toString());
    
    console.log(`📅 Days left updated: ${daysLeft}`);
  } catch (error) {
    console.warn('Could not update days left:', error);
  }
};