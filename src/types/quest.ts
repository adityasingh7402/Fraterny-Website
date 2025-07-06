// ===================================
// QUEST-SPECIFIC TYPE DEFINITIONS
// Clean interfaces for Quest operations
// ===================================

// Self-awareness tags that users can apply to their responses
export type SelfAwarenessTag = 'Honest' | 'Sarcastic' | 'Unsure' | 'Avoiding';

// Question difficulty levels
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

// Response input types
export type ResponseType = 'multiple_choice' | 'text_input' | 'scale_rating' | 'image_choice';

// Quest session status
export type SessionStatus = 'started' | 'in_progress' | 'completed' | 'abandoned';

// User subscription types
export type UserSubscriptionType = 'free' | 'paid';

// Payment status options
export type PaymentStatus = 'active' | 'cancelled' | 'expired' | 'pending';

// Privacy levels
export type PrivacyLevel = 'minimal' | 'standard' | 'full';

// ===================================
// CORE QUEST INTERFACES
// ===================================

// Single quest response with all metadata
export interface QuestResponse {
  question_index: number;
  question_text: string;
  question_difficulty: QuestionDifficulty;
  response_text: string;
  response_type: ResponseType;
  self_awareness_tags: SelfAwarenessTag[];
  response_time_seconds?: number;
  revision_count?: number;
}

// Quest session data
export interface QuestSession {
  id: string;
  user_id: string;
  session_status: SessionStatus;
  current_question_index: number;
  total_questions: number;
  questions_answered: number;
  questions_skipped: number;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  total_duration_minutes?: number;
  last_activity_at: string;
}

// User analytics data
export interface UserAnalytics {
  user_id: string;
  total_logins: number;
  logins_30d: number;
  logins_90d: number;
  last_login_at?: string;
  first_login_at?: string;
  total_quests_completed: number;
  total_quests_started: number;
  average_quest_duration_minutes: number;
  quest_completion_rate: number;
  user_engagement_score: number;
  days_since_last_login: number;
  days_since_registration: number;
  last_quest_at?: string;
  // ADD THESE MISSING PROPERTIES:
  total_sessions: number;
  average_session_duration_minutes: number;
}

// User profile data
export interface UserProfile {
  id: string;
  user_id: string;
  subscription_type: UserSubscriptionType;
  subscription_start_date?: string;
  subscription_end_date?: string;
  payment_status: PaymentStatus;
  email_notifications: boolean;
  quest_reminders: boolean;
  data_sharing_consent: boolean;
  privacy_level: PrivacyLevel;
}

// ===================================
// AI PAYLOAD STRUCTURE
// Based on the data structure document
// ===================================

// Dynamic user response for AI processing
export interface AIUserResponse {
  [key: string]: string | string[] | QuestionDifficulty | ResponseType;
  question_difficulty: QuestionDifficulty;
  response_type: ResponseType;
  self_awareness_tags: SelfAwarenessTag[];
}

// User data for AI analysis
export interface AIUserData {
  name: string;
  email: string;
  user_type: UserSubscriptionType;
}

// Assessment metadata for AI
export interface AIAssessmentMetadata {
  session_id: string;
  completed_at: string;
  total_questions: number;
  answered_questions: number;
  skipped_questions: number;
  assessment_version: string;
  total_duration_minutes: number;
}

// User analytics for AI context
export interface AIUserAnalytics {
  login_frequency: {
    last_30_days: number;
    last_90_days: number;
    lifetime: number;
  };
  engagement_history: {
    last_login: string;
    first_login: string;
    total_assessments_completed: number;
    average_assessment_duration_minutes: number;
    last_assessment_date?: string;
  };
  activity_patterns: {
    days_since_last_login: number;
    days_since_registration: number;
    total_platform_sessions: number;
    assessment_completion_rate: number;
  };
}

// Complete AI payload structure
export interface AIPayload {
  user_responses: AIUserResponse[];
  user_data: AIUserData[];
  assessment_metadata: AIAssessmentMetadata;
  user_analytics: AIUserAnalytics;
}

// ===================================
// QUEST OPERATION INTERFACES
// ===================================

// Response to save during quest
export interface SaveQuestResponseRequest {
  session_id: string;
  question_index: number;
  question_text: string;
  question_difficulty: QuestionDifficulty;
  response_text: string;
  response_type: ResponseType;
  self_awareness_tags: SelfAwarenessTag[];
  response_time_seconds?: number;
}

// Session creation request
export interface CreateSessionRequest {
  user_id: string;
  total_questions: number;
  quest_definition_id?: string;
}

// Session update request
export interface UpdateSessionRequest {
  session_id: string;
  current_question_index?: number;
  questions_answered?: number;
  questions_skipped?: number;
  progress_percentage?: number;
  session_status?: SessionStatus;
}

// ===================================
// COMPONENT PROP INTERFACES
// ===================================

// Props for quest question components
export interface QuestionComponentProps {
  question: {
    index: number;
    text: string;
    difficulty: QuestionDifficulty;
    type: ResponseType;
    options?: string[]; // For multiple choice
    scale?: { min: number; max: number }; // For scale rating
  };
  onResponse: (response: QuestResponse) => void;
  initialResponse?: QuestResponse;
  isLoading?: boolean;
}

// Props for quest progress components
export interface QuestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  questionsAnswered: number;
  questionsSkipped: number;
  progressPercentage: number;
  estimatedTimeRemaining?: number;
}

// Props for analytics components
export interface AnalyticsDisplayProps {
  analytics: UserAnalytics;
  showDetailed?: boolean;
  period?: '30d' | '90d' | 'lifetime';
}

// ===================================
// ERROR HANDLING INTERFACES
// ===================================

// Quest-specific error types
export interface QuestError {
  code: 'SESSION_NOT_FOUND' | 'INVALID_RESPONSE' | 'DATABASE_ERROR' | 'VALIDATION_ERROR' | 'AUTH_ERROR';
  message: string;
  details?: any;
}

// Result wrapper for quest operations
export interface QuestOperationResult<T> {
  success: boolean;
  data?: T;
  error?: QuestError;
}

// ===================================
// UTILITY TYPES
// ===================================

// For dynamic question keys in AI payload (question_1, question_2, etc.)
export type DynamicQuestionKey = `question_${number}`;
export type DynamicAnswerKey = `answer_${number}`;

// Session state for UI components
export interface SessionState {
  session: QuestSession | null;
  responses: QuestResponse[];
  currentResponse: Partial<QuestResponse> | null;
  isLoading: boolean;
  error: QuestError | null;
}