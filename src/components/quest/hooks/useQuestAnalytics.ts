import { useState, useEffect } from 'react';
import { useQuest } from '../core/useQuest';
import { 
  calculateCompletion,
  calculateTimeRemaining,
  calculateAverageResponseTime,
  getQuestionCountsByDifficulty,
  getTagAnalytics,
  trackEvent
} from '../utils/questAnalytics';

interface UseQuestAnalyticsOptions {
  trackEvents?: boolean;
  updateInterval?: number; // in seconds
}

/**
 * Hook for tracking and analyzing quest progress and metrics
 */
export function useQuestAnalytics(options: UseQuestAnalyticsOptions = {}) {
  const {
    trackEvents = true,
    updateInterval = 30
  } = options;
  
  const { session, questions, currentQuestion } = useQuest();
  
  // Analytics state
  const [startTime] = useState<Date>(new Date());
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [averageResponseTime, setAverageResponseTime] = useState<number>(0);
  const [tagStats, setTagStats] = useState<Record<string, number>>({});
  
  // Initialize analytics
  useEffect(() => {
    if (trackEvents) {
      trackEvent('quest_view', { startTime: startTime.toISOString() });
    }
    
    // Set up interval for updates
    const intervalId = setInterval(() => {
      updateAnalytics();
    }, updateInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [trackEvents, updateInterval]);
  
  // Update analytics when session or questions change
  useEffect(() => {
    updateAnalytics();
    
    // Track question view
    if (trackEvents && currentQuestion) {
      trackEvent('question_view', { 
        questionId: currentQuestion.id,
        difficulty: currentQuestion.difficulty
      });
    }
  }, [session, questions, currentQuestion, trackEvents]);
  
  // Update analytics calculations
  const updateAnalytics = () => {
    setCompletionPercentage(calculateCompletion(session, questions));
    setTimeRemaining(calculateTimeRemaining(session, questions));
    setAverageResponseTime(calculateAverageResponseTime(session));
    setTagStats(getTagAnalytics(session));
  };
  
  // Track response submission
  const trackResponse = (questionId: string, responseLength: number, tags?: string[]) => {
    if (!trackEvents) return;
    
    trackEvent('response_submit', {
      questionId,
      responseLength,
      tags,
      timestamp: new Date().toISOString()
    });
  };
  
  // Calculate elapsed time in seconds
  const calculateElapsedTime = (): number => {
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  };
  
  return {
    completionPercentage,
    timeRemaining,
    averageResponseTime,
    tagStats,
    questionCounts: getQuestionCountsByDifficulty(questions),
    elapsedTime: calculateElapsedTime(),
    trackResponse,
    updateAnalytics
  };
}

export default useQuestAnalytics;