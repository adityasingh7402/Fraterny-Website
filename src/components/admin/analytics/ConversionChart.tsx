
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConversionChartProps {
  data: Array<{
    name: string;
    visits: number;
    signups: number;
    conversion?: number;
    [key: string]: string | number | undefined;
  }>;
}

export function ConversionChart({ data }: ConversionChartProps) {
  const isMobile = useIsMobile();
  
  const chartConfig = {
    conversion: { 
      label: "Conversion %", 
      theme: {
        dark: "#D4AF37", 
        light: "#D4AF37"
      }
    }
  };

  // Calculate conversion percentage if not provided
  const chartData = data.map(item => ({
    ...item,
    conversion: item.conversion || (item.visits > 0 ? (item.signups / item.visits) * 100 : 0)
  }));

  // Format X-axis labels for mobile to be more compact
  const formatXAxis = (tickItem: string) => {
    if (isMobile) {
      // For mobile, abbreviate month names or shorten date format
      return tickItem.split(' ').map(part => part.substring(0, 3)).join(' ');
    }
    return tickItem;
  };

  return (
    <div className="h-[220px] sm:h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              width={isMobile ? 35 : 45}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" height={36} />
            <Area 
              type="monotone" 
              dataKey="conversion" 
              name="Conversion %"
              stroke="#D4AF37" 
              fillOpacity={1}
              fill="url(#colorConversion)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
