
import { MousePointerClick, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTrafficSourceData, getDeviceData, getTopPages, getAnalyticsOverview } from '@/services/analyticsService';

interface InsightsSectionProps {
  period: string;
}

export function InsightsSection({ period }: InsightsSectionProps) {
  const sourceData = getTrafficSourceData();
  const deviceData = getDeviceData();
  const topPages = getTopPages(period);
  const overviewData = getAnalyticsOverview(period);
  
  return (
    <>
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
    </>
  );
}
