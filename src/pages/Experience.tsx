
import { lazy, Suspense, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../components/experience/HeroSection';
import TimelineSection from '../components/experience/TimelineSection';
import ImageGallery from '../components/experience/ImageGallery';
import { useIsMobile } from '../hooks/use-mobile';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';

// Lazy load components that are below the fold
const TribeSection = lazy(() => import('../components/experience/TribeSection'));
const DepthSection = lazy(() => import('../components/experience/DepthSection'));

// Better loading fallback
const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

const Experience = () => {
  const isMobile = useIsMobile();
  
  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Timeline Section */}
      <TimelineSection />

      {/* Image Gallery - hidden on mobile */}
      {!isMobile && <ImageGallery />}
      
      {/* Depth Section */}
      <Suspense fallback={<LoadingFallback />}>
        <DepthSection />
      </Suspense>

      {/* Tribe Section */}
      <Suspense fallback={<LoadingFallback />}>
        <TribeSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Experience;
