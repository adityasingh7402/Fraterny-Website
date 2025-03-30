
import { AnalyticsOverview } from '../types';

// Mock data generator for analytics overview
export const generateMockOverview = (period: string): AnalyticsOverview => {
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
    pagesPerSession: 2.4,
    averageTimeOnSite: Math.round(245 * variation),
    mobileConversionRate: 4.2,
    percentChange: {
      visits: Math.round((variation - 0.95) * 100),
      sessionTime: Math.round((variation - 0.97) * 100),
      bounceRate: Math.round((0.98 - variation) * 100),
      conversionRate: Math.round((variation - 0.96) * 100)
    }
  };
};
