// "use client"
// import React, { useEffect } from 'react';
// import ScreenContainer from '../../components/quest-landing/sections/ScreenContainer'
// import MotionProvider from '../../components/quest-landing/animations/MotionProvider';
// import { setMeta } from '../../utils/seo';

// const QuestLandingPage: React.FC = () => {
//   const handleAnalyzeClick = () => {
//     console.log('Analyze Me clicked - you can add your logic here');
//     // Add any additional logic you need when the button is clicked
//   };
  
//   useEffect(() => {
//     setMeta({
//       title: "Quest: 15-Minute Self-Awareness Test + Detailed Analysis | Fraterny",
//       description:
//         "Run Quest in 15 minutes. Free test with optional paid PDF. Map thought patterns, get a 35+ page report. ",
//       canonical: "https://fraterny.in/quest"
//     });
//   }, []);

//   // return (
//   //   <MotionProvider>
//   //       <ScreenContainer 
//   //         onAnalyzeClick={handleAnalyzeClick}
//   //         className=""
//   //         onNavigateToSection={(screen, section) => {
//   //           console.log('🎯 Page level navigation called:', { screen, section });
//   //         }}
//   //       />
//   //   </MotionProvider>
//   // );
//   return (
//   <MotionProvider>
//       <ScreenContainer 
//         onAnalyzeClick={handleAnalyzeClick}
//         className=""
//         onNavigateToSection={(screen, section) => {
//           console.log('🎯 Page level navigation called:', { screen, section });
//         }}
//       />
//     </MotionProvider>
//   );
// };
// export default QuestLandingPage;

// ----------------------------------------------

"use client"
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ScreenContainer from '../../components/quest-landing/sections/ScreenContainer'
import MotionProvider from '../../components/quest-landing/animations/MotionProvider';
import { setMeta } from '../../utils/seo';
import { clearDynamicMetaTags } from '../../utils/seo'; // Import the cleanup function
import { createTrackingEvent, getDeviceInfo, getUserIP } from '@/services/tracking';

const QuestLandingPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const handleAnalyzeClick = () => {
    console.log('Analyze Me clicked - you can add your logic here');
    // Add any additional logic you need when the button is clicked
  };
  
  // Track affiliate click event
  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      // Save to localStorage
      localStorage.setItem('referred_by', refCode);
      console.log('✅ Affiliate ref saved:', refCode);
      
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
  
  const questTitle = "Quest: 15-Minute Self-Awareness Test + Detailed Analysis | Fraterny";
  const questDescription = "Run Quest in 15 minutes. Free test with optional paid PDF. Map thought patterns, get a 35+ page report.";
  const questCanonical = "https://fraterny.in/quest";
  const questImage = "https://fraterny.in/og-image2.png"; // Using your existing quest image
  
  setMeta({
    title: questTitle,
    description: questDescription,
    canonical: questCanonical,
    robots: "index, follow",
    ogTitle: questTitle,
    ogDescription: questDescription,
    ogImage: questImage,
    ogUrl: questCanonical
  });

  // Cleanup function
  return () => {
    clearDynamicMetaTags();
  };
}, []);

  // return (
  //   <MotionProvider>
  //       <ScreenContainer 
  //         onAnalyzeClick={handleAnalyzeClick}
  //         className=""
  //         onNavigateToSection={(screen, section) => {
  //           console.log('🎯 Page level navigation called:', { screen, section });
  //         }}
  //       />
  //   </MotionProvider>
  // );
  return (
  <MotionProvider>
      <ScreenContainer 
        onAnalyzeClick={handleAnalyzeClick}
        className=""
        onNavigateToSection={(screen, section) => {
          console.log('🎯 Page level navigation called:', { screen, section });
        }}
      />
    </MotionProvider>
  );
};
export default QuestLandingPage;

