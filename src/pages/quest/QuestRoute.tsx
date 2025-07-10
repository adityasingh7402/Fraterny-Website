import React from 'react';
import { QuestTestPage } from './QuestTestPage';
import QuestPage from './QuestPage';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

/**
 * Route component for the Quest system
 * Can be easily added to the application router
 */
export function QuestRoute() {
  return (
   <>
    <div className='mx-auto px-6 relative z-10'>
      <div className='mb-20'>
      <Navigation />
      </div>
      <QuestPage />
    </div>
    <Footer />
   </>
  )
}

export default QuestRoute;