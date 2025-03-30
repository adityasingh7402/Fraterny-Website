
// Base interface for all analytics data points
export interface BaseDataPoint {
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

export interface TopPageData {
  path: string;
  pageTitle: string;
  views: number;
  exitRate: number;
  avgTimeOnPage: number;
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
  pagesPerSession: number;
  averageTimeOnSite: number;
  mobileConversionRate: number;
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

// Storage keys for analytics data in localStorage
export const ANALYTICS_STORAGE_KEY = 'website_analytics_data';
export const ANALYTICS_SESSION_KEY = 'website_analytics_session';
export const ANALYTICS_LAST_VISIT_KEY = 'website_analytics_last_visit';
