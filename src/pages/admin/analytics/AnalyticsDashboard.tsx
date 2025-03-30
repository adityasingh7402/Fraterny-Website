
import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

import { analyticsPeriods, type AnalyticsPeriod, trackPageView } from '@/services/analyticsService';
import { DashboardHeader } from './components/DashboardHeader';
import { KPISection } from './components/KPISection';
import { TrafficSection } from './components/TrafficSection';
import { AudienceSection } from './components/AudienceSection';
import { EngagementSection } from './components/EngagementSection';
import { InsightsSection } from './components/InsightsSection';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<string>('7d');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Track this page view and ensure heartbeat tracking on mount
  useEffect(() => {
    trackPageView('/admin/analytics');
  }, []);
  
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
        <DashboardHeader />
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
        <KPISection period={period} refreshKey={refreshKey} />
        <TrafficSection period={period} />
        <AudienceSection />
        <EngagementSection period={period} />
        <InsightsSection period={period} />
      </div>
    </div>
  );
}
