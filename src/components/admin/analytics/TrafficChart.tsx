
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  ResponsiveContainer,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrafficChartProps {
  data: Array<{
    name: string;
    visits: number;
    signups: number;
    conversion?: number;
    [key: string]: string | number | undefined;
  }>;
}

export function TrafficChart({ data }: TrafficChartProps) {
  const isMobile = useIsMobile();
  
  const chartConfig = {
    visits: { 
      label: "Visits", 
      theme: {
        dark: "#0A1A2F", 
        light: "#0A1A2F"
      }
    },
    signups: { 
      label: "Signups", 
      theme: {
        dark: "#E07A5F", 
        light: "#E07A5F"
      }
    },
  };

  // Format X-axis labels for mobile to be more compact
  const formatXAxis = (tickItem: string) => {
    if (isMobile) {
      // For mobile, abbreviate month names or shorten date format
      return tickItem.split(' ').map(part => part.substring(0, 3)).join(' ');
    }
    return tickItem;
  };

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
              tickFormatter={formatXAxis}
              interval={isMobile ? 'preserveStartEnd' : 0}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={[0, 'auto']}
              width={isMobile ? 30 : 40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} />
            <ReferenceLine y={0} stroke="#E5E7EB" />
            <Line
              type="monotone"
              dataKey="visits"
              name="Visits"
              stroke="var(--color-visits)"
              strokeWidth={2}
              dot={isMobile ? false : { r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="signups" 
              name="Signups"
              stroke="var(--color-signups)"
              strokeWidth={2}
              dot={isMobile ? false : { r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
