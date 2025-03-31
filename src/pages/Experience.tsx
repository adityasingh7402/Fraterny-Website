
import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../components/experience/HeroSection';
import { useIsMobile } from '../hooks/use-mobile';

// Lazy load components that are below the fold
const TimelineSection = lazy(() => import('../components/experience/TimelineSection'));
const ImageGallery = lazy(() => import('../components/experience/ImageGallery'));
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
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Critical path, load eagerly */}
      <HeroSection />

      {/* Timeline Section */}
      <Suspense fallback={<LoadingFallback />}>
        <TimelineSection />
      </Suspense>

      {/* Image Gallery - hidden on mobile */}
      {!isMobile && (
        <Suspense fallback={<LoadingFallback />}>
          <ImageGallery />
        </Suspense>
      )}
      
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
