
import { Users, Clock, ArrowDownRight, TrendingUp } from 'lucide-react';
import { getAnalyticsOverview } from '@/services/analyticsService';
import { OverviewCard } from '@/components/admin/analytics/OverviewCard';

interface KPISectionProps {
  period: string;
  refreshKey: number;
}

export function KPISection({ period, refreshKey }: KPISectionProps) {
  const overviewData = getAnalyticsOverview(period);

  return (
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
  );
}
