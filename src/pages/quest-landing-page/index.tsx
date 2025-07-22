


// // /pages/quest-landing-page/index.tsx
// import React from 'react';
// import { MotionProvider } from '../../components/quest-landing/animations';
// import { ScreenContainer } from '../../components/quest-landing/sections';

// const QuestLandingPage: React.FC = () => {
//   // Handle analyze button click
//   const handleAnalyzeClick = () => {
//     console.log('Analyze Me button clicked from main page');
//     // Add any additional logic here if needed
//   };

//   return (
//     <MotionProvider>
//       <div className="flex flex-col min-h-screen">
//         <main>
//           <ScreenContainer onAnalyzeClick={handleAnalyzeClick} />
//           {/* Other sections will be added here */}
//         </main>
//       </div>
//     </MotionProvider>
//   );
// };

// export default QuestLandingPage;


// /src/pages/quest-landing-page/index.tsx

"use client"
import React from 'react';
import { MotionProvider } from '@/components/quest-landing/animations';
import { ScreenContainer } from '@/components/quest-landing/sections';

const QuestLandingPage: React.FC = () => {
  const handleAnalyzeClick = () => {
    console.log('Analyze Me clicked - you can add your logic here');
    // Add any additional logic you need when the button is clicked
  };

  return (
    <MotionProvider>
      <div className="quest-landing-page">
        <ScreenContainer 
          onAnalyzeClick={handleAnalyzeClick}
          className="w-full h-screen"
        />
      </div>
    </MotionProvider>
  );
};

export default QuestLandingPage;