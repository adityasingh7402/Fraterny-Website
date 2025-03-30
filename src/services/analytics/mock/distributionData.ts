
import { DistributionDataPoint } from '../types';

// Mock data generator for source distribution
export const generateMockSourceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Direct', value: 35 },
    { name: 'Organic Search', value: 24 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 },
    { name: 'Email', value: 8 },
    { name: 'Other', value: 3 }
  ];
};

// Mock data generator for device distribution
export const generateMockDeviceData = (): DistributionDataPoint[] => {
  return [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 4 }
  ];
};
