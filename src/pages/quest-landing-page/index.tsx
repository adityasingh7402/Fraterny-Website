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

const QuestLandingPage: React.FC = () => {
  const handleAnalyzeClick = () => {
    console.log('Analyze Me clicked - you can add your logic here');
    // Add any additional logic you need when the button is clicked
  };
  
  useEffect(() => {
    setMeta({
      title: "Quest: 15-Minute Self-Awareness Test + Detailed Analysis | Fraterny",
      description:
        "Run Quest in 15 minutes. Free test with optional paid PDF. Map thought patterns, get a 35+ page report. ",
      canonical: "https://fraterny.in/quest"
    });
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

