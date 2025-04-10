
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DistributionDataPoint } from '@/services/analyticsService';
import { useIsMobile } from '@/hooks/use-mobile';

interface DistributionChartProps {
  data: DistributionDataPoint[];
  title: string;
}

export function DistributionChart({ data, title }: DistributionChartProps) {
  const isMobile = useIsMobile();
  
  // Brand colors from the custom instructions (Navy, Terracotta, Gold + complementary colors)
  const COLORS = ['#0A1A2F', '#E07A5F', '#D4AF37', '#3B7A57', '#6A5ACD', '#FF7F50'];
  
  // Create chart config dynamically from data
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = { 
      label: item.name,
      theme: {
        dark: COLORS[index % COLORS.length],
        light: COLORS[index % COLORS.length]
      }
    };
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="px-3 py-2 sm:px-6 sm:py-4">
        <CardTitle className="text-navy text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-1 sm:px-6 sm:py-4">
        <div className="h-[220px] sm:h-[280px] lg:h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="40%"
                  labelLine={false}
                  outerRadius={isMobile ? 70 : 100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number) => {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value} (${percentage}%)`;
                      }}
                    />
                  }
                />
                <Legend 
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
