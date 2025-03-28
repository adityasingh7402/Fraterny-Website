
// Base interface for all analytics data points
interface BaseDataPoint {
  name: string;
  [key: string]: string | number;
}

// Data point for distribution charts (pie charts)
export interface DistributionDataPoint extends BaseDataPoint {
  value: number;
}

// Data point for traffic charts
export interface TrafficDataPoint extends BaseDataPoint {
  visits: number;
  signups: number;
  conversion?: number;
}

export interface AnalyticsPeriod {
  label: string;
  value: string;
}

export interface AnalyticsOverview {
  totalVisits: number;
  averageSessionTime: string;
  bounceRate: string;
  conversionRate: string;
  percentChange: {
    visits: number;
    sessionTime: number;
    bounceRate: number;
    conversionRate: number;
  }
}

// Analytics periods
export const analyticsPeriods: AnalyticsPeriod[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'All time', value: 'all' }
];

// Storage key for analytics data in localStorage
const ANALYTICS_STORAGE_KEY = 'website_analytics_data';
const ANALYTICS_SESSION_KEY = 'website_analytics_session';
const ANALYTICS_LAST_VISIT_KEY = 'website_analytics_last_visit';

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
      analytics.dailyTraffic[today].paths[path] = 0;
    }
    analytics.dailyTraffic[today].paths[path]++;
    
    // Check if this is a new session
    trackSession(analytics, today);
    
    // Save updated analytics
    saveAnalyticsToStorage(analytics);
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
const trackSession = (analytics: any, today: string): void => {
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

// Helper function to get analytics from localStorage
const getAnalyticsFromStorage = (): any => {
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
const saveAnalyticsToStorage = (analytics: any): void => {
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
};

// Get traffic data for the selected period
export const getTrafficData = (period: string): TrafficDataPoint[] => {
  try {
    const analytics = getAnalyticsFromStorage();
    const data: TrafficDataPoint[] = [];
    
    // Determine date range based on period
    const endDate = new Date();
    const startDate = getStartDateByPeriod(endDate, period);
    
    // Loop through each day in range
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dailyData = analytics.dailyTraffic[dateString] || { pageViews: 0, uniqueVisitors: 0, signups: 0 };
      
      data.push({
        name: dayLabel,
        visits: dailyData.uniqueVisitors || 0,
        signups: dailyData.signups || 0,
        conversion: dailyData.uniqueVisitors ? Math.round((dailyData.signups / dailyData.uniqueVisitors) * 100) : 0
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error getting traffic data:', error);
    return generateMockTrafficData(period); // Fallback to mock data
  }
};

// Get breakdown by source/channel
export const getTrafficSourceData = (): DistributionDataPoint[] => {
  try {
    const analytics = getAnalyticsFromStorage();
    
    if (!analytics.sources) {
      return generateMockSourceData(); // Fallback to mock data
    }
    
    return Object.entries(analytics.sources).map(([name, value]) => ({
      name,
      value: value as number
    }));
  } catch (error) {
    console.error('Error getting source data:', error);
    return generateMockSourceData(); // Fallback to mock data
  }
};

export const getDeviceData = (): DistributionDataPoint[] => {
  try {
    const analytics = getAnalyticsFromStorage();
    
    if (!analytics.devices) {
      return generateMockDeviceData(); // Fallback to mock data
    }
    
    return Object.entries(analytics.devices).map(([name, value]) => ({
      name,
      value: value as number
    }));
  } catch (error) {
    console.error('Error getting device data:', error);
    return generateMockDeviceData(); // Fallback to mock data
  }
};

// Get overview metrics
export const getAnalyticsOverview = (period: string): AnalyticsOverview => {
  try {
    const analytics = getAnalyticsFromStorage();
    
    // Determine date range
    const endDate = new Date();
    const startDate = getStartDateByPeriod(endDate, period);
    const previousStartDate = getStartDateByPeriod(
      new Date(startDate.getTime() - 86400000), // Previous day
      period
    );
    
    // Calculate current period metrics
    const currentMetrics = calculatePeriodMetrics(analytics, startDate, endDate);
    
    // Calculate previous period metrics
    const previousMetrics = calculatePeriodMetrics(
      analytics, 
      previousStartDate, 
      new Date(startDate.getTime() - 86400000)
    );
    
    // Calculate percent changes
    const visitsChange = calculatePercentChange(currentMetrics.totalVisits, previousMetrics.totalVisits);
    const sessionTimeChange = calculatePercentChange(currentMetrics.totalSessionTime, previousMetrics.totalSessionTime);
    const bounceRateChange = calculatePercentChange(currentMetrics.bounceRate, previousMetrics.bounceRate);
    const conversionChange = calculatePercentChange(currentMetrics.conversionRate, previousMetrics.conversionRate);
    
    return {
      totalVisits: currentMetrics.totalVisits,
      averageSessionTime: `${Math.round(currentMetrics.totalSessionTime / 60)} sec`,
      bounceRate: `${Math.round(currentMetrics.bounceRate)}%`,
      conversionRate: `${currentMetrics.conversionRate.toFixed(1)}%`,
      percentChange: {
        visits: visitsChange,
        sessionTime: sessionTimeChange,
        bounceRate: -bounceRateChange, // Negative because lower bounce rate is better
        conversionRate: conversionChange
      }
    };
  } catch (error) {
    console.error('Error getting analytics overview:', error);
    return generateMockOverview(period); // Fallback to mock data
  }
};

// Helper function to determine start date based on period
const getStartDateByPeriod = (endDate: Date, period: string): Date => {
  const startDate = new Date(endDate);
  
  switch (period) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case 'ytd':
      startDate.setFullYear(endDate.getFullYear(), 0, 1); // Jan 1st of current year
      break;
    case 'all':
    default:
      startDate.setFullYear(endDate.getFullYear() - 1); // One year ago by default
      break;
  }
  
  return startDate;
};

// Helper to calculate metrics for a specific period
const calculatePeriodMetrics = (analytics: any, startDate: Date, endDate: Date) => {
  let totalVisits = 0;
  let totalPageViews = 0;
  let totalSignups = 0;
  let totalSessionTime = 0; // Simplified: using average of 2-3 minutes per visit
  
  // Loop through each day in range
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0];
    const dailyData = analytics.dailyTraffic[dateString];
    
    if (dailyData) {
      totalVisits += dailyData.uniqueVisitors || 0;
      totalPageViews += dailyData.pageViews || 0;
      totalSignups += dailyData.signups || 0;
    }
  }
  
  // Simulate session time (2-3 minutes per visit)
  totalSessionTime = totalVisits * (Math.random() * 60 + 120);
  
  // Calculate bounce rate (single page views / total visits)
  const bounceRate = totalVisits ? ((totalVisits - (totalPageViews - totalVisits)) / totalVisits) * 100 : 0;
  
  // Calculate conversion rate
  const conversionRate = totalVisits ? (totalSignups / totalVisits) * 100 : 0;
  
  return {
    totalVisits,
    totalPageViews,
    totalSignups,
    totalSessionTime,
    bounceRate,
    conversionRate
  };
};

// Calculate percent change between two values
const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Mock data generators (fallbacks when real data isn't available)
const generateMockTrafficData = (period: string): TrafficDataPoint[] => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data: TrafficDataPoint[] = [];
  
  const baseVisits = 500;
  const baseSignups = 50;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    
    const visitVariation = isWeekend ? 0.7 : 1.0 + (Math.random() * 0.5 - 0.25);
    const visits = Math.round(baseVisits * visitVariation);
    
    const signupVariation = isWeekend ? 0.6 : 1.0 + (Math.random() * 0.6 - 0.3);
    const signups = Math.round(baseSignups * signupVariation);
    
    data.push({
      name: dayLabel,
      visits: visits,
      signups: signups,
      conversion: Math.round((signups / visits) * 100)
    });
  }
  
  return data;
};

const generateMockSourceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Direct', value: 35 },
    { name: 'Organic Search', value: 24 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 },
    { name: 'Email', value: 8 },
    { name: 'Other', value: 3 }
  ];
};

const generateMockDeviceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 4 }
  ];
};

const generateMockOverview = (period: string): AnalyticsOverview => {
  const variations: Record<string, number> = {
    '7d': 1.1,
    '30d': 1.0,
    '90d': 0.95,
    'ytd': 1.05,
    'all': 1.0
  };
  
  const variation = variations[period] || 1.0;
  
  return {
    totalVisits: Math.round(24560 * variation),
    averageSessionTime: `${Math.round(245 * variation)} sec`,
    bounceRate: `${Math.round(38 * (2 - variation))}%`,
    conversionRate: `${(5.8 * variation).toFixed(1)}%`,
    percentChange: {
      visits: Math.round((variation - 0.95) * 100),
      sessionTime: Math.round((variation - 0.97) * 100),
      bounceRate: Math.round((0.98 - variation) * 100),
      conversionRate: Math.round((variation - 0.96) * 100)
    }
  };
};
