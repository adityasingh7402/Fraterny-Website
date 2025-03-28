
import { useState, useEffect } from 'react';
import { Users, Clock, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { 
  analyticsPeriods, 
  getTrafficData, 
  getTrafficSourceData, 
  getDeviceData,
  getAnalyticsOverview,
  type AnalyticsPeriod
} from '@/services/analyticsService';
import { OverviewCard } from '@/components/admin/analytics/OverviewCard';
import { TrafficChart } from '@/components/admin/analytics/TrafficChart';
import { DistributionChart } from '@/components/admin/analytics/DistributionChart';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<string>('7d');
  const [tab, setTab] = useState<string>("overview");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Get the analytics data
  const trafficData = getTrafficData(period);
  const sourceData = getTrafficSourceData();
  const deviceData = getDeviceData();
  const overviewData = getAnalyticsOverview(period);

  // Refresh data every 30 seconds if the page is visible
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        setRefreshKey(prev => prev + 1);
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Trigger refresh when period changes or refresh key changes
  useEffect(() => {
    // The state changes will trigger a re-render,
    // which will refresh the analytics data
  }, [period, refreshKey]);

  return (
    <div className="container px-4 py-6 md:py-10 mx-auto max-w-7xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your website performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value)}
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

      <Tabs defaultValue="overview" value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
            />
            <OverviewCard
              title="Conversion Rate"
              value={overviewData.conversionRate}
              percentChange={overviewData.percentChange.conversionRate}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
          
          <TrafficChart data={trafficData} title="Website Traffic" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <DistributionChart data={sourceData} title="Traffic Sources" />
            <DistributionChart data={deviceData} title="Device Distribution" />
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <TrafficChart data={trafficData} title="Traffic Analysis" />
          <DistributionChart data={sourceData} title="Traffic Sources" />
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed audience demographics will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
            <DistributionChart data={deviceData} title="Device Types" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
