// import React from 'react';
// import { motion } from 'framer-motion';
// import { useQuest } from '../core/useQuest';
// import { ProgressBar } from '../progress/ProgressBar';

// interface QuestHeaderProps {
//   title: string;
//   subtitle?: string;
//   showProgress?: boolean;
//   className?: string;
// }

// /**
//  * Header component for the quest system
//  * Displays title, subtitle, and optional progress bar
//  */
// export function QuestHeader({
//   title,
//   subtitle,
//   showProgress = true,
//   className = ''
// }: QuestHeaderProps) {
//   const { 
//     session, 
//     currentQuestion, 
//     questions, 
//     progress 
//   } = useQuest();
  
//   return (
//     <header className={`quest-header py-4 px-4 md:px-6 ${className}`}>
//       <div className="max-w-3xl mx-auto">
//         {/* Title and subtitle */}
//         <div className="mb-4">
//           <motion.h1 
//             className="text-2xl md:text-3xl font-playfair text-navy"
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {title}
//           </motion.h1>
          
//           {subtitle && (
//             <motion.p 
//               className="text-sm text-gray-600 mt-1"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               {subtitle}
//             </motion.p>
//           )}
//         </div>
        
//         {/* Progress bar */}
//         {showProgress && session && (
//           <ProgressBar 
//             currentValue={session.currentQuestionIndex || 0}
//             totalValue={questions.length}
//             showLabel={true}
//             showMilestones={true}
//           />
//         )}
//       </div>
//     </header>
//   );
// }

// export default QuestHeader;

import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { ProgressBar } from '../progress/ProgressBar';

interface QuestHeaderProps {
  title: string;
  subtitle?: string;
  showProgress?: boolean;
  className?: string;
}


export function QuestHeader({
  title,
  subtitle,
  showProgress = true,
  className = ''
}: QuestHeaderProps) {
  const { 
    session, 
    currentQuestion, 
    questions, 
    progress 
  } = useQuest();

  // Helper function to count responses in current section
  const getResponseCountForCurrentSection = () => {
    if (!session?.responses) return 0;
    return questions.filter(q => session.responses && session.responses[q.id]).length;
  };
  
  return (
    <header className={` ${className}`}>
      <div className="">
        {/* Progress bar - MOVED ABOVE TITLE */}
        {showProgress && session && (
          <div className="mb-4">
            <ProgressBar 
              currentValue={getResponseCountForCurrentSection()}
              totalValue={questions.length}
              showLabel={true}
              showMilestones={true}
            />
          </div>
        )}
      
      </div>
    </header>
  );
}