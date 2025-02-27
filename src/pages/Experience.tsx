
import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HeroSection from '../components/experience/HeroSection';
import TimelineSection from '../components/experience/TimelineSection';
import ImageGallery from '../components/experience/ImageGallery';

// Lazy load components that are below the fold
const TribeSection = lazy(() => import('../components/experience/TribeSection'));
const DepthSection = lazy(() => import('../components/experience/DepthSection'));

const Experience = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Timeline Section */}
      <TimelineSection />

      {/* Experience Images Section */}
      <ImageGallery />

      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
        <TribeSection />
        <DepthSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Experience;
