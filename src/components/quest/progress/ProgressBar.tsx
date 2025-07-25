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
      (index / (questionsInSection - 1)) * 100  // This gives 0%, 25%, 50%, 75%, 100%
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
    <div className='flex flex-col items-center gap-2'>
      <div className={`w-full ${className}`}>  
        {/* Progress bar */}
        <div className="w-full h-0 outline outline-4 outline-offset-[-2px] outline-zinc-400">
          <motion.div
            className={`${progressColor}`}
            animate={progressControls}
            initial={{ width: '0%' }}
            style={{ width: `${sectionProgressPercentage}%` }}
          />
        </div>
        
        {/* Milestone indicators */}
        {showMilestones && (
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
        )}
      </div>


      <div className=" w-full pt-5">
      {showLabel && (
        <div className=" mb-2 text-sm flex justify-between">
          <div className="w-28 h-10 bg-white rounded-[50px] border-[1.50px] border-neutral-400 items-center flex justify-center">
            <div className="text-center justify-start text-sky-800 text-xl font-normal font-['Gilroy-Bold']">Self</div>
          </div>
          <div className="text-neutral-500 text-xl font=normal font-['Gilroy-Regular']">
            {questionIndexInSection + 1} / {questionsInSection}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default ProgressBar;