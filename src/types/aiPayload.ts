// ===================================
// AI PAYLOAD TYPE DEFINITIONS
// Exact structure for AI processing as per data structure document
// ===================================

import type { SelfAwarenessTag, QuestionDifficulty, ResponseType, UserSubscriptionType } from './quest';

// ===================================
// DYNAMIC KEY GENERATION TYPES
// ===================================

// Generate dynamic question keys: question_1, question_2, etc.
export type QuestionKey<N extends number> = `question_${N}`;

// Generate dynamic answer keys: answer_1, answer_2, etc.  
export type AnswerKey<N extends number> = `answer_${N}`;

// Union type for common question numbers (1-25 to cover typical quest length)
export type QuestionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

// ===================================
// AI USER RESPONSE STRUCTURE
// ===================================

// Base response structure with required metadata
interface BaseAIResponse {
  question_difficulty: QuestionDifficulty;
  response_type: ResponseType;
  self_awareness_tags: SelfAwarenessTag[];
}

// Dynamic response structure that allows question_N and answer_N keys
export interface AIUserResponse extends BaseAIResponse {
  [key: string]: string | string[] | QuestionDifficulty | ResponseType;
}

// Utility type for building specific question-answer pairs
export type QuestionAnswerPair<N extends QuestionNumber> = BaseAIResponse & {
  [K in QuestionKey<N>]: string;
} & {
  [K in AnswerKey<N>]: string;
};

// ===================================
// AI USER DATA STRUCTURE
// ===================================

export interface AIUserData {
  name: string;
  email: string;
  user_type: UserSubscriptionType;
}

// ===================================
// AI ASSESSMENT METADATA STRUCTURE
// ===================================

export interface AIAssessmentMetadata {
  session_id: string;
  completed_at: string; // ISO 8601 timestamp
  total_questions: number;
  answered_questions: number;
  skipped_questions: number;
  assessment_version: string;
  total_duration_minutes: number;
}

// ===================================
// AI USER ANALYTICS STRUCTURE
// ===================================

export interface AILoginFrequency {
  last_30_days: number;
  last_90_days: number;
  lifetime: number;
}

export interface AIEngagementHistory {
  last_login: string; // ISO 8601 timestamp
  first_login: string; // ISO 8601 timestamp
  total_assessments_completed: number;
  average_assessment_duration_minutes: number;
  last_assessment_date?: string; // ISO 8601 timestamp
}

export interface AIActivityPatterns {
  days_since_last_login: number;
  days_since_registration: number;
  total_platform_sessions: number;
  assessment_completion_rate: number; // 0.0 to 1.0
}

export interface AIUserAnalytics {
  login_frequency: AILoginFrequency;
  engagement_history: AIEngagementHistory;
  activity_patterns: AIActivityPatterns;
}

// ===================================
// COMPLETE AI PAYLOAD STRUCTURE
// ===================================

export interface AIPayload {
  user_responses: AIUserResponse[];
  user_data: AIUserData[];
  assessment_metadata: AIAssessmentMetadata;
  user_analytics: AIUserAnalytics;
}

// ===================================
// AI PAYLOAD BUILDER UTILITIES
// ===================================

// Builder for creating user responses with dynamic keys
export interface AIResponseBuilder {
  addResponse(
    questionIndex: number,
    questionText: string,
    answerText: string,
    metadata: {
      difficulty: QuestionDifficulty;
      responseType: ResponseType;
      selfAwarenessTags: SelfAwarenessTag[];
    }
  ): AIResponseBuilder;
  build(): AIUserResponse[];
}

// Validation result for AI payload
export interface AIPayloadValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ===================================
// AI RESPONSE STRUCTURE (FROM AI)
// ===================================

// Structure for AI analysis results
export interface AIAnalysisResult {
  personality_insights: {
    primary_traits: string[];
    secondary_traits: string[];
    trait_confidence: number; // 0.0 to 1.0
  };
  behavioral_patterns: {
    communication_style: string;
    decision_making_approach: string;
    stress_response: string;
    motivation_drivers: string[];
  };
  recommendations: {
    personal_growth: string[];
    career_suggestions: string[];
    relationship_advice: string[];
    areas_for_development: string[];
  };
  analysis_metadata: {
    confidence_score: number; // 0.0 to 1.0
    processing_time_seconds: number;
    analysis_version: string;
    model_used: string;
  };
}

// Complete AI response structure
export interface AIResponse {
  session_id: string;
  analysis_result: AIAnalysisResult;
  generated_at: string; // ISO 8601 timestamp
  processing_status: 'success' | 'partial' | 'failed';
  error_message?: string;
}

// ===================================
// PAYLOAD TRANSFORMATION TYPES
// ===================================

// Raw quest data before AI transformation
export interface RawQuestData {
  sessionId: string;
  userId: string;
  responses: Array<{
    questionIndex: number;
    questionText: string;
    responseText: string;
    difficulty: QuestionDifficulty;
    responseType: ResponseType;
    selfAwarenessTags: SelfAwarenessTag[];
  }>;
  userInfo: {
    name: string;
    email: string;
    subscriptionType: UserSubscriptionType;
  };
  sessionMetadata: {
    totalQuestions: number;
    answeredQuestions: number;
    skippedQuestions: number;
    durationMinutes: number;
    completedAt: string;
  };
  userAnalytics: {
    loginFrequency: AILoginFrequency;
    engagementHistory: AIEngagementHistory;
    activityPatterns: AIActivityPatterns;
  };
}

// Transformation functions type signatures
export interface AIPayloadTransformer {
  transformToAIPayload(rawData: RawQuestData): AIPayload;
  validatePayload(payload: AIPayload): AIPayloadValidation;
  sanitizePayload(payload: AIPayload): AIPayload;
}

// ===================================
// AI PAYLOAD CONSTANTS
// ===================================

export const AI_PAYLOAD_CONSTANTS = {
  ASSESSMENT_VERSION: 'v1.0',
  MAX_RESPONSE_LENGTH: 5000,
  MIN_QUESTIONS_FOR_ANALYSIS: 10,
  MAX_QUESTIONS_PER_ASSESSMENT: 25,
  REQUIRED_SELF_AWARENESS_TAGS: ['Honest', 'Sarcastic', 'Unsure', 'Avoiding'] as const,
  SUPPORTED_RESPONSE_TYPES: ['multiple_choice', 'text_input', 'scale_rating', 'image_choice'] as const,
  SUPPORTED_DIFFICULTIES: ['easy', 'medium', 'hard'] as const,
} as const;

// ===================================
// EXAMPLE USAGE TYPES
// ===================================

// Example of how dynamic keys work
export type ExampleResponse = QuestionAnswerPair<1> & QuestionAnswerPair<2>; 
// This would create: { question_1: string, answer_1: string, question_2: string, answer_2: string, ...metadata }

// Type guard for validating AI payload structure
export type AIPayloadTypeGuard = (data: unknown) => data is AIPayload;