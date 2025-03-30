
import { DistributionDataPoint, TrafficDataPoint, TopPageData, AnalyticsOverview } from './types';

// Mock data generators (fallbacks when real data isn't available)
export const generateMockTrafficData = (period: string): TrafficDataPoint[] => {
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

export const generateMockSourceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Direct', value: 35 },
    { name: 'Organic Search', value: 24 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 },
    { name: 'Email', value: 8 },
    { name: 'Other', value: 3 }
  ];
};

export const generateMockDeviceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 4 }
  ];
};

export const generateMockTopPagesData = (): TopPageData[] => {
  return [
    { path: '/', pageTitle: 'Home', views: 1245, exitRate: 42, avgTimeOnPage: 68 },
    { path: '/experience', pageTitle: 'Experience', views: 890, exitRate: 35, avgTimeOnPage: 127 },
    { path: '/process', pageTitle: 'Process', views: 654, exitRate: 28, avgTimeOnPage: 93 },
    { path: '/pricing', pageTitle: 'Pricing', views: 521, exitRate: 22, avgTimeOnPage: 145 },
    { path: '/blog', pageTitle: 'Blog', views: 435, exitRate: 47, avgTimeOnPage: 85 },
    { path: '/contact', pageTitle: 'Contact', views: 312, exitRate: 76, avgTimeOnPage: 42 },
    { path: '/faq', pageTitle: 'FAQ', views: 287, exitRate: 34, avgTimeOnPage: 118 }
  ];
};

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
