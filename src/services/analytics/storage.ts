
import { ANALYTICS_STORAGE_KEY } from './types';

// Helper function to get analytics from localStorage
export const getAnalyticsFromStorage = (): any => {
  const storedData = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing analytics data:', e);
    }
  }
  
  // Initial analytics structure
  return {
    dailyTraffic: {},
    sources: {
      direct: 0,
      'search': 0,
      'social': 0,
      'referral': 0
    },
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    }
  };
};

// Helper function to save analytics to localStorage
export const saveAnalyticsToStorage = (analytics: any): void => {
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
};
