import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';

interface TimeEstimateProps {
  showIcon?: boolean;
  showRemaining?: boolean;
  updateInterval?: number; // in seconds
  className?: string;
}

/**
 * Time estimate component
 * Displays estimated time to complete the assessment
 */
export function TimeEstimate({
  showIcon = true,
  showRemaining = true,
  updateInterval = 30, // Update every 30 seconds
  className = ''
}: TimeEstimateProps) {
  // Get data from quest context
  const { 
    questions, 
    session, 
    currentQuestion,
    currentSectionId
  } = useQuest();
  
  // State for current time estimates
  const [timeSpent, setTimeSpent] = useState<number>(0); // in seconds
  const [remainingTime, setRemainingTime] = useState<number>(0); // in seconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Set start time when session starts
  useEffect(() => {
    if (session && !startTime) {
      setStartTime(new Date());
    }
  }, [session]);
  
  // Update time spent and remaining time
  useEffect(() => {
    if (!startTime) return;
    
    // Initial calculation
    calculateTimes();
    
    // Set up interval for updates
    const intervalId = setInterval(() => {
      calculateTimes();
    }, updateInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime, currentQuestion, questions.length, updateInterval]);
  
  // Calculate time spent and remaining time
  const calculateTimes = () => {
    if (!startTime) return;
    
    // Calculate time spent
    const now = new Date();
    const spentSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    setTimeSpent(spentSeconds);
    
    // Calculate remaining time based on average time per question
    // Assumption: ~30 seconds per question on average
    const avgSecondsPerQuestion = 30;
    const completedQuestions = currentQuestion?.id 
      ? questions.findIndex(q => q.id === currentQuestion.id)
      : 0;
    const remainingQuestions = Math.max(0, questions.length - completedQuestions);
    const estimatedRemainingSeconds = remainingQuestions * avgSecondsPerQuestion;
    
    setRemainingTime(estimatedRemainingSeconds);
  };
  
  // Format time as mm:ss or "X min"
  const formatTime = (seconds: number, format: 'compact' | 'full' = 'compact'): string => {
    if (format === 'compact') {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} min`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  // Don't show anything if no session or questions
  if (!session || questions.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      className={`time-estimate flex items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showIcon && (
        <svg 
          className="w-4 h-4 text-gray-500 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      )}
      
      <div className="text-xs text-gray-500">
        {showRemaining ? (
          <>
            <span className="font-medium">
              ~{formatTime(remainingTime)}
            </span>
            <span className="ml-1">remaining</span>
          </>
        ) : (
          <>
            <span className="font-medium">
              {formatTime(timeSpent)}
            </span>
            <span className="ml-1">elapsed</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default TimeEstimate;