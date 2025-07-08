import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';

interface QuestNavigationProps {
  showPrevious?: boolean;
  showNext?: boolean;
  showFinish?: boolean;
  onFinish?: () => void;
  className?: string;
}

/**
 * Navigation controls for the quest system
 * Provides buttons for navigating between questions and sections
 */
export function QuestNavigation({
  showPrevious = true,
  showNext = true,
  showFinish = true,
  onFinish,
  className = ''
}: QuestNavigationProps) {
  const { 
    session, 
    currentQuestion,
    questions,
    currentSection,
    nextQuestion,
    previousQuestion,
    finishSection,
    finishQuest
  } = useQuest();
  
  // Determine if this is the last question in the section
  const isLastQuestion = session && 
    questions.length > 0 && 
    (session.currentQuestionIndex === questions.length - 1);
  
  // Determine if this is the first question in the section
  const isFirstQuestion = !!(session && session.currentQuestionIndex === 0);
  
  // Handle next button click
  const handleNext = () => {
    if (isLastQuestion) {
      // If this is the last question, finish the section
      const hasMoreSections = finishSection();
      
      // If there are no more sections, finish the quest
      if (!hasMoreSections && showFinish) {
        if (onFinish) {
          onFinish();
        } else {
          finishQuest();
        }
      }
    } else {
      // Otherwise, go to the next question
      nextQuestion();
    }
  };
  
  // Button variants
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    tap: { scale: 0.95 }
  };
  
  return (
    <nav className={`quest-navigation py-4 px-6 ${className}`}>
      <div className="max-w-2xl mx-auto flex justify-between">
        {/* Previous button */}
        {showPrevious && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={previousQuestion}
            disabled={isFirstQuestion}
            className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
              isFirstQuestion
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            }`}
          >
            Previous
          </motion.button>
        )}
        
        {/* Next/Finish button */}
        {showNext && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={handleNext}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              isLastQuestion && showFinish
                ? 'bg-gold hover:bg-gold/90'
                : 'bg-terracotta hover:bg-terracotta/90'
            }`}
          >
            {isLastQuestion && showFinish ? 'Finish' : 'Next'}
          </motion.button>
        )}
      </div>
    </nav>
  );
}

export default QuestNavigation;