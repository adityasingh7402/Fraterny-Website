
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewCardProps {
  title: string;
  value: string | number;
  percentChange: number;
  icon: React.ReactNode;
}

export function OverviewCard({ title, value, percentChange, icon }: OverviewCardProps) {
  const isPositive = percentChange >= 0;
  const isNeutral = percentChange === 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {!isNeutral && (
            isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-rose-500" />
            )
          )}
          <span className={isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-rose-500'}>
            {isPositive ? '+' : ''}{percentChange}% from last period
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
