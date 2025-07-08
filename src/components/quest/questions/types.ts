
import { Question, QuestionResponse, HonestyTag } from '../core/types';

// Response data for a question
// export interface QuestionResponseData {
//   response: string;
//   tags?: HonestyTag[];
//   timestamp: string;
// }
// export type QuestionResponseData = QuestionResponse;

// Props for question cards
export interface QuestionCardProps {
  question: Question;
  onResponse: (response: string, tags?: HonestyTag[]) => void;
  isActive?: boolean;
  isAnswered?: boolean;
  previousResponse?: QuestionResponse; // Use the core type
  showTags?: boolean;
  className?: string;
}

// Props for difficulty-specific cards
export interface DifficultyQuestionCardProps extends QuestionCardProps {
  // Any additional props specific to difficulty variants
}

// Props for the question card skeleton (loading state)
export interface QuestionCardSkeletonProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
}