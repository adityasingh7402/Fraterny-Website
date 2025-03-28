
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
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrafficChartProps {
  data: Array<{
    name: string;
    visits: number;
    signups: number;
    conversion?: number;
    [key: string]: string | number | undefined;
  }>;
  title: string;
}

export function TrafficChart({ data, title }: TrafficChartProps) {
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

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  name="Visits"
                  stroke="var(--color-visits)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="signups" 
                  name="Signups"
                  stroke="var(--color-signups)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
