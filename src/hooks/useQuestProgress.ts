// ===================================
// QUEST PROGRESS TRACKING HOOK
// Hook for tracking quest completion progress and timing
// ===================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  QuestSession, 
  QuestResponse 
} from '@/types/quest';

interface ProgressState {
  startTime: number | null;
  questionStartTime: number | null;
  questionTimes: number[]; // Time taken for each question in seconds
  pausedTime: number; // Total time paused
  isPaused: boolean;
  estimatedTimeRemaining: number | null;
}

interface ProgressMetrics {
  totalElapsedMinutes: number;
  averageTimePerQuestion: number;
  fastestQuestion: number | null;
  slowestQuestion: number | null;
  estimatedCompletionTime: number | null;
  progressPercentage: number;
  questionsRemaining: number;
  isOnTrack: boolean; // Based on expected completion time
  paceIndicator: 'fast' | 'normal' | 'slow';
}

interface ProgressMilestone {
  type: 'quarter' | 'half' | 'three_quarters' | 'complete';
  percentage: number;
  reached: boolean;
  timestamp?: number;
}

export function useQuestProgress(session: QuestSession | null, responses: QuestResponse[]) {
  const [progressState, setProgressState] = useState<ProgressState>({
    startTime: null,
    questionStartTime: null,
    questionTimes: [],
    pausedTime: 0,
    isPaused: false,
    estimatedTimeRemaining: null
  });

  const pauseStartTime = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Expected time per question (in seconds) - can be adjusted based on difficulty
  const EXPECTED_TIME_PER_QUESTION = {
    easy: 45,    // 45 seconds
    medium: 90,  // 1.5 minutes
    hard: 180    // 3 minutes
  };

  const OVERALL_EXPECTED_TIME = 12 * 60; // 12 minutes total expected time

  /**
   * Start progress tracking
   */
  const startProgress = useCallback((): void => {
    const now = Date.now();
    setProgressState(prev => ({
      ...prev,
      startTime: now,
      questionStartTime: now,
      questionTimes: [],
      pausedTime: 0,
      isPaused: false
    }));
    console.log('Quest progress tracking started');
  }, []);

  /**
   * Start timing a new question
   */
  const startQuestion = useCallback((): void => {
    const now = Date.now();
    setProgressState(prev => ({
      ...prev,
      questionStartTime: now,
      isPaused: false
    }));
  }, []);

  /**
   * Complete current question and record time
   */
  const completeQuestion = useCallback((questionDifficulty: 'easy' | 'medium' | 'hard' = 'medium'): void => {
    const now = Date.now();
    
    setProgressState(prev => {
      if (!prev.questionStartTime) return prev;
      
      const questionTime = Math.round((now - prev.questionStartTime) / 1000); // Convert to seconds
      const newQuestionTimes = [...prev.questionTimes, questionTime];
      
      // Calculate estimated time remaining
      const averageTime = newQuestionTimes.reduce((sum, time) => sum + time, 0) / newQuestionTimes.length;
      const questionsRemaining = (session?.total_questions || 0) - newQuestionTimes.length;
      const estimatedTimeRemaining = questionsRemaining * averageTime;
      
      return {
        ...prev,
        questionTimes: newQuestionTimes,
        questionStartTime: now, // Start timing next question
        estimatedTimeRemaining
      };
    });
    
    console.log(`Question completed in ${Math.round((now - (progressState.questionStartTime || now)) / 1000)}s`);
  }, [session?.total_questions, progressState.questionStartTime]);

  /**
   * Pause progress tracking
   */
  const pauseProgress = useCallback((): void => {
    if (progressState.isPaused) return;
    
    pauseStartTime.current = Date.now();
    setProgressState(prev => ({
      ...prev,
      isPaused: true
    }));
    console.log('Quest progress paused');
  }, [progressState.isPaused]);

  /**
   * Resume progress tracking
   */
  const resumeProgress = useCallback((): void => {
    if (!progressState.isPaused || !pauseStartTime.current) return;
    
    const pauseDuration = Date.now() - pauseStartTime.current;
    setProgressState(prev => ({
      ...prev,
      isPaused: false,
      pausedTime: prev.pausedTime + pauseDuration
    }));
    pauseStartTime.current = null;
    console.log('Quest progress resumed');
  }, [progressState.isPaused]);

  /**
   * Calculate progress metrics
   */
  const calculateMetrics = useCallback((): ProgressMetrics | null => {
    if (!session || !progressState.startTime) return null;

    const now = Date.now();
    const totalElapsed = now - progressState.startTime - progressState.pausedTime;
    const totalElapsedMinutes = totalElapsed / (1000 * 60);
    
    const questionsAnswered = responses.length;
    const questionsRemaining = session.total_questions - questionsAnswered;
    const progressPercentage = (questionsAnswered / session.total_questions) * 100;
    
    // Calculate timing metrics
    const averageTimePerQuestion = progressState.questionTimes.length > 0
      ? progressState.questionTimes.reduce((sum, time) => sum + time, 0) / progressState.questionTimes.length
      : 0;
    
    const fastestQuestion = progressState.questionTimes.length > 0
      ? Math.min(...progressState.questionTimes)
      : null;
    
    const slowestQuestion = progressState.questionTimes.length > 0
      ? Math.max(...progressState.questionTimes)
      : null;
    
    // Estimate completion time
    const estimatedCompletionTime = averageTimePerQuestion > 0
      ? totalElapsedMinutes + (questionsRemaining * averageTimePerQuestion / 60)
      : null;
    
    // Determine if user is on track
    const expectedTimeElapsed = (questionsAnswered / session.total_questions) * OVERALL_EXPECTED_TIME;
    const isOnTrack = totalElapsedMinutes <= (expectedTimeElapsed / 60) * 1.2; // 20% tolerance
    
    // Determine pace
    let paceIndicator: 'fast' | 'normal' | 'slow' = 'normal';
    if (averageTimePerQuestion > 0) {
      const expectedAverage = OVERALL_EXPECTED_TIME / session.total_questions;
      if (averageTimePerQuestion < expectedAverage * 0.8) {
        paceIndicator = 'fast';
      } else if (averageTimePerQuestion > expectedAverage * 1.3) {
        paceIndicator = 'slow';
      }
    }

    return {
      totalElapsedMinutes,
      averageTimePerQuestion,
      fastestQuestion,
      slowestQuestion,
      estimatedCompletionTime,
      progressPercentage,
      questionsRemaining,
      isOnTrack,
      paceIndicator
    };
  }, [session, progressState, responses.length]);

  /**
   * Get progress milestones
   */
  const getMilestones = useCallback((): ProgressMilestone[] => {
    if (!session) return [];

    const progressPercentage = (responses.length / session.total_questions) * 100;
    
    return [
      {
        type: 'quarter',
        percentage: 25,
        reached: progressPercentage >= 25,
        timestamp: progressPercentage >= 25 ? Date.now() : undefined
      },
      {
        type: 'half',
        percentage: 50,
        reached: progressPercentage >= 50,
        timestamp: progressPercentage >= 50 ? Date.now() : undefined
      },
      {
        type: 'three_quarters',
        percentage: 75,
        reached: progressPercentage >= 75,
        timestamp: progressPercentage >= 75 ? Date.now() : undefined
      },
      {
        type: 'complete',
        percentage: 100,
        reached: progressPercentage >= 100,
        timestamp: progressPercentage >= 100 ? Date.now() : undefined
      }
    ];
  }, [session, responses.length]);

  /**
   * Get time breakdown
   */
  const getTimeBreakdown = useCallback(() => {
    if (!progressState.startTime) return null;

    const now = Date.now();
    const totalTime = now - progressState.startTime;
    const activeTime = totalTime - progressState.pausedTime;
    
    return {
      totalTime: Math.round(totalTime / 1000), // seconds
      activeTime: Math.round(activeTime / 1000), // seconds
      pausedTime: Math.round(progressState.pausedTime / 1000), // seconds
      totalMinutes: Math.round(totalTime / (1000 * 60) * 10) / 10,
      activeMinutes: Math.round(activeTime / (1000 * 60) * 10) / 10,
      pausedMinutes: Math.round(progressState.pausedTime / (1000 * 60) * 10) / 10
    };
  }, [progressState.startTime, progressState.pausedTime]);

  /**
   * Reset progress tracking
   */
  const resetProgress = useCallback((): void => {
    setProgressState({
      startTime: null,
      questionStartTime: null,
      questionTimes: [],
      pausedTime: 0,
      isPaused: false,
      estimatedTimeRemaining: null
    });
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    console.log('Quest progress reset');
  }, []);

  /**
   * Get formatted time display
   */
  const getFormattedTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }, []);

  // Auto-start progress when session begins
  useEffect(() => {
    if (session && !progressState.startTime) {
      startProgress();
    }
  }, [session, progressState.startTime, startProgress]);

  // Auto-complete question when new response is added
  useEffect(() => {
    if (responses.length > progressState.questionTimes.length && progressState.questionStartTime) {
      // Find the latest response to get its difficulty
      const latestResponse = responses[responses.length - 1];
      completeQuestion(latestResponse.question_difficulty);
    }
  }, [responses.length, progressState.questionTimes.length, progressState.questionStartTime, completeQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isTracking: !!progressState.startTime,
    isPaused: progressState.isPaused,
    
    // Actions
    startProgress,
    startQuestion,
    completeQuestion,
    pauseProgress,
    resumeProgress,
    resetProgress,
    
    // Data
    metrics: calculateMetrics(),
    milestones: getMilestones(),
    timeBreakdown: getTimeBreakdown(),
    questionTimes: progressState.questionTimes,
    
    // Utilities
    getFormattedTime,
    
    // Quick access
    currentQuestionTime: progressState.questionStartTime 
      ? Math.round((Date.now() - progressState.questionStartTime) / 1000)
      : 0,
    totalElapsedTime: progressState.startTime 
      ? Math.round((Date.now() - progressState.startTime - progressState.pausedTime) / 1000)
      : 0,
    estimatedTimeRemaining: progressState.estimatedTimeRemaining,
    
    // Progress indicators
    progressPercentage: session ? (responses.length / session.total_questions) * 100 : 0,
    questionsCompleted: responses.length,
    totalQuestions: session?.total_questions || 0,
    questionsRemaining: (session?.total_questions || 0) - responses.length
  };
}