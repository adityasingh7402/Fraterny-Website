
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

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
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
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
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
