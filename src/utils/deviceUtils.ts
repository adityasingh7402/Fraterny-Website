/**
 * Enhanced device detection utilities
 */

// Extend Navigator interface to include connection properties
interface ExtendedNavigator extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check screen width
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check user agent
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check touch support
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Consider it mobile if any of these conditions are true
  return isSmallScreen || isMobileUserAgent || hasTouchSupport;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

export const isHighDensityDisplay = (): boolean => {
  return getDevicePixelRatio() > 1;
};

export const isLowBandwidth = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const extendedNavigator = navigator as ExtendedNavigator;
  
  // Check for data saver mode
  if (extendedNavigator.connection?.saveData) return true;
  
  // Check connection type
  const connectionType = extendedNavigator.connection?.effectiveType;
  return connectionType === 'slow-2g' || connectionType === '2g';
}; 