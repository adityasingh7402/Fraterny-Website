
import { lazy, Suspense, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { initializeAnalytics } from '@/utils/analyticsInitializer';
import { trackPageView } from '@/services/analyticsService';
import { updateDaysLeftCount } from '@/services/website-settings';
import { scheduleAtMidnight } from '@/utils/dateUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    
    // Return a composite cleanup function
    return () => {
      autoUpdateCleanup?.();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* CDN Testing Banner (temporary) */}
      <div className="container mx-auto px-4 my-4">
        <Card className="bg-sky-50 border-sky-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-medium text-navy">CDN Implementation Testing</h3>
              <p className="text-sm text-gray-600">Use these tools to verify CDN functionality</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button asChild size="sm" variant="outline">
                <Link to="/cdn-test">Test Page</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/cdn-debug">Debug Tool</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
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
