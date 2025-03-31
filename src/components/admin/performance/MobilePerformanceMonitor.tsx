
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * Types of performance metrics we'll track
 */
interface PerformanceMetrics {
  lastNetworkType: string;
  imageLoadTimes: number[];
  aboveTheFoldTime: number | null;
  cacheHitRate: number;
  totalLoaded: number;
  totalFromCache: number;
  slowestImageUrl: string | null;
  slowestImageTime: number | null;
}

// Define the extended PerformanceResourceTiming interface
interface PerformanceResourceEntry extends PerformanceResourceTiming {
  initiatorType: string;
}

/**
 * Component for monitoring and displaying mobile performance metrics
 */
export const MobilePerformanceMonitor: React.FC = () => {
  const network = useNetworkStatus();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lastNetworkType: 'unknown',
    imageLoadTimes: [],
    aboveTheFoldTime: null,
    cacheHitRate: 0,
    totalLoaded: 0,
    totalFromCache: 0,
    slowestImageUrl: null,
    slowestImageTime: null
  });

  // Collect performance metrics
  useEffect(() => {
    // Track network type changes
    setMetrics(prev => ({
      ...prev,
      lastNetworkType: network.effectiveConnectionType
    }));

    // Observer for images loading
    const imageObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach(entry => {
        // Cast to PerformanceResourceEntry to access initiatorType
        const resourceEntry = entry as PerformanceResourceEntry;
        if (resourceEntry.initiatorType === 'img') {
          const loadTime = entry.duration;
          // Only count substantial load times
          if (loadTime > 10) {
            setMetrics(prev => {
              const newImageLoadTimes = [...prev.imageLoadTimes, loadTime];
              
              // Determine if this is the slowest image
              let slowestUrl = prev.slowestImageUrl;
              let slowestTime = prev.slowestImageTime || 0;
              
              if (loadTime > slowestTime) {
                slowestUrl = entry.name;
                slowestTime = loadTime;
              }
              
              // Determine if it was loaded from cache (duration < 50ms is likely cached)
              const fromCache = loadTime < 50;
              
              return {
                ...prev,
                imageLoadTimes: newImageLoadTimes,
                totalLoaded: prev.totalLoaded + 1,
                totalFromCache: prev.totalFromCache + (fromCache ? 1 : 0),
                cacheHitRate: (prev.totalFromCache + (fromCache ? 1 : 0)) / (prev.totalLoaded + 1),
                slowestImageUrl: slowestUrl,
                slowestImageTime: slowestTime
              };
            });
          }
        }
      });
    });
    
    // Observer for largest contentful paint
    const lcpObserver = new PerformanceObserver((entries) => {
      const lastEntry = entries.getEntries().pop();
      if (lastEntry) {
        setMetrics(prev => ({
          ...prev,
          aboveTheFoldTime: lastEntry.startTime
        }));
      }
    });

    // Start observing
    try {
      imageObserver.observe({ type: 'resource', buffered: true });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('Performance observer not supported:', e);
    }

    // Cleanup
    return () => {
      try {
        imageObserver.disconnect();
        lcpObserver.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    };
  }, [network.effectiveConnectionType]);

  // Calculate average image load time
  const averageLoadTime = metrics.imageLoadTimes.length > 0
    ? metrics.imageLoadTimes.reduce((a, b) => a + b, 0) / metrics.imageLoadTimes.length
    : 0;

  return (
    <Card className="bg-white shadow-sm border">
      <CardHeader className="bg-navy bg-opacity-5 pb-2">
        <CardTitle className="text-navy text-lg flex items-center gap-2">
          Mobile Performance Monitor
        </CardTitle>
        <CardDescription>
          Real-time monitoring of mobile loading performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 px-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Network Type</p>
              <p className="font-medium">{network.effectiveConnectionType}</p>
              {network.saveDataEnabled && (
                <div className="mt-1 text-xs bg-amber-50 text-amber-700 p-1 rounded">
                  Data Saver Mode Active
                </div>
              )}
            </div>
            
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-500">LCP Time</p>
              <p className="font-medium">
                {metrics.aboveTheFoldTime 
                  ? `${Math.round(metrics.aboveTheFoldTime)}ms` 
                  : 'Measuring...'}
              </p>
              {metrics.aboveTheFoldTime && metrics.aboveTheFoldTime > 2500 && (
                <div className="mt-1 text-xs bg-red-50 text-red-700 p-1 rounded">
                  Needs Improvement
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Cache Hit Rate</p>
              <p className="font-medium">
                {metrics.totalLoaded > 0 
                  ? `${Math.round(metrics.cacheHitRate * 100)}%` 
                  : 'No data'}
              </p>
              <p className="text-xs text-gray-400">
                {metrics.totalLoaded} images loaded
              </p>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-500">Avg. Image Load</p>
              <p className="font-medium">
                {metrics.imageLoadTimes.length > 0 
                  ? `${Math.round(averageLoadTime)}ms` 
                  : 'No data'}
              </p>
              {metrics.slowestImageUrl && (
                <div className="mt-1 text-xs truncate" title={metrics.slowestImageUrl}>
                  Slowest: {Math.round(metrics.slowestImageTime || 0)}ms
                </div>
              )}
            </div>
          </div>
                    
          <div className="flex items-center p-3 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              These metrics are collected in real-time as users interact with the site.
              For optimal mobile performance, aim for an LCP under 2.5s and high cache hit rates.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobilePerformanceMonitor;
