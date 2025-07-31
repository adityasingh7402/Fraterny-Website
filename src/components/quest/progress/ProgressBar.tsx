// src/components/quest/progress/ProgressBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useProgressAnimation } from '../animations/useProgressAnimation';
import { useQuest } from '../core/useQuest';
import { SectionDrawer } from './SectionDrawer';

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
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  // Get sections from the quest context
  const { sections, currentSectionId, currentQuestion, session, changeSection, allQuestions } = useQuest();
  
  // Find current section
  const currentSection = sections.find(section => section.id === currentSectionId);
  
  // Count of questions in the current section
  const questionsInSection = currentSection?.questions.length || 0;

  // Add these NEW functions:
const getTotalQuestionsCount = () => {
  return allQuestions?.length || 0;
};

// const getTotalCompletedQuestions = () => {
//   if (!session?.responses || !allQuestions) return 0;
//   return allQuestions.filter(q => session.responses && session.responses[q.id]).length;
// };

// const totalProgressPercentage = getTotalQuestionsCount() > 0 
//   ? (getTotalCompletedQuestions() / getTotalQuestionsCount()) * 100 
//   : 0;
  
  // Index of current question within the section
  const getQuestionIndexInSection = () => {
    if (!currentSection || !currentQuestion) return 0;
    
    return currentSection.questions.findIndex(q => q.id === currentQuestion.id);
  };

  const getCurrentGlobalQuestionIndex = () => {
  if (!currentQuestion || !sections) return 0;
  
  let globalIndex = 0;
  
  // Add questions from previous sections
  for (const section of sections) {
    if (section.id === currentSectionId) {
      // Found current section, add current question index within this section
      globalIndex += getQuestionIndexInSection();
      break;
    }
    // Add all questions from this section
    globalIndex += section.questions.length;
  }
  
  return globalIndex;
};

const totalProgressPercentage = getTotalQuestionsCount() > 0 
  ? ((getCurrentGlobalQuestionIndex() + 1) / getTotalQuestionsCount()) * 100 
  : 0;
  
  console.log('🔍 Debug Progress Bar:');
console.log('   Current Global Index:', getCurrentGlobalQuestionIndex());
console.log('   Total Questions:', getTotalQuestionsCount());
console.log('   Total Progress Percentage:', totalProgressPercentage);
console.log('   Current Section:', currentSectionId);
console.log('   Current Question:', currentQuestion?.id);

  const questionIndexInSection = getQuestionIndexInSection();
  
  
  
  // // Generate milestones based on the number of questions in the current section
  // const generateMilestones = (): number[] => {
  //   if (!currentSection || questionsInSection === 0) {
  //     return [20, 40, 60, 80, 100]; // Fallback
  //   }
    
  //   // Create one milestone for each question
  //   return Array.from({ length: questionsInSection }, (_, index) => 
  //     (index / (questionsInSection - 1)) * 100
  //   );
  // };
  
  // const milestones = generateMilestones();
  
  // Use progress animation hook
  const { 
    progressControls, 
  } = useProgressAnimation(getCurrentGlobalQuestionIndex(), getTotalQuestionsCount(), {
    animated,
    // milestones
  });
  
  // Determine progress bar color based on percentage
  const getProgressColor = (): string => {
    return 'bg-gradient-to-br from-sky-800 to-sky-400'; // Always blue color
  };
  
  const progressColor = getProgressColor();
  // console.log('🎨 Progress Color:', progressColor);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handle section selection from drawer
  const handleSectionSelect = (sectionId: string) => {
    changeSection(sectionId);
    setIsDrawerOpen(false); // Close drawer after selection
  };
  
  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        <div className={`w-full ${className}`}>  
          {/* Progress bar */}
          <div className="w-full h-2">
            <motion.div
              className={`${progressColor} h-full`}
              animate={progressControls}
              initial={{ width: '0%' }}
              style={{ width: `${totalProgressPercentage}%` }}
            />
          </div>
          
          {/* Milestone indicators */}
          {/* {showMilestones && (
            <div className="relative h-0 p-2">
              {milestones.map((milestone, index) => {
                const isActive = getCompletedResponsesInSection() > index;
                
                return (
                  <motion.div
                    key={index}
                    className={`w-9 h-9 bg-zinc-300 rounded-full absolute top-[-20px] left-[-5px] ${
                      isActive ? progressColor : 'bg-gray-200'
                    }`}
                    style={{ left: `${milestone}%`, marginLeft: '-20px' }}
                    animate={index === questionIndexInSection ? celebrationControls : undefined}
                  />
                );
              })}
            </div>
          )} */}
        </div>

        <div className="w-full px-6">
          {showLabel && (
            <div className="mb-2 text-sm flex justify-between items-center">
              {/* Section Selector Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleDrawerToggle}
                  className="w-28 min-w-28 h-10 bg-white rounded-[50px] border-[1.50px] border-neutral-400 items-center flex justify-center px-4 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="text-center justify-start text-sky-800 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1.5px]  mr-2">
                    {currentSection?.title || 'Section'}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-sky-800 transition-transform duration-200 ${
                      isDrawerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Section Drawer */}
                <SectionDrawer
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                  onSectionSelect={handleSectionSelect}
                />
              </div>
              
              {/* Question Counter */}
              <div className="text-neutral-500 text-xl font-normal font-['Gilroy-Regular']">
                {questionIndexInSection + 1} / {questionsInSection}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProgressBar;