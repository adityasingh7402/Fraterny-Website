
import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import OurValues from '../components/OurValues';

// Lazy load components that are below the fold
const NavalQuote = lazy(() => import('../components/NavalQuote'));
const VillaLab = lazy(() => import('../components/VillaLab'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));

// Simple loading fallback
const LoadingFallback = () => <div className="h-48 flex items-center justify-center">Loading...</div>;

const Index = () => {
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
