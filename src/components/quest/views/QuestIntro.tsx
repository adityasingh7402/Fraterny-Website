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


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { QuestLayout } from '../layout/QuestLayout';
import { QuestionSection } from '../core/types';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { BouncingWord } from './questbouncing/BouncingWord';
import {useIsMobile} from './questbouncing/use-mobile';
import { Link } from 'react-router-dom';
import img from '../../../../public/Vector.svg';
import { clearQuestTags } from '../utils/questStorage';


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
  // const estimatedTimeInMinutes = Math.ceil(allQuestions.length * 0.7); // Roughly 40 seconds per question
  // const timeRange = `${estimatedTimeInMinutes}-${estimatedTimeInMinutes + 5} mins`;
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const isMobile = useIsMobile();

  const [hasUnfinishedQuest, setHasUnfinishedQuest] = useState(false);

useEffect(() => {
  // Check on mount
  const savedSession = localStorage.getItem('fraterny_quest_session');
  if (savedSession) {
    try {
      JSON.parse(savedSession); // Validate JSON
      setHasUnfinishedQuest(true);
      // Show toast immediately
      toast.info("You have an unfinished quest. Resume the test to finish it", {
        position: "top-right"
      });
    } catch (error) {
      // Corrupted - clear it
      localStorage.removeItem('fraterny_quest_session');
      setHasUnfinishedQuest(false);
    }
  }
}, []);

// Conditional button text
const buttonText = hasUnfinishedQuest ? "Resume" : "Get Started";
  
const handleStart = async () => {
  if (!isTermsAccepted) {
     toast.error("Hey, You'll have to accept the terms and conditions to start the test", {
      position: "top-right"
    });
    return;
  }
  // clearQuestTags();
  if (!hasUnfinishedQuest) {
    clearQuestTags();
  }
  await startQuest();
  if (onStart) onStart();
};

// New checkbox handler
const handleTermsChange = (checked: boolean) => {
  setIsTermsAccepted(checked);
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
    <section className='bg-sky-800 flex flex-col justify-between h-dvh overflow-hidden'>

        <div className='flex items-start pt-4 justify-center invert h-1/3'>
          <img src={img} alt="Quest Footer" className='h-[50px] w-auto' />
        </div>

        <div className=' pl-5 xs:pr-0 py-2'>
          <div className="justify-start text-white text-4xl font-normal font-['Gilroy-Regular'] mb-1">Let&apos;s get you</div>
          <div className="justify-start text-white text-6xl font-bold font-['Gilroy-Bold'] mb-3">Analysed.</div>
          <div className="w-full justify-start text-white text-xl font-normal font-['Gilroy-Regular'] mb-3">A 15 minute guided self-reflection. The more thoughtful your responses, the deeper the insights.</div>
          <label className='flex gap-2 mb-3 cursor-pointer'>
            {/* checkbox code from above */}
            <label className="relative inline-block w-5 h-5 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => handleTermsChange(e.target.checked)}
                className="sr-only"
              />
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isTermsAccepted ? 'white' : 'rgb(7 89 133)', // sky-800
                  scale: isTermsAccepted ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 rounded-[3px] border-[1.50px] border-white flex items-center justify-center mt-5"
              >
                {isTermsAccepted && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-3 h-3 text-sky-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                )}
              </motion.div>
            </label>
            <div className='justify-start text-white text-xl font-normal font-["Gilroy-Regular"] pr-1 pt-5 pb-2'>
              I agree to the <Link to="/terms-of-use" className="text-white text-xl font-normal font-['Gilroy-Medium'] underline">Terms and Use</Link> and <Link to="/privacy-policy" className="text-white text-xl font-normal font-['Gilroy-Medium'] underline">Privacy Policy</Link>
            </div>
          </label>
          <div className='w-full pr-3 pb-5'>
          <button 
          onClick={handleStart}
          className="pt-2 w-full h-14 mix-blend-luminosity bg-gradient-to-br from-white/20 to-white/20 rounded-[30px] border-2 border-white flex items-center justify-center leading-[1px]">
            <div className='flex gap-0'>
              <div className="w-full text-white text-2xl font-normal font-['Gilroy-Bold'] tracking-tighter">{buttonText}</div>
              <ChevronRight className="w-8 h-8 text-white items-center justify-center pt-2" />
          </div>
          </button>
          </div>

        </div>

      </section>
  );
}

export default QuestIntro;
