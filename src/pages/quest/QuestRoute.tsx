import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QuestPage from './QuestPage';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { setMeta, clearDynamicMetaTags } from "@/utils/seo";
import { createTrackingEvent, getDeviceInfo, getUserIP } from '@/services/tracking';

/**
 * Route component for the Quest system
 * Can be easily added to the application router
 */
export function QuestRoute() {
  const [searchParams] = useSearchParams();

  // Track affiliate click event
  useEffect(() => {
    console.log('🔍 QuestRoute mounted, checking for ref param...');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));
    
    const refCode = searchParams.get('ref');
    console.log('🔍 Extracted refCode:', refCode);
    
    if (refCode) {
      // Save to localStorage
      localStorage.setItem('referred_by', refCode);
      console.log('✅ Affiliate ref saved to localStorage:', refCode);
      console.log('✅ Verified localStorage value:', localStorage.getItem('referred_by'));
      
      // Track click event
      const trackClick = async () => {
        try {
          const deviceInfo = getDeviceInfo();
          const ipAddress = await getUserIP();
          
          await createTrackingEvent({
            affiliate_code: refCode,
            event_type: 'click',
            user_id: null,
            session_id: null,
            test_id: null,
            ip_address: ipAddress,
            device_info: deviceInfo,
            location: null,
            metadata: {
              referrer: document.referrer || 'direct',
              landing_page: window.location.href
            }
          });
          
          console.log('✅ Click event tracked for affiliate:', refCode);
        } catch (error) {
          console.error('❌ Failed to track click event:', error);
        }
      };
      
      trackClick();
    }
  }, [searchParams]);

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
