
import { lazy, Suspense, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import OurValues from '../components/OurValues';
import { initPerformanceMonitoring, trackResourceTiming } from '@/utils/performanceMonitoring';

// Lazy load components that are below the fold
const NavalQuote = lazy(() => import('../components/NavalQuote'));
const VillaLab = lazy(() => import('../components/VillaLab'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));

// Simple loading fallback with better UX
const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

const Index = () => {
  // Initialize performance monitoring
  useEffect(() => {
    // Track performance metrics
    initPerformanceMonitoring();
    
    // Track image resources specifically
    trackResourceTiming('webp');
    trackResourceTiming('png');
    trackResourceTiming('jpg');
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      <Suspense fallback={<LoadingFallback />}>
        <NavalQuote />
        <VillaLab />
        <OurValues />
        <HowItWorks />
      </Suspense>
      
      <Footer />
    </div>
  );
};

export default Index;
