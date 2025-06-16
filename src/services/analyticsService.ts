
// export * from './analytics';
// Lightweight analytics re-exports to prevent import chain explosion
// This file maintains backwards compatibility while reducing bundle size

// Import only the lightweight tracking function
import { trackSimplePageView } from '@/utils/lightweightAnalytics';

// For backwards compatibility with existing code, we'll re-export the lightweight version
// This prevents the heavy analytics system from being imported everywhere
export const trackPageView = trackSimplePageView;

// Lightweight signup tracking (if needed by other components)
export const trackSignup = (email?: string) => {
  try {
    const signupEvent = {
      event: 'signup',
      timestamp: Date.now(),
      email: email ? 'provided' : 'not_provided', // Don't store actual email for privacy
    };
    
    const events = JSON.parse(localStorage.getItem('lightweight_events') || '[]');
    events.push(signupEvent);
    localStorage.setItem('lightweight_events', JSON.stringify(events.slice(-50)));
    
    console.log('📝 Signup tracked');
  } catch (error) {
    console.warn('Could not track signup:', error);
  }
};

// Lazy-loaded imports for admin-only functions with proper typing
// These will only be imported when actually needed in admin components
export const getTrafficData = async (period: string) => {
  const { getTrafficData: adminGetTrafficData } = await import('./analytics/dataAccess');
  return adminGetTrafficData(period);
};

export const getTrafficSourceData = async () => {
  const { getTrafficSourceData: adminGetTrafficSourceData } = await import('./analytics/dataAccess');
  return adminGetTrafficSourceData();
};

export const getDeviceData = async () => {
  const { getDeviceData: adminGetDeviceData } = await import('./analytics/dataAccess');
  return adminGetDeviceData();
};

export const getTopPages = async (period: string) => {
  const { getTopPages: adminGetTopPages } = await import('./analytics/dataAccess');
  return adminGetTopPages(period);
};

export const getAnalyticsOverview = async (period: string) => {
  const { getAnalyticsOverview: adminGetAnalyticsOverview } = await import('./analytics/dataAccess');
  return adminGetAnalyticsOverview(period);
};

// Export analytics periods directly (these are just constants, safe to include)
export const analyticsPeriods = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
];

// Type exports - these are lightweight and safe to re-export
export type { 
  AnalyticsPeriod,
  DistributionDataPoint,
  TrafficDataPoint,
  TopPageData,
  AnalyticsOverview
} from './analytics/types';

// NOTE: The heavy analytics functions are now lazy-loaded
// This means they won't be included in the main bundle
// They'll only be loaded when admin components actually call them