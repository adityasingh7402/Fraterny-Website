
// Re-export all analytics service functions from their respective modules
export { trackPageView, trackSignup } from './tracking';
export { 
  getTrafficData, 
  getTrafficSourceData, 
  getDeviceData, 
  getTopPages, 
  getAnalyticsOverview 
} from './dataAccess';
export { 
  analyticsPeriods, 
  type AnalyticsPeriod,
  type DistributionDataPoint,
  type TrafficDataPoint,
  type TopPageData,
  type AnalyticsOverview
} from './types';
