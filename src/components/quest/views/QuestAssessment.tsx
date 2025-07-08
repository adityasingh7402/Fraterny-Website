import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { QuestLayout } from '../layout/QuestLayout';
import { EasyQuestionCard } from '../questions/EasyQuestionCard';
import { MediumQuestionCard } from '../questions/MediumQuestionCard';
import { HardQuestionCard } from '../questions/HardQuestionCard';
import { QuestionCardSkeleton } from '../questions/QuestionCardSkeleton';
import { HonestyTag } from '../core/types';

interface QuestAssessmentProps {
  onComplete?: () => void;
  className?: string;
}

/**
 * Main assessment view
 * Displays questions and handles responses
 */
export function QuestAssessment({ onComplete, className = '' }: QuestAssessmentProps) {
  const { 
    session, 
    currentQuestion, 
    submitResponse,
    nextQuestion,
    finishSection,
    finishQuest,
    isLoading,
    currentSection
  } = useQuest();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle response submission
  const handleResponse = async (response: string, tags?: HonestyTag[]) => {
    if (!currentQuestion) return;
    
    setIsSubmitting(true);
    
    // Submit the response
    await submitResponse(currentQuestion.id, response, tags);
    setIsSubmitting(false);
    nextQuestion();
    
    // Short delay for visual feedback
    // setTimeout(() => {
    //   setIsSubmitting(false);
      
    //   // Move to the next question
    //   nextQuestion();
    // }, 500);
  };
  
  // Handle completion of the assessment
  useEffect(() => {
    if (session && session.status === 'completed' && onComplete) {
      onComplete();
    }
  }, [session, onComplete]);
  
  // Render the appropriate question card based on difficulty
  const renderQuestionCard = () => {
    if (!currentQuestion) return null;
    
    // Get previous response if any
    const previousResponse = session?.responses?.[currentQuestion.id];
    
    switch (currentQuestion.difficulty) {
      case 'easy':
        return (
          <EasyQuestionCard
            question={currentQuestion}
            onResponse={handleResponse}
            isActive={!isSubmitting}
            previousResponse={previousResponse}
          />
        );
        
      case 'medium':
        return (
          <MediumQuestionCard
            question={currentQuestion}
            onResponse={handleResponse}
            isActive={!isSubmitting}
            previousResponse={previousResponse}
          />
        );
        
      case 'hard':
        return (
          <HardQuestionCard
            question={currentQuestion}
            onResponse={handleResponse}
            isActive={!isSubmitting}
            previousResponse={previousResponse}
          />
        );
        
      default:
        return (
          <EasyQuestionCard
            question={currentQuestion}
            onResponse={handleResponse}
            isActive={!isSubmitting}
            previousResponse={previousResponse}
          />
        );
    }
  };
  
  return (
    <QuestLayout className={className}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuestionCardSkeleton difficulty={currentQuestion?.difficulty} />
          </motion.div>
        )}
        
        {!isLoading && currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {renderQuestionCard()}
          </motion.div>
        )}
        
        {!isLoading && !currentQuestion && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8"
          >
            <p className="text-lg text-gray-600">No questions available.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
            >
              Refresh
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </QuestLayout>
  );
}

export default QuestAssessment;