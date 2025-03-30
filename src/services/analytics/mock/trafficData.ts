
import { TrafficDataPoint } from '../types';

// Mock data generator for traffic data
export const generateMockTrafficData = (period: string): TrafficDataPoint[] => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const data: TrafficDataPoint[] = [];
  
  const baseVisits = 500;
  const baseSignups = 50;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    
    const visitVariation = isWeekend ? 0.7 : 1.0 + (Math.random() * 0.5 - 0.25);
    const visits = Math.round(baseVisits * visitVariation);
    
    const signupVariation = isWeekend ? 0.6 : 1.0 + (Math.random() * 0.6 - 0.3);
    const signups = Math.round(baseSignups * signupVariation);
    
    data.push({
      name: dayLabel,
      visits: visits,
      signups: signups,
      conversion: Math.round((signups / visits) * 100)
    });
  }
  
  return data;
};
