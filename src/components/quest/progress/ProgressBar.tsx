// import React from 'react';
// import { motion } from 'framer-motion';
// import { useProgressAnimation } from '../animations/useProgressAnimation';

// interface ProgressBarProps {
//   currentValue: number;
//   totalValue: number;
//   showLabel?: boolean;
//   showMilestones?: boolean;
//   milestones?: number[];
//   animated?: boolean;
//   className?: string;
// }

// /**
//  * Progress bar component for tracking quest completion
//  * Features animated progress and milestone indicators
//  */
// export function ProgressBar({
//   currentValue,
//   totalValue,
//   showLabel = true,
//   showMilestones = true,
//   milestones = [25, 50, 75, 100],
//   animated = true,
//   className = ''
// }: ProgressBarProps) {
//   // Calculate progress percentage
//   const progressPercentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
  
//   // Use progress animation hook
//   const { 
//     progressControls, 
//     celebrationControls,
//     isAtMilestone,
//     currentMilestone
//   } = useProgressAnimation(currentValue, totalValue, {
//     animated,
//     celebrateAtMilestones: true,
//     milestones
//   });
  
//   // Determine progress bar color based on percentage
//   const getProgressColor = (): string => {
//     if (progressPercentage < 33) return 'bg-terracotta';
//     if (progressPercentage < 66) return 'bg-navy';
//     return 'bg-gold';
//   };
  
//   const progressColor = getProgressColor();
  
//   return (
//     <div className={`progress-bar w-full ${className}`}>
//       {/* Labels */}
//       {showLabel && (
//         <div className="flex justify-between mb-2 text-sm">
//           {/* <span className="text-navy font-medium">
//             Question {currentValue + 1} of {totalValue}
//           </span> */}
//           <span className="text-gray-500">
//             {Math.round(progressPercentage)}% complete
//           </span>
//         </div>
//       )}
      
//       {/* Progress bar */}
//       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//         <motion.div
//           className={`h-full rounded-full ${progressColor}`}
//           animate={progressControls}
//           initial={{ width: '0%' }}
//         />
//       </div>
      
//       {/* Milestone indicators */}
//       {showMilestones && (
//         <div className="relative h-0">
//           {milestones.map((milestone) => {
//             const isActive = progressPercentage >= milestone;
//             const isCurrent = Math.round(progressPercentage) === milestone;
            
//             return (
//               <motion.div
//                 key={milestone}
//                 className={`absolute top-[-8px] h-4 w-4 rounded-full border-2 border-white ${
//                   isActive ? progressColor : 'bg-gray-200'
//                 }`}
//                 style={{ left: `${milestone}%`, marginLeft: '-6px' }}
//                 animate={isCurrent ? celebrationControls : undefined}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProgressBar;



import React from 'react';
import { motion } from 'framer-motion';
import { useProgressAnimation } from '../animations/useProgressAnimation';
import { useQuest } from '../core/useQuest';

interface ProgressBarProps {
  currentValue: number;
  totalValue: number;
  showLabel?: boolean;
  showMilestones?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Progress bar component for tracking quest completion
 * Features animated progress and milestone indicators based on questions in the current section
 */
export function ProgressBar({
  currentValue,
  totalValue,
  showLabel = true,
  showMilestones = true,
  animated = true,
  className = ''
}: ProgressBarProps) {
  // Get sections from the quest context
  const { sections, currentSectionId, currentQuestion, session } = useQuest();
  
  // Find current section
  const currentSection = sections.find(section => section.id === currentSectionId);
  
  // Count of questions in the current section
  const questionsInSection = currentSection?.questions.length || 0;
  
  // Index of current question within the section
  const getQuestionIndexInSection = () => {
    if (!currentSection || !currentQuestion) return 0;
    
    return currentSection.questions.findIndex(q => q.id === currentQuestion.id);
  };
  
  const questionIndexInSection = getQuestionIndexInSection();
  // Count completed responses in current section
  const getCompletedResponsesInSection = () => {
    if (!session?.responses || !currentSection) return 0;
    return currentSection.questions.filter(q => session.responses && session.responses[q.id]).length;
  };
  
  // Calculate progress percentage within this section
  const sectionProgressPercentage = questionsInSection > 0 
  ? ((getCompletedResponsesInSection()) / questionsInSection) * 100 
  : 0;
  
  // Generate milestones based on the number of questions in the current section
  const generateMilestones = (): number[] => {
    if (!currentSection || questionsInSection === 0) {
      return [20, 40, 60, 80, 100]; // Fallback
    }
    
    // Create one milestone for each question
    return Array.from({ length: questionsInSection }, (_, index) => 
      ((index + 1) / questionsInSection) * 100
    );
  };
  
  const milestones = generateMilestones();
  
  // Use progress animation hook
  const { 
    progressControls, 
    celebrationControls
  } = useProgressAnimation(questionIndexInSection, questionsInSection, {
    animated,
    celebrateAtMilestones: true,
    milestones
  });
  
  // Determine progress bar color based on percentage
  const getProgressColor = (): string => {
    if (sectionProgressPercentage < 33) return 'bg-terracotta';
    if (sectionProgressPercentage < 66) return 'bg-navy';
    return 'bg-gold';
  };
  
  const progressColor = getProgressColor();
  
  return (
    <div className={`progress-bar w-full ${className}`}>
      {/* Labels */}
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-navy font-medium">
            Question {questionIndexInSection + 1} of {questionsInSection}
          </span>
          <span className="text-gray-500">
            {Math.round(sectionProgressPercentage)}% complete
          </span>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressColor}`}
          animate={progressControls}
          initial={{ width: '0%' }}
          style={{ width: `${sectionProgressPercentage}%` }}
        />
      </div>
      
      {/* Milestone indicators */}
      {showMilestones && (
        <div className="relative h-0">
          {milestones.map((milestone, index) => {
            const isActive = getCompletedResponsesInSection() > index;
            
            return (
              <motion.div
                key={index}
                className={`absolute top-[-8px] h-4 w-4 rounded-full border-2 border-white ${
                  isActive ? progressColor : 'bg-gray-200'
                }`}
                style={{ left: `${milestone}%`, marginLeft: '-6px' }}
                animate={index === questionIndexInSection ? celebrationControls : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProgressBar;