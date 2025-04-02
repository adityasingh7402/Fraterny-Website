
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Skeleton } from './skeleton'

interface DeviceDetectionWrapperProps {
  children: React.ReactNode;
  loadingHeight?: string | number;
  skipDetection?: boolean;
}

export const DeviceDetectionWrapper: React.FC<DeviceDetectionWrapperProps> = ({ 
  children, 
  loadingHeight = '16rem',
  skipDetection = false
}) => {
  const { isDetecting } = useIsMobile();
  
  // If skipDetection is true, render children regardless of detection state
  if (skipDetection || !isDetecting) {
    return <>{children}</>;
  }
  
  // Show a minimal loading state while detection is happening
  return (
    <div style={{ height: loadingHeight }} className="w-full">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
