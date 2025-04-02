
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Skeleton } from './skeleton'

interface DeviceDetectionWrapperProps {
  children: React.ReactNode;
  loadingHeight?: string | number;
  skipDetection?: boolean;
  priority?: boolean; // New prop for critical UI elements that need immediate rendering
}

export const DeviceDetectionWrapper: React.FC<DeviceDetectionWrapperProps> = ({ 
  children, 
  loadingHeight = '16rem',
  skipDetection = false,
  priority = false
}) => {
  const { isDetecting, isMobile } = useIsMobile();
  
  // If skipDetection is true or this is a high priority component, render children regardless
  if (skipDetection || priority || !isDetecting) {
    return <>{children}</>;
  }
  
  // Show a minimal loading state while detection is happening
  return (
    <div style={{ height: loadingHeight }} className="w-full">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
