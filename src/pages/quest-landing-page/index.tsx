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
import ScreenContainer from '../../components/quest-landing/sections/ScreenContainer'
import MotionProvider from '../../components/quest-landing/animations/MotionProvider';
import { setMeta } from '../../utils/seo';
import { clearDynamicMetaTags } from '../../utils/seo'; // Import the cleanup function

const QuestLandingPage: React.FC = () => {
  const handleAnalyzeClick = () => {
    console.log('Analyze Me clicked - you can add your logic here');
    // Add any additional logic you need when the button is clicked
  };
  
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

