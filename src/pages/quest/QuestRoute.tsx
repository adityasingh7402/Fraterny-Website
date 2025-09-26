import React, { useEffect } from 'react';
import QuestPage from './QuestPage';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { setMeta, clearDynamicMetaTags } from "@/utils/seo";

/**
 * Route component for the Quest system
 * Can be easily added to the application router
 */
export function QuestRoute() {
    useEffect(() => {
  // Clear any existing dynamic meta tags first
  clearDynamicMetaTags();
  
  const assessmentTitle = "Start Free Assessment — Quest by Fraterny";
  const assessmentDescription = "Begin the Quest assessment. Answer focused questions and generate a precise profile that powers your personalized PDF and next-step actions.";
  const assessmentCanonical = "https://fraterny.in/assessment";
  const assessmentImage = "https://fraterny.in/og-image2.png"; // Using quest-related image
  
  setMeta({
    title: assessmentTitle,
    description: assessmentDescription,
    canonical: assessmentCanonical,
    robots: "index, follow",
    ogTitle: assessmentTitle,
    ogDescription: assessmentDescription,
    ogImage: assessmentImage,
    ogUrl: assessmentCanonical
  });

  // Cleanup function
  return () => {
    clearDynamicMetaTags();
  };
}, []);

  return (
   <>
    <div className='relative z-10'>
      {/* <div className='mb-20'>
      <Navigation />
      </div> */}
      <QuestPage />
    </div>
    {/* <Footer /> */}
   </>
  )
}

export default QuestRoute;
