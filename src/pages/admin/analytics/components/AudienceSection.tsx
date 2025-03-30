
import { DistributionChart } from '@/components/admin/analytics/DistributionChart';
import { getTrafficSourceData, getDeviceData } from '@/services/analyticsService';

export function AudienceSection() {
  const sourceData = getTrafficSourceData();
  const deviceData = getDeviceData();
  
  return (
    <>
      <h3 className="text-2xl font-bold tracking-tight text-navy mt-8">Audience Insights</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DistributionChart data={sourceData} title="Traffic Sources" />
        <DistributionChart data={deviceData} title="Device Distribution" />
      </div>
    </>
  );
}
