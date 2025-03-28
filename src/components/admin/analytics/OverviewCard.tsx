
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
    <Card className="border-navy/10 hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-navy">
          {title}
        </CardTitle>
        <div className="h-5 w-5 text-terracotta">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-navy">{value}</div>
        <p className="text-xs flex items-center mt-1">
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
