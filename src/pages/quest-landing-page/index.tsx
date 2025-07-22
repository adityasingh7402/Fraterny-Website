// // In /pages/quest-landing-page/index.tsx
// import React from 'react';
// import { MotionProvider } from '../../components/quest-landing/animations';
// import { Hero } from '../../components/quest-landing/sections';
// import { ScreenContainer } from '../../components/quest-landing/sections';

// const QuestLandingPage: React.FC = () => {
//   return (
//     <MotionProvider>
//       <div className="flex flex-col min-h-screen">
//         <main>
//           <ScreenContainer />
//           {/* Other sections will be added here */}
//         </main>
//       </div>
//     </MotionProvider>
//   );
// };

// export default QuestLandingPage;


// /pages/quest-landing-page/index.tsx
import React from 'react';
import { MotionProvider } from '../../components/quest-landing/animations';
import { ScreenContainer } from '../../components/quest-landing/sections';

const QuestLandingPage: React.FC = () => {
  // Handle analyze button click
  const handleAnalyzeClick = () => {
    console.log('Analyze Me button clicked from main page');
    // Add any additional logic here if needed
  };

  return (
    <MotionProvider>
      <div className="flex flex-col min-h-screen">
        <main>
          <ScreenContainer onAnalyzeClick={handleAnalyzeClick} />
          {/* Other sections will be added here */}
        </main>
      </div>
    </MotionProvider>
  );
};

export default QuestLandingPage;