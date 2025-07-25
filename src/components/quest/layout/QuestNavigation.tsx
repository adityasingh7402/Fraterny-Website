import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWordValidationStatus } from '../utils/questValidation';

interface QuestNavigationProps {
  showPrevious?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
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
  showSkip = true,
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
    skipQuestion,
    previousQuestion,
    finishSection,
    finishQuest,
    sections,           // ADD this
  currentSectionId,
  } = useQuest();
  
  // Determine if this is the last question in the section
  // const isLastQuestion = session && 
  //   questions.length > 0 && 
  //   session.currentQuestionIndex === questions.length - 1;

  const isLastQuestionInSection = session && 
  questions.length > 0 && 
  session.currentQuestionIndex === questions.length - 1;

  const isLastQuestionInEntireAssessment = () => {
  if (!session || !currentSection) return false;
  
  // Check if current section is the last section
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  const isLastSection = currentSectionIndex === sections.length - 1;
  
  // Check if current question is last in this section
  const isLastQuestionInThisSection = session.currentQuestionIndex === questions.length - 1;
  
  return isLastSection && isLastQuestionInThisSection;
};

const isLastQuestion = isLastQuestionInEntireAssessment();
  
  // Determine if this is the first question in the section
  // const isFirstQuestion = !session || session.currentQuestionIndex === 0;

  const isFirstQuestionInEntireAssessment = () => {
  if (!session) return true;
  
  // Get current section index
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  
  // If we're in the first section AND on the first question of that section
  const isFirstSection = currentSectionIndex === 0;
  const isFirstQuestionInThisSection = session.currentQuestionIndex === 0;
  
  return isFirstSection && isFirstQuestionInThisSection;
};

const isFirstQuestion = isFirstQuestionInEntireAssessment();
  
  //   const handleNext = () => {
  //   if (isLastQuestion) {
  //     // If this is the last question, finish the section
  //     const hasMoreSections = finishSection();
      
  //     // If there are no more sections, finish the quest
  //     if (!hasMoreSections && showFinish) {
  //       if (onFinish) {
  //         onFinish();
  //       } else {
  //         finishQuest();
  //       }
  //     }
  //   } else {
  //     // Otherwise, go to the next question
  //     nextQuestion();
  //   }
  // };

  // FILE: src/components/quest/layout/QuestNavigation.tsx
// REPLACE: The existing handleNext function (around line 40)
  // FILE: src/components/quest/layout/QuestNavigation.tsx
// REPLACE: The entire handleNext function
const handleNext = () => {
  // Check validation for text questions before proceeding
  if (currentQuestion?.type === 'text_input' && session?.responses?.[currentQuestion.id]) {
    const response = session.responses[currentQuestion.id].response;
    const wordValidation = getWordValidationStatus(response, 100, 90);
    
    if (!wordValidation.isValid) {
      return;
    }
  }
  
  // Check if this is the last question in current section
  if (isLastQuestionInSection) {
    // Try to move to next section
    const hasMoreSections = finishSection();
    
    // If no more sections AND this is the last question in entire assessment, finish quest
    if (!hasMoreSections && isLastQuestion && showFinish) {
      if (onFinish) {
        onFinish();
      } else {
        finishQuest();
      }
    }
    // If there are more sections, finishSection() already handled the transition
  } else {
    // Move to next question in current section
    nextQuestion();
  }
};

  const handleSkip = () => {
    skipQuestion();
  };
  
  // Button variants
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    tap: { scale: 0.95 }
  };
  
  return (
    // <nav className={`quest-navigation py-4 px-6 ${className}`}>
    //   <div className="max-w-2xl mx-auto flex justify-between">
    //     {/* Previous button */}
    //     {showPrevious && (
    //       <motion.button
    //         variants={buttonVariants}
    //         initial="initial"
    //         animate="animate"
    //         whileTap="tap"
    //         onClick={previousQuestion}
    //         disabled={isFirstQuestion}
    //         className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
    //           isFirstQuestion
    //             ? 'border-gray-200 text-gray-400 cursor-not-allowed'
    //             : 'border-navy text-navy hover:bg-navy hover:text-white'
    //         }`}
    //       >
    //         Previous
    //       </motion.button>
    //     )}
        
    //     {/* Next/Finish button */}
    //     {showNext && (
    //       <motion.button
    //         variants={buttonVariants}
    //         initial="initial"
    //         animate="animate"
    //         whileTap="tap"
    //         onClick={handleNext}
    //         className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
    //           isLastQuestion && showFinish
    //             ? 'bg-gold hover:bg-gold/90'
    //             : 'bg-terracotta hover:bg-terracotta/90'
    //         }`}
    //       >
    //         {isLastQuestion && showFinish ? 'Finish' : 'Next'}
    //       </motion.button>
    //     )}
    //   </div>
    // </nav>
    <nav className={`${className}`}>
      <div className="flex gap-1">
        {/* Previous button - ✨ UPDATED: Always enabled except on first question */}
        {/* {showPrevious && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={previousQuestion}
            disabled={isFirstQuestion}
            className={` ${
              isFirstQuestion
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-navy text-navy hover:bg-navy hover:text-white'
            }`}
          >
            Previous
          </motion.button>
        )} */}

        {showPrevious && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={previousQuestion}
            disabled={isFirstQuestion}
            className={` ${
              isFirstQuestion
                ? 'hidden'
                : 'w-[70px] h-14 bg-white rounded-full border-2 border-neutral-400 justify-center items-center flex'
            }`}
          >
              <ChevronLeft className={`w-5 h-5 ${isFirstQuestion ? 'hidden' : 'block'}`} />
          </motion.button>
        )}

        {/* ✨ NEW - Skip button in center */}
        {/* <div className="flex gap-2">
          {showSkip && !isLastQuestion && (
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileTap="tap"
              onClick={handleSkip}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 underline hover:no-underline transition-colors"
            >
              Skip for now
            </motion.button>
          )}
        </div> */}
        
        {/* Next/Finish button - ✨ UPDATED: Always enabled */}
        {/* {showNext && (
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
        )} */}
        {showNext && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={handleNext}
            className={`px-4 py-2 text-white text-sm font-medium transition-colors ${
              isLastQuestion && showFinish
                ? 'w-4/5 h-14 bg-gradient-to-br from-sky-800 to-sky-400 rounded-[36px] border-2 border-blue-950'
                : 'w-full h-14 bg-gradient-to-br from-sky-800 to-sky-400 rounded-[36px] border-2 border-blue-950'
            }`}
          >
            <div className='flex gap-2 justify-center items-center'>
              <div className="w-12 justify-center text-white text-2xl font-normal font-['Gilroy-Bold'] tracking-[-8%]">
              {isLastQuestion && showFinish ? 'Finish' : 'Next'}
              </div>
              <div className=''>
                <ChevronRight className='w-[1.5] h-[3]'/>
              </div>
            </div>
          </motion.button>
        )}
      </div>
    </nav>
  );
}

export default QuestNavigation;