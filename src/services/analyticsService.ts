
interface AnalyticsDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
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

// Sample analytics periods
export const analyticsPeriods: AnalyticsPeriod[] = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'All time', value: 'all' }
];

// Generate sample data for demonstration purposes
export const getTrafficData = (period: string): AnalyticsDataPoint[] => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data: AnalyticsDataPoint[] = [];
  
  const baseVisits = 500;
  const baseSignups = 50;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    
    // Create some realistic patterns (weekends lower, random variations)
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

// Get breakdown by source/channel
export const getTrafficSourceData = (): AnalyticsDataPoint[] => {
  return [
    { name: 'Direct', value: 35 },
    { name: 'Organic Search', value: 24 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 },
    { name: 'Email', value: 8 },
    { name: 'Other', value: 3 }
  ];
};

export const getDeviceData = (): AnalyticsDataPoint[] => {
  return [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 4 }
  ];
};

// Get overview metrics
export const getAnalyticsOverview = (period: string): AnalyticsOverview => {
  // Sample data with slight variations based on selected period
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
