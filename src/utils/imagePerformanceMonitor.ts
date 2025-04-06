
/**
 * Specialized performance monitoring for image loading and rendering
 */

interface ImagePerformanceData {
  loadTimes: Record<string, number[]>;
  failedImages: Set<string>;
  cachedImages: Set<string>;
  totalImagesRequested: number;
  totalImagesLoaded: number;
  totalImagesFailed: number;
  loadingBySize: Record<string, number>;
}

// Store performance data
const imagePerformanceData: ImagePerformanceData = {
  loadTimes: {},
  failedImages: new Set(),
  cachedImages: new Set(),
  totalImagesRequested: 0,
  totalImagesLoaded: 0,
  totalImagesFailed: 0,
  loadingBySize: {
    'original': 0,
    'small': 0,
    'medium': 0,
    'large': 0
  }
};

// Only enable in development mode by default
const isEnabled = process.env.NODE_ENV === 'development';

/**
 * Track start of image loading
 * @param imageKey Key or URL of the image
 * @param size Optional size variant
 */
export const trackImageLoadStart = (imageKey: string, size?: string): void => {
  if (!isEnabled) return;
  
  imagePerformanceData.totalImagesRequested++;
  
  if (size && imagePerformanceData.loadingBySize[size] !== undefined) {
    imagePerformanceData.loadingBySize[size]++;
  } else {
    imagePerformanceData.loadingBySize['original']++;
  }
  
  console.log(`[ImagePerf] Started loading: ${imageKey}${size ? ` (${size})` : ''}`);
};

/**
 * Track completion of image loading
 * @param imageKey Key or URL of the image
 * @param loadTime Time taken to load in ms
 * @param fromCache Whether the image was loaded from cache
 */
export const trackImageLoadComplete = (
  imageKey: string, 
  loadTime: number,
  fromCache: boolean = false
): void => {
  if (!isEnabled) return;
  
  imagePerformanceData.totalImagesLoaded++;
  
  if (fromCache) {
    imagePerformanceData.cachedImages.add(imageKey);
  }
  
  if (!imagePerformanceData.loadTimes[imageKey]) {
    imagePerformanceData.loadTimes[imageKey] = [];
  }
  
  imagePerformanceData.loadTimes[imageKey].push(loadTime);
  
  console.log(`[ImagePerf] Loaded ${imageKey} in ${loadTime.toFixed(2)}ms${fromCache ? ' (from cache)' : ''}`);
};

/**
 * Track image loading failure
 * @param imageKey Key or URL of the image
 * @param error Error that occurred
 */
export const trackImageLoadFailure = (imageKey: string, error?: any): void => {
  if (!isEnabled) return;
  
  imagePerformanceData.totalImagesFailed++;
  imagePerformanceData.failedImages.add(imageKey);
  
  console.error(`[ImagePerf] Failed to load: ${imageKey}`, error);
};

/**
 * Get image performance report
 * @returns Current image performance data
 */
export const getImagePerformanceReport = (): Readonly<ImagePerformanceData> => {
  return structuredClone(imagePerformanceData);
};

/**
 * Reset all image performance counters
 */
export const resetImagePerformanceCounters = (): void => {
  imagePerformanceData.loadTimes = {};
  imagePerformanceData.failedImages.clear();
  imagePerformanceData.cachedImages.clear();
  imagePerformanceData.totalImagesRequested = 0;
  imagePerformanceData.totalImagesLoaded = 0;
  imagePerformanceData.totalImagesFailed = 0;
  
  Object.keys(imagePerformanceData.loadingBySize).forEach(size => {
    imagePerformanceData.loadingBySize[size] = 0;
  });
};

/**
 * Print the current image performance report to console
 */
export const logImagePerformanceReport = (): void => {
  if (!isEnabled) return;
  
  console.group('Image Performance Report');
  
  console.log(`Total Images Requested: ${imagePerformanceData.totalImagesRequested}`);
  console.log(`Total Images Loaded: ${imagePerformanceData.totalImagesLoaded}`);
  console.log(`Total Images Failed: ${imagePerformanceData.totalImagesFailed}`);
  
  console.log('Images by Size:');
  console.table(imagePerformanceData.loadingBySize);
  
  if (imagePerformanceData.failedImages.size > 0) {
    console.log('Failed Images:');
    console.table([...imagePerformanceData.failedImages]);
  }
  
  console.log('Average Load Times:');
  const avgLoadTimes = Object.entries(imagePerformanceData.loadTimes)
    .map(([key, times]) => {
      const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
      return { key, avgLoadTime: Math.round(avg * 100) / 100, samples: times.length };
    })
    .sort((a, b) => b.avgLoadTime - a.avgLoadTime);
  
  console.table(avgLoadTimes);
  
  console.groupEnd();
};

// Expose the API
export default {
  trackImageLoadStart,
  trackImageLoadComplete,
  trackImageLoadFailure,
  getImagePerformanceReport,
  resetImagePerformanceCounters,
  logImagePerformanceReport
};
