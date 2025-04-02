
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Skeleton } from './skeleton'

interface DeviceDetectionWrapperProps {
  children: React.ReactNode;
  loadingHeight?: string | number;
  skipDetection?: boolean;
  priority?: boolean; // For critical UI elements that need immediate rendering
  forceMobile?: boolean; // New prop to override mobile detection
}

export const DeviceDetectionWrapper: React.FC<DeviceDetectionWrapperProps> = ({ 
  children, 
  loadingHeight = '16rem',
  skipDetection = false,
  priority = false,
  forceMobile
}) => {
  const { isDetecting, isMobile } = useIsMobile();
  
  // Use forceMobile prop if provided, otherwise use detected state
  const effectiveIsMobile = forceMobile !== undefined ? forceMobile : isMobile;
  
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
