// import React from 'react';
// import { motion } from 'framer-motion';
// import { useQuest } from '../core/useQuest';
// import { QuestLayout } from '../layout/QuestLayout';
// import { QuestContainer } from '../layout/QuestContainer';
// import { questionSummary } from '../core/questions';

// interface QuestIntroProps {
//   onStart?: () => void;
//   className?: string;
// }

// /**
//  * Introduction screen for the quest
//  * Provides overview and start button
//  */
// export function QuestIntro({ onStart, className = '' }: QuestIntroProps) {
//   const { startQuest, sections } = useQuest();
  
//   // Start the quest when the button is clicked
//   const handleStart = async () => {
//     await startQuest();
//     if (onStart) onStart();
//   };
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.2
//       }
//     }
//   };
  
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { 
//         type: "spring",
//         stiffness: 100,
//         damping: 20
//       }
//     }
//   };
  
//   return (
//     <QuestLayout showNavigation={false} className={className}>
//       <QuestContainer variant="card">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="max-w-xl mx-auto"
//         >
//           <motion.div variants={itemVariants} className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-playfair text-navy mb-3">
//               Psychology Assessment
//             </h1>
//             <p className="text-gray-600">
//               Understanding your personality, mindset, emotions, and inner drivers.
//             </p>
//           </motion.div>
          
//           <motion.div variants={itemVariants} className="mb-8">
//             <div className="bg-navy/5 rounded-lg p-4 mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-medium text-navy">Estimated Time</span>
//                 <span className="text-navy">{questionSummary.estimatedTimeMinutes.min}-{questionSummary.estimatedTimeMinutes.max} mins</span>
//               </div>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-medium text-navy">Total Questions</span>
//                 <span className="text-navy">{questionSummary.totalQuestions}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-navy">Sections</span>
//                 <span className="text-navy">{questionSummary.sectionCount}</span>
//               </div>
//             </div>
            
//             <p className="text-gray-600 mb-4">
//               This assessment is designed to deeply understand your personality through simple yet thought-provoking questions.
//             </p>
            
//             <ul className="space-y-2 mb-4">
//               <li className="flex items-start">
//                 <span className="text-terracotta mr-2">•</span>
//                 <span className="text-gray-600">Answer however you feel like. Try to be honest to improve accuracy.</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-terracotta mr-2">•</span>
//                 <span className="text-gray-600">You can choose to answer "I don't know" or "I'm not sure" if you prefer.</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-terracotta mr-2">•</span>
//                 <span className="text-gray-600">Your data is safe and secure. We respect your privacy.</span>
//               </li>
//             </ul>
            
//             <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
//               <h3 className="font-medium text-navy mb-2">Question Types</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="bg-white rounded p-3 border-l-4 border-l-terracotta">
//                   <div className="text-sm font-medium text-navy">Easy</div>
//                   <div className="text-xs text-gray-500">{questionSummary.easyQuestions} questions</div>
//                 </div>
//                 <div className="bg-white rounded p-3 border-l-4 border-l-navy">
//                   <div className="text-sm font-medium text-navy">Medium</div>
//                   <div className="text-xs text-gray-500">{questionSummary.mediumQuestions} questions</div>
//                 </div>
//                 <div className="bg-white rounded p-3 border-l-4 border-l-gold">
//                   <div className="text-sm font-medium text-navy">Hard</div>
//                   <div className="text-xs text-gray-500">{questionSummary.hardQuestions} questions</div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
          
//           <motion.div variants={itemVariants} className="text-center">
//             <motion.button
//               onClick={handleStart}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-8 py-3 bg-terracotta text-white rounded-lg font-medium text-lg hover:bg-terracotta/90 transition-colors shadow-md hover:shadow-lg"
//             >
//               Start Assessment
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </QuestContainer>
//     </QuestLayout>
//   );
// }

// export default QuestIntro;


import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { QuestLayout } from '../layout/QuestLayout';
import { QuestionSection } from '../core/types';

interface QuestIntroProps {
  onStart: () => void;
  className?: string;
}

/**
 * Introduction screen for the quest
 * Provides overview, instructions, and start button
 */
export function QuestIntro({
  onStart,
  className = ''
}: QuestIntroProps) {
  const { sections, allQuestions, startQuest } = useQuest();
  
  // Calculate estimated completion time
  const estimatedTimeInMinutes = Math.ceil(allQuestions.length * 0.7); // Roughly 40 seconds per question
  const timeRange = `${estimatedTimeInMinutes}-${estimatedTimeInMinutes + 5} mins`;
  
  // Start the quest when the button is clicked
  const handleStart = async () => {
    await startQuest();
    if (onStart) onStart();
  };
  
  // Animated variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <QuestLayout showHeader={false} showNavigation={false} className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 py-8 text-center md:text-left"
      >
        {/* Header */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-playfair text-navy mb-2"
        >
          Psychology Assessment
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 mb-8"
        >
          Understanding your personality, mindset, emotions, and inner drivers.
        </motion.p>
        
        {/* Key info */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6 grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-sm text-gray-500">Estimated Time</div>
            <div className="font-medium">{timeRange}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Questions</div>
            <div className="font-medium">{allQuestions.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Sections</div>
            <div className="font-medium">{sections.length}</div>
          </div>
        </motion.div>
        
        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-6 text-gray-700"
        >
          This assessment is designed to deeply understand your personality through
          simple yet thought-provoking questions.
        </motion.p>
        
        {/* Sections overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-medium text-navy mb-4">What You'll Explore</h2>
          
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 items-center"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium ${
                    index % 3 === 0 ? 'bg-terracotta/10 text-terracotta' :
                    index % 3 === 1 ? 'bg-navy/10 text-navy' :
                    'bg-gold/10 text-gold'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-navy">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {section.questions.length} questions
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Instructions */}
        <motion.div variants={itemVariants} className="mb-8">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-terracotta mr-2">•</span> 
              Answer however you feel like. Try to be honest to improve accuracy.
            </li>
            <li className="flex items-start">
              <span className="text-terracotta mr-2">•</span> 
              You can choose to answer "I don't know" or "I'm not sure" if you prefer.
            </li>
            <li className="flex items-start">
              <span className="text-terracotta mr-2">•</span> 
              Your data is safe and secure. We respect your privacy.
            </li>
          </ul>
        </motion.div>
        
        {/* Start button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center md:justify-start"
        >
          <motion.button
            onClick={handleStart}  // Changed to use handleStart instead of onStart directly
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium text-lg"
          >
            Start Assessment
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestLayout>
  );
}

export default QuestIntro;