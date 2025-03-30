
import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TopPagesTable } from '@/components/admin/analytics/TopPagesTable';
import { getTopPages, getAnalyticsOverview } from '@/services/analyticsService';
import { EngagementScoreCalculator } from './EngagementScoreCalculator';

interface EngagementSectionProps {
  period: string;
}

export function EngagementSection({ period }: EngagementSectionProps) {
  const topPages = getTopPages(period);
  const overviewData = getAnalyticsOverview(period);
  
  // Get the engagement score
  const engagementScore = EngagementScoreCalculator.calculateScore({
    bounceRate: overviewData.bounceRate,
    averageTimeOnSite: overviewData.averageTimeOnSite,
    pagesPerSession: overviewData.pagesPerSession
  });
  
  return (
    <>
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
    </>
  );
}
