
import React, { lazy, Suspense, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { initializeAnalytics } from '@/utils/analyticsInitializer';
import { trackPageView } from '@/services/analyticsService';
import { updateDaysLeftCount } from '@/services/website-settings';
import { scheduleAtMidnight } from '@/utils/dateUtils';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';
import { registerServiceWorker } from '@/utils/serviceWorkerRegistration';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { cacheCoordinator, syncWithServiceWorker } from '@/services/cache';

// Lazy load components that are below the fold
const NavalQuote = lazy(() => import('../components/NavalQuote'));
const VillaLab = lazy(() => import('../components/VillaLab'));
const OurValues = lazy(() => import('../components/OurValues'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));

// Simple loading fallback with better UX
const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

// Critical paths to preload for better performance
const CRITICAL_IMAGE_KEYS = [
  "hero-background", 
  "logo-main", 
  "villa-thumbnail"
];

const Index = () => {
  // Initialize analytics and performance monitoring
  useEffect(() => {
    // Initialize analytics tracking
    initializeAnalytics();
    
    // Track this specific page view
    trackPageView('/');
    
    // Initial days left update
    console.log('Running initial days left update check');
    updateDaysLeftCount().then(success => {
      if (success) {
        console.log('Successfully updated days left count on page load');
      } else {
        console.error('Failed to update days left count on page load');
      }
    });
    
    // Set up automatic update of days left count at midnight IST
    const autoUpdateCleanup = scheduleAtMidnight(() => {
      console.log('Automatically updating days left count at midnight IST');
      updateDaysLeftCount().then(success => {
        if (success) {
          console.log('Successfully updated days left count');
        } else {
          console.error('Failed to update days left count');
        }
      });
    }, 'Asia/Kolkata');
    
    // Initialize localStorage cache service
    try {
      localStorageCacheService.initialize();
      console.log('LocalStorage cache service initialized');
      
      // Clean expired entries from local storage
      localStorageCacheService.cleanExpired();
    } catch (error) {
      console.warn('Failed to initialize localStorage cache:', error);
    }
    
    // Initialize service worker and cache sync
    try {
      // Sync with service worker
      syncWithServiceWorker().then(success => {
        if (success) {
          console.log('Successfully synced cache coordinator with service worker');
        } else {
          console.warn('Service worker not available for sync - continuing without caching');
        }
      }).catch(error => {
        console.warn('Failed to sync with service worker:', error);
      });
    } catch (error) {
      console.warn('Failed to sync with service worker:', error);
    }
    
    // Register service worker for improved caching
    registerServiceWorker()
      .then(registration => {
        if (registration) {
          console.log('Service Worker registered for enhanced caching');
        }
      })
      .catch(error => {
        console.warn('Service Worker registration failed:', error);
      });
    
    // Return a composite cleanup function
    return () => {
      autoUpdateCleanup?.();
    };
  }, []);

  // Memoize critical image paths to prevent recreating the array on each render
  const criticalImagePaths = React.useMemo(() => {
    return CRITICAL_IMAGE_KEYS.map(key => `/images/${key}.webp`);
  }, []);

  // Preload critical images for main page - only once with memoized paths
  useImagePreloader(
    criticalImagePaths, 
    true, 
    { 
      priority: 'high',
      // Add a unique name to help with debugging
      name: 'index-critical-images'
    }
  );

  // Create refs for each section to use with intersection observer
  const [villasRef, isVillasVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '300px',
    triggerOnce: true
  });
  
  const [valuesRef, isValuesVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '300px',
    triggerOnce: true
  });
  
  const [howItWorksRef, isHowItWorksVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '300px',
    triggerOnce: true
  });

  // Don't use CdnInitializer here at all to prevent React errors
  // We'll initialize the CDN settings directly
  useEffect(() => {
    // Initialize CDN setting if not already set
    if (typeof window !== 'undefined') {
      // Check if the CDN storage key exists in localStorage
      const CDN_STORAGE_KEY = 'cdn_enabled';
      
      if (localStorage.getItem(CDN_STORAGE_KEY) === null) {
        console.log('[CDN Initializer] Setting CDN to enabled by default');
        localStorage.setItem(CDN_STORAGE_KEY, 'true');
      }
      
      const isCdnEnabled = localStorage.getItem(CDN_STORAGE_KEY) === 'true';
      console.log(`[CDN Initializer] CDN is currently ${isCdnEnabled ? 'enabled' : 'disabled'}`);
      
      // Test CDN on first load only if enabled
      if (isCdnEnabled) {
        import('@/utils/cdn').then(({ testCdnConnection }) => {
          testCdnConnection()
            .then(isAvailable => {
              console.log('[CDN] Connection test result:', isAvailable ? 'Available' : 'Unavailable');
            })
            .catch(error => {
              console.error('[CDN] Error testing connection:', error);
            });
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Use Intersection Observer to lazy load components */}
      <Suspense fallback={<LoadingFallback />}>
        <NavalQuote />
      </Suspense>
      
      <div ref={villasRef}>
        {isVillasVisible && (
          <Suspense fallback={<LoadingFallback />}>
            <VillaLab />
          </Suspense>
        )}
      </div>
      
      <div ref={valuesRef}>
        {isValuesVisible && (
          <Suspense fallback={<LoadingFallback />}>
            <OurValues />
          </Suspense>
        )}
      </div>
      
      <div ref={howItWorksRef}>
        {isHowItWorksVisible && (
          <Suspense fallback={<LoadingFallback />}>
            <HowItWorks />
          </Suspense>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Simple error boundary component to catch errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode }, 
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error in component:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null; // Render nothing if there's an error
    }

    return this.props.children;
  }
}

export default Index;
