import React, { useEffect } from 'react';
import QuestPage from './QuestPage';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { setMeta } from "@/utils/seo";

/**
 * Route component for the Quest system
 * Can be easily added to the application router
 */
export function QuestRoute() {
    useEffect(() => {
    setMeta({
      title: "Start Free Assessment — Quest by Fraterny",
      description:
        "Begin the Quest assessment. Answer focused questions and generate a precise profile that powers your personalized PDF and next-step actions.",
      canonical: "https://fraterny.in/assessment"
    });
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
