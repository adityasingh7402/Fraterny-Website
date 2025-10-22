
import { lazy, Suspense, useEffect } from 'react';
import { setMeta } from "@/utils/seo";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../components/experience/HeroSection';
import { useIsMobile } from '../hooks/use-mobile';

// Lazy load components that are below the fold
// const TimelineSection = lazy(() => import('../components/experience/TimelineSection'));
// const ImageGallery = lazy(() => import('../components/experience/ImageGallery'));
// const TribeSection = lazy(() => import('../components/experience/TribeSection'));
// const DepthSection = lazy(() => import('../components/experience/DepthSection'));

import TimelineSection from '../components/experience/TimelineSection';
import ImageGallery from '../components/experience/ImageGallery';
import TribeSection from '../components/experience/TribeSection';
import DepthSection from '../components/experience/DepthSection';
import AboutFratVilla from '@/components/experience/AboutFratVilla';

// Better loading fallback
const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

const Experience = () => {
    useEffect(() => {
    setMeta({
      title: "FratVilla Experience — Luxury Retreat for Ambitious Minds",
      description:
        "Spend a week in a luxury villa setting with 20 dreamers designed for growth, connection, and unforgettable moments.",
      canonical: "https://fraterny.in/experience"
    });
  }, []);

  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Critical path, load eagerly */}
      <HeroSection />
      <AboutFratVilla />
      <TimelineSection />

      {/* Image Gallery - hidden on mobile */}
      {!isMobile && (
        <Suspense fallback={<LoadingFallback />}>
          <ImageGallery />
        </Suspense>
      )}

      {/* Tribe Section */}
      <Suspense fallback={<LoadingFallback />}>
        <TribeSection />
      </Suspense>

      {/* Depth Section */}
      <Suspense fallback={<LoadingFallback />}>
        <DepthSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Experience;
