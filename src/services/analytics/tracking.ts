
import { getAnalyticsFromStorage, saveAnalyticsToStorage } from './storage';
import { ANALYTICS_SESSION_KEY, ANALYTICS_LAST_VISIT_KEY } from './types';

// Track a page view
export const trackPageView = (path: string): void => {
  try {
    // Get existing analytics or initialize
    const analytics = getAnalyticsFromStorage();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Initialize today's entry if it doesn't exist
    if (!analytics.dailyTraffic[today]) {
      analytics.dailyTraffic[today] = {
        pageViews: 0,
        uniqueVisitors: 0,
        signups: 0,
        paths: {}
      };
    }
    
    // Increment page views
    analytics.dailyTraffic[today].pageViews++;
    
    // Track page path
    if (!analytics.dailyTraffic[today].paths[path]) {
      analytics.dailyTraffic[today].paths[path] = {
        views: 0,
        exits: 0,
        timeOnPage: 0,
        title: document.title || path
      };
    }
    analytics.dailyTraffic[today].paths[path].views++;
    
    // Set entry page for session if this is first page
    const sessionId = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    if (!sessionId) {
      analytics.entryPages = analytics.entryPages || {};
      analytics.entryPages[path] = (analytics.entryPages[path] || 0) + 1;
    }
    
    // Check if this is a new session
    trackSession(analytics, today);
    
    // Save updated analytics
    saveAnalyticsToStorage(analytics);
    
    // Track time on page for previous page
    const lastPage = sessionStorage.getItem('last_page');
    const lastPageTime = sessionStorage.getItem('last_page_time');
    
    if (lastPage && lastPage !== path && lastPageTime) {
      const timeSpent = Date.now() - parseInt(lastPageTime, 10);
      const timeSpentSeconds = Math.floor(timeSpent / 1000);
      
      if (timeSpentSeconds > 0 && timeSpentSeconds < 3600) { // Ignore if over an hour (probably left tab open)
        analytics.dailyTraffic[today].paths[lastPage] = analytics.dailyTraffic[today].paths[lastPage] || {
          views: 0,
          exits: 0,
          timeOnPage: 0,
          title: lastPage
        };
        
        analytics.dailyTraffic[today].paths[lastPage].timeOnPage += timeSpentSeconds;
        saveAnalyticsToStorage(analytics);
      }
    }
    
    // Set current page as last page
    sessionStorage.setItem('last_page', path);
    sessionStorage.setItem('last_page_time', Date.now().toString());
    
    // Clear any existing heartbeat interval
    clearHeartbeatInterval();
    
    // Start heartbeat to track time on current page
    startHeartbeatTracking(path);
    
    // Listen for page exit
    window.addEventListener('beforeunload', () => {
      const analytics = getAnalyticsFromStorage();
      const today = new Date().toISOString().split('T')[0];
      
      // Save final time on page before exit
      updateTimeOnCurrentPage(path);
      
      if (analytics.dailyTraffic[today] && analytics.dailyTraffic[today].paths[path]) {
        analytics.dailyTraffic[today].paths[path].exits++;
        saveAnalyticsToStorage(analytics);
      }
    }, { once: true });
    
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track a user signup
export const trackSignup = (): void => {
  try {
    const analytics = getAnalyticsFromStorage();
    const today = new Date().toISOString().split('T')[0];
    
    if (!analytics.dailyTraffic[today]) {
      analytics.dailyTraffic[today] = {
        pageViews: 0,
        uniqueVisitors: 0,
        signups: 0,
        paths: {}
      };
    }
    
    analytics.dailyTraffic[today].signups++;
    saveAnalyticsToStorage(analytics);
  } catch (error) {
    console.error('Error tracking signup:', error);
  }
};

// Track user sessions
export const trackSession = (analytics: any, today: string): void => {
  const sessionId = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  const lastVisit = localStorage.getItem(ANALYTICS_LAST_VISIT_KEY);
  
  // If no session or last visit was more than 30 minutes ago, consider it a new session
  const isNewSession = !sessionId || 
    (lastVisit && (Date.now() - parseInt(lastVisit, 10)) > 30 * 60 * 1000);
  
  if (isNewSession) {
    // Generate new session ID
    const newSessionId = Date.now().toString();
    sessionStorage.setItem(ANALYTICS_SESSION_KEY, newSessionId);
    
    // Track unique visitor
    analytics.dailyTraffic[today].uniqueVisitors++;
    
    // Track device info
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');
    
    // Initialize device tracking if needed
    if (!analytics.devices) {
      analytics.devices = { desktop: 0, mobile: 0, tablet: 0 };
    }
    analytics.devices[deviceType]++;
    
    // Track source (simplified - would normally use referrer or utm parameters)
    const source = document.referrer 
      ? (new URL(document.referrer).hostname || 'direct') 
      : 'direct';
    
    // Initialize sources tracking if needed
    if (!analytics.sources) {
      analytics.sources = {};
    }
    if (!analytics.sources[source]) {
      analytics.sources[source] = 0;
    }
    analytics.sources[source]++;
  }
  
  // Update last visit time
  localStorage.setItem(ANALYTICS_LAST_VISIT_KEY, Date.now().toString());
};

// Heartbeat tracking
let heartbeatInterval: number | undefined;

// Update time spent on current page
const updateTimeOnCurrentPage = (path: string): void => {
  try {
    const lastPageTime = sessionStorage.getItem('last_page_time');
    if (!lastPageTime) return;
    
    const analytics = getAnalyticsFromStorage();
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate time spent since last update
    const now = Date.now();
    const timeSpent = now - parseInt(lastPageTime, 10);
    const timeSpentSeconds = Math.floor(timeSpent / 1000);
    
    // Only update if time is reasonable (less than 5 minutes)
    if (timeSpentSeconds > 0 && timeSpentSeconds < 300) {
      if (analytics.dailyTraffic[today]?.paths?.[path]) {
        analytics.dailyTraffic[today].paths[path].timeOnPage += timeSpentSeconds;
        saveAnalyticsToStorage(analytics);
      }
    }
    
    // Update the last page time to now
    sessionStorage.setItem('last_page_time', now.toString());
  } catch (error) {
    console.error('Error updating time on current page:', error);
  }
};

// Clear existing heartbeat interval
const clearHeartbeatInterval = (): void => {
  if (heartbeatInterval) {
    window.clearInterval(heartbeatInterval);
    heartbeatInterval = undefined;
  }
};

// Start heartbeat tracking for current page
const startHeartbeatTracking = (path: string): void => {
  // Update time every 15 seconds if the page is active
  heartbeatInterval = window.setInterval(() => {
    if (!document.hidden) {
      updateTimeOnCurrentPage(path);
    }
  }, 15000); // 15 seconds
  
  // Also update when visibility changes (tab becomes active)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateTimeOnCurrentPage(path);
    }
  });
};
