import { lazy, Suspense, useEffect, useRef } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { initializeLightweightAnalytics, updateDaysLeftSimple } from '@/utils/lightweightAnalytics';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

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

const Index = () => {
  // Get settings for registration date
  const { settings, isLoading } = useReactQueryWebsiteSettings();
  const prevRegCloseDate = useRef<string | null>(null);

  // Initialize lightweight analytics and performance monitoring - Non-blocking
  useEffect(() => {
    // Defer analytics initialization to not block initial render
    const analyticsTimeout = setTimeout(() => {
      // Initialize lightweight analytics tracking (no heavy imports)
      initializeLightweightAnalytics();
    }, 500); // Delay analytics to prioritize content rendering

    return () => clearTimeout(analyticsTimeout);
  }, []);

  // Watch for changes to registration_close_date and update days left
  useEffect(() => {
    if (!isLoading && settings?.registration_close_date) {
      if (prevRegCloseDate.current !== settings.registration_close_date) {
        updateDaysLeftSimple(settings.registration_close_date);
        prevRegCloseDate.current = settings.registration_close_date;
      }
    }
  }, [settings?.registration_close_date, isLoading]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Use Intersection Observer to lazy load components */}
      <Suspense fallback={<LoadingFallback />}>
        <NavalQuote />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <VillaLab />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <OurValues />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <HowItWorks />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default Index;