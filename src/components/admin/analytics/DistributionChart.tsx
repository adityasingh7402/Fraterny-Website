
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DistributionDataPoint } from '@/services/analyticsService';

interface DistributionChartProps {
  data: DistributionDataPoint[];
  title: string;
}

export function DistributionChart({ data, title }: DistributionChartProps) {
  // Updated colors to match brand palette (navy, terracotta, gold + complementary colors)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
