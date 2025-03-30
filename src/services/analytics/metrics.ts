
// Calculate percent change between two values
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Helper to calculate metrics for a specific period
export const calculatePeriodMetrics = (analytics: any, startDate: Date, endDate: Date) => {
  let totalVisits = 0;
  let totalPageViews = 0;
  let totalSignups = 0;
  let totalSessionTime = 0;
  let mobileVisits = 0;
  let mobileSignups = 0;
  let totalTimeOnPage = 0;
  let totalBounces = 0;
  let totalEntries = 0;
  
  // Loop through each day in range
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0];
    const dailyData = analytics.dailyTraffic[dateString];
    
    if (dailyData) {
      totalVisits += dailyData.uniqueVisitors || 0;
      totalPageViews += dailyData.pageViews || 0;
      totalSignups += dailyData.signups || 0;
      
      // Calculate time on page
      if (dailyData.paths) {
        Object.values(dailyData.paths).forEach((pageData: any) => {
          totalTimeOnPage += pageData.timeOnPage || 0;
        });
      }
    }
  }
  
  // Calculate totals from devices (for mobile conversion)
  if (analytics.devices) {
    if (analytics.devices.mobile) {
      mobileVisits = analytics.devices.mobile;
    }
  }
  
  // Assume 15% of signups come from mobile (in a real app, we'd track this)
  mobileSignups = totalSignups * 0.15;
  
  // Calculate session time (using time on page or estimating)
  totalSessionTime = totalTimeOnPage > 0 ? totalTimeOnPage / totalVisits : totalVisits * (Math.random() * 60 + 120);
  
  // Calculate pages per session
  const pagesPerSession = totalVisits > 0 ? totalPageViews / totalVisits : 0;
  
  // Calculate bounce rate (single page views / total visits)
  // A bounce is typically a session with only one page view
  const bounceRate = totalVisits > 0 ? ((totalVisits - (totalPageViews - totalVisits)) / totalVisits) * 100 : 0;
  
  // Calculate conversion rate
  const conversionRate = totalVisits > 0 ? (totalSignups / totalVisits) * 100 : 0;
  
  // Calculate mobile conversion rate
  const mobileConversionRate = mobileVisits > 0 ? (mobileSignups / mobileVisits) * 100 : 0;
  
  return {
    totalVisits,
    totalPageViews,
    totalSignups,
    pagesPerSession,
    totalSessionTime,
    bounceRate,
    conversionRate,
    mobileConversionRate
  };
};
