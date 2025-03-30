import { getAnalyticsFromStorage } from './storage';
import { getStartDateByPeriod } from './dateUtils';
import { calculatePeriodMetrics, calculatePercentChange } from './metrics';
import { 
  generateMockTrafficData, 
  generateMockSourceData, 
  generateMockDeviceData, 
  generateMockTopPagesData, 
  generateMockOverview 
} from './mock';
import { 
  TrafficDataPoint, 
  DistributionDataPoint, 
  TopPageData, 
  AnalyticsOverview 
} from './types';

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
    
    let otherValue = 0;
    const cleanedSources: Record<string, number> = {};
    
    // Process sources and combine development/testing domains into "Other"
    Object.entries(analytics.sources).forEach(([name, value]) => {
      // Updated condition to also filter out "lovable.dev"
      if (name === 'lovable_dev' || name.includes('lovableproject.com') || name.includes('lovable.dev')) {
        otherValue += value as number;
      } else {
        cleanedSources[name] = value as number;
      }
    });
    
    // Add "Other" category if any values were combined
    if (otherValue > 0) {
      cleanedSources['Other'] = (cleanedSources['Other'] || 0) + otherValue;
    }
    
    return Object.entries(cleanedSources).map(([name, value]) => ({
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

// Get top pages by traffic
export const getTopPages = (period: string): TopPageData[] => {
  try {
    const analytics = getAnalyticsFromStorage();
    const pagesMap: Record<string, {views: number, exits: number, timeOnPage: number, title: string}> = {};
    
    // Determine date range based on period
    const endDate = new Date();
    const startDate = getStartDateByPeriod(endDate, period);
    
    // Aggregate page data across the date range
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const dailyData = analytics.dailyTraffic[dateString];
      
      if (dailyData && dailyData.paths) {
        Object.entries(dailyData.paths).forEach(([path, data]) => {
          const pageData = data as any;
          if (!pagesMap[path]) {
            pagesMap[path] = { 
              views: 0, 
              exits: 0, 
              timeOnPage: 0,
              title: pageData.title || path
            };
          }
          
          pagesMap[path].views += pageData.views || 0;
          pagesMap[path].exits += pageData.exits || 0;
          pagesMap[path].timeOnPage += pageData.timeOnPage || 0;
        });
      }
    }
    
    // Convert to array and sort by views
    const topPages = Object.entries(pagesMap).map(([path, data]) => ({
      path,
      pageTitle: data.title,
      views: data.views,
      exitRate: data.views > 0 ? Math.round((data.exits / data.views) * 100) : 0,
      avgTimeOnPage: data.views > 0 ? Math.round(data.timeOnPage / data.views) : 0
    }));
    
    // Sort by views (descending) and take top 10
    return topPages.sort((a, b) => b.views - a.views).slice(0, 10);
  } catch (error) {
    console.error('Error getting top pages:', error);
    return generateMockTopPagesData(); // Fallback to mock data
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
      pagesPerSession: currentMetrics.pagesPerSession,
      averageTimeOnSite: Math.round(currentMetrics.totalSessionTime),
      mobileConversionRate: currentMetrics.mobileConversionRate,
      percentChange: {
        visits: visitsChange,
        sessionTime: sessionTimeChange,
        bounceRate: bounceRateChange,
        conversionRate: conversionChange
      }
    };
  } catch (error) {
    console.error('Error getting analytics overview:', error);
    return generateMockOverview(period); // Fallback to mock data
  }
};
