import { Question, QuestSession, QuestionResponse } from '../core/types';

/**
 * Calculate the completion percentage for a session
 */
export const calculateCompletion = (
  session: QuestSession | null,
  questions: Question[]
): number => {
  if (!session || !session.responses || questions.length === 0) {
    return 0;
  }
  
  const responseCount = Object.keys(session.responses).length;
  return Math.min(100, Math.round((responseCount / questions.length) * 100));
};

/**
 * Calculate the estimated time remaining (in seconds)
 */
export const calculateTimeRemaining = (
  session: QuestSession | null,
  questions: Question[],
  avgSecondsPerQuestion: number = 30
): number => {
  if (!session || questions.length === 0) {
    return 0;
  }
  
  const responseCount = session.responses ? Object.keys(session.responses).length : 0;
  const remainingQuestions = Math.max(0, questions.length - responseCount);
  
  return remainingQuestions * avgSecondsPerQuestion;
};

/**
 * Calculate the average response time (in seconds)
 */
export const calculateAverageResponseTime = (
  session: QuestSession | null
): number => {
  if (!session || !session.responses) {
    return 0;
  }
  
  const responses = Object.values(session.responses);
  if (responses.length === 0) {
    return 0;
  }
  
  // For this calculation, we need session start time and response timestamps
  if (!session.startedAt) {
    return 0;
  }
  
  const startTime = new Date(session.startedAt).getTime();
  let totalResponseTime = 0;
  let lastTimestamp = startTime;
  
  // Sort responses by timestamp
  const sortedResponses = [...responses].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
  
  // Calculate time between responses
  sortedResponses.forEach(response => {
    const responseTime = new Date(response.timestamp).getTime();
    const timeDiff = responseTime - lastTimestamp;
    totalResponseTime += timeDiff;
    lastTimestamp = responseTime;
  });
  
  return Math.round(totalResponseTime / (responses.length * 1000));
};

/**
 * Get the number of questions by difficulty
 */
export const getQuestionCountsByDifficulty = (
  questions: Question[]
): Record<string, number> => {
  const counts: Record<string, number> = {
    easy: 0,
    medium: 0,
    hard: 0
  };
  
  questions.forEach(question => {
    if (question.difficulty in counts) {
      counts[question.difficulty]++;
    }
  });
  
  return counts;
};

/**
 * Get analytics for honesty tags
 */
export const getTagAnalytics = (
  session: QuestSession | null
): Record<string, number> => {
  if (!session || !session.responses) {
    return {};
  }
  
  const tagCounts: Record<string, number> = {};
  
  Object.values(session.responses).forEach(response => {
    if (response.tags && response.tags.length > 0) {
      response.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return tagCounts;
};

/**
 * Track an analytics event (stub - would connect to a real analytics service)
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
): void => {
  // This would normally send data to an analytics service
  console.info(`[Analytics] ${eventName}`, properties);
};