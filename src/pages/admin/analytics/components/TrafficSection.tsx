
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrafficChart } from '@/components/admin/analytics/TrafficChart';
import { ConversionChart } from '@/components/admin/analytics/ConversionChart';
import { getTrafficData } from '@/services/analyticsService';

interface TrafficSectionProps {
  period: string;
}

export function TrafficSection({ period }: TrafficSectionProps) {
  const trafficData = getTrafficData(period);
  
  return (
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
  );
}
