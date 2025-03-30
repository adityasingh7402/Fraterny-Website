
import { useState, useEffect, useCallback } from 'react';
import { Users, Clock, ArrowDownRight, TrendingUp, MousePointerClick, Target, Award, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

import { 
  analyticsPeriods, 
  getTrafficData, 
  getTrafficSourceData, 
  getDeviceData,
  getAnalyticsOverview,
  getTopPages,
  type AnalyticsPeriod
} from '@/services/analyticsService';
import { OverviewCard } from '@/components/admin/analytics/OverviewCard';
import { TrafficChart } from '@/components/admin/analytics/TrafficChart';
import { DistributionChart } from '@/components/admin/analytics/DistributionChart';
import { TopPagesTable } from '@/components/admin/analytics/TopPagesTable';
import { ConversionChart } from '@/components/admin/analytics/ConversionChart';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<string>('7d');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Fetch data with the selected period
  const trafficData = getTrafficData(period);
  const sourceData = getTrafficSourceData();
  const deviceData = getDeviceData();
  const overviewData = getAnalyticsOverview(period);
  const topPages = getTopPages(period);

  // Parse numeric values from string representations
  const bounceRateValue = Number(overviewData.bounceRate.replace('%', ''));
  const avgTimeOnSite = overviewData.averageTimeOnSite;
  const pagesPerSession = overviewData.pagesPerSession;
  
  // Calculate engagement score with more realistic thresholds and curve
  // Time on site (seconds): Apply diminishing returns curve
  // 0-30s: poor (0-5 points), 30-120s: okay (5-15 points), 120s+: good (15-25 points)
  let timeScore = 0;
  if (avgTimeOnSite < 30) {
    timeScore = Math.floor((avgTimeOnSite / 30) * 5);
  } else if (avgTimeOnSite < 120) {
    timeScore = 5 + Math.floor(((avgTimeOnSite - 30) / 90) * 10);
  } else {
    timeScore = 15 + Math.floor(Math.min(10, (avgTimeOnSite - 120) / 30));
  }
  
  // Bounce rate: 0-100% → 0-40 points (inverted, lower is better)
  // Industry average is around 40-60%, so calibrate accordingly
  const bounceScore = Math.max(0, Math.min(40, Math.round((100 - bounceRateValue) * 0.6)));
  
  // Pages per session: Most sessions are 1-3 pages
  // 1 page: 0-10 points, 2 pages: 10-20 points, 3+ pages: 20-35 points
  let pagesScore = 0;
  if (pagesPerSession <= 1) {
    pagesScore = Math.round(pagesPerSession * 10);
  } else if (pagesPerSession <= 2) {
    pagesScore = 10 + Math.round((pagesPerSession - 1) * 10);
  } else {
    pagesScore = 20 + Math.min(15, Math.round((pagesPerSession - 2) * 7.5));
  }
  
  // Calculate final score and ensure it's between 0-100
  const engagementScore = Math.min(100, Math.max(0, Math.round(timeScore + bounceScore + pagesScore)));

  // Refresh data every 30 seconds if the page is visible
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        setRefreshKey(prev => prev + 1);
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle period change
  const handlePeriodChange = useCallback((value: string) => {
    setPeriod(value);
  }, []);

  return (
    <div className="container px-4 py-6 md:py-10 mx-auto max-w-7xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-navy">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your website performance and make data-driven decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>
          <Select
            value={period}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {analyticsPeriods.map((period: AnalyticsPeriod) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Visitors"
            value={overviewData.totalVisits.toLocaleString()}
            percentChange={overviewData.percentChange.visits}
            icon={<Users className="h-4 w-4" />}
          />
          <OverviewCard
            title="Avg. Session Time"
            value={overviewData.averageSessionTime}
            percentChange={overviewData.percentChange.sessionTime}
            icon={<Clock className="h-4 w-4" />}
          />
          <OverviewCard
            title="Bounce Rate"
            value={overviewData.bounceRate}
            percentChange={-overviewData.percentChange.bounceRate} // Negative because lower is better
            icon={<ArrowDownRight className="h-4 w-4" />}
            inverseTrend={true} // Lower is better for bounce rate
          />
          <OverviewCard
            title="Conversion Rate"
            value={overviewData.conversionRate}
            percentChange={overviewData.percentChange.conversionRate}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
          
        {/* Traffic & Engagement Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-navy">Traffic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficChart data={trafficData} />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-navy">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ConversionChart data={trafficData} />
            </CardContent>
          </Card>
        </div>
        
        {/* Audience Insights */}
        <h3 className="text-2xl font-bold tracking-tight text-navy mt-8">Audience Insights</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <DistributionChart data={sourceData} title="Traffic Sources" />
          <DistributionChart data={deviceData} title="Device Distribution" />
        </div>
        
        {/* User Engagement Metrics */}
        <h3 className="text-2xl font-bold tracking-tight text-navy mt-8">User Engagement</h3>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                Engagement Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[200px]">
                <div className="text-5xl font-bold text-navy mb-2">{engagementScore}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
                <div className="mt-4 text-sm">
                  {engagementScore > 70 
                    ? "Excellent user engagement" 
                    : engagementScore > 50 
                      ? "Good user engagement" 
                      : "Needs improvement"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-navy">Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <TopPagesTable data={topPages} />
            </CardContent>
          </Card>
        </div>
        
        {/* Actionable Insights */}
        <h3 className="text-2xl font-bold tracking-tight text-navy mt-8">Actionable Insights</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <Target className="h-5 w-5 text-terracotta" />
                Conversion Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {Number(overviewData.conversionRate.replace('%', '')) < 3 ? (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-lg">•</span>
                    <span>Your conversion rate is below average. Consider improving your call-to-action buttons and landing page content.</span>
                  </li>
                ) : null}
                {Number(overviewData.bounceRate.replace('%', '')) > 60 ? (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-lg">•</span>
                    <span>High bounce rate detected. Review your top entry pages for usability issues or slow loading times.</span>
                  </li>
                ) : null}
                {sourceData.some(item => item.name === "Social" && item.value < 10) ? (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 text-lg">•</span>
                    <span>Low social media traffic. Consider increasing your social presence or running targeted campaigns.</span>
                  </li>
                ) : null}
                {deviceData.some(item => item.name === "Mobile" && item.value > 40) && 
                 overviewData.mobileConversionRate < Number(overviewData.conversionRate.replace('%', '')) ? (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 text-lg">•</span>
                    <span>Mobile conversion rate is lower than desktop. Check your mobile experience for usability issues.</span>
                  </li>
                ) : null}
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg">•</span>
                  <span>Consider A/B testing your signup form to improve conversion rates.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-terracotta" />
                User Experience Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {overviewData.averageTimeOnSite < 90 ? (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 text-lg">•</span>
                    <span>Low average time on site. Consider enriching your content or improving navigation.</span>
                  </li>
                ) : null}
                {deviceData.some(item => item.name === "Mobile" && item.value > 30) ? (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 text-lg">•</span>
                    <span>Significant mobile traffic detected. Ensure your site is fully optimized for mobile users.</span>
                  </li>
                ) : null}
                {topPages.some(page => page.exitRate > 70) ? (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-lg">•</span>
                    <span>High exit rates detected on key pages. Review these pages for improvements.</span>
                  </li>
                ) : null}
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <span>Consider adding more visual content to increase engagement on your top pages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg">•</span>
                  <span>Implement user surveys to gather direct feedback on your website experience.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
