import { Question } from '../core/types';

/**
 * Format a question for display
 */
export const formatQuestion = (
  question: Question,
  includeHint: boolean = true
): string => {
  // Basic question text
  let formattedText = question.text;
  
  // Add hint if available and requested
  if (includeHint && question.hint) {
    formattedText += ` (${question.hint})`;
  }
  
  return formattedText;
};

/**
 * Get placeholder text based on question type
 */
export const getPlaceholderText = (question: Question): string => {
  switch (question.type) {
    case 'text_input':
      return question.placeholder || 'Type your answer here...';
      
    case 'scale_rating':
      return 'Select a value';
      
    case 'multiple_choice':
      return 'Select an option';
      
    case 'image_choice':
      return 'Select an image';
      
    default:
      return '';
  }
};

/**
 * Format a difficulty label
 */
export const formatDifficulty = (
  difficulty: 'easy' | 'medium' | 'hard'
): string => {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return difficulty;
  }
};

/**
 * Get color class based on difficulty
 */
export const getDifficultyColorClass = (
  difficulty: 'easy' | 'medium' | 'hard',
  type: 'text' | 'bg' | 'border' = 'text'
): string => {
  const baseColor = {
    easy: 'terracotta',
    medium: 'navy',
    hard: 'gold'
  }[difficulty];
  
  switch (type) {
    case 'bg':
      return `bg-${baseColor}`;
    case 'border':
      return `border-${baseColor}`;
    case 'text':
    default:
      return `text-${baseColor}`;
  }
};

/**
 * Format a response for display
 */
// export const formatResponse = (
//   response: string,
//   question: Question
// ): string => {
//   switch (question.type) {
//     case 'scale_rating':
//       // For scale rating, we might want to add the label if available
//       const value = parseInt(response, 10);
//       if (question.labels && question.labels[value]) {
//         return `${value} - ${question.labels[value]}`;
//       }
//       return response;
      
//     case 'multiple_choice':
//       // For multiple choice, we just return the selected option
//       return response;
      
//     case 'text_input':
//       // For text input, we might want to truncate long responses
//       if (response.length > 100) {
//         return response.substring(0, 100) + '...';
//       }
//       return response;
      
//     default:
//       return response;
//   }
// };

/**
 * Calculate estimated reading time for a question
 */
export const calculateReadingTime = (text: string): number => {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return readingTimeMinutes;
};

/**
 * Utility functions for formatting question data
 */

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format minutes to a readable duration
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) {
    return 'Invalid duration';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hours === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
}

/**
 * Truncate text to a specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format response text based on question type
 * @param response Response text
 * @param questionType Question type
 * @returns Formatted response
 */
export function formatResponse(response: string, questionType: string): string {
  switch (questionType) {
    case 'scale_rating':
      return `Rating: ${response}`;
      
    case 'multiple_choice':
      return response;
      
    case 'date_input':
      try {
        return formatDate(response);
      } catch (e) {
        return response;
      }
      
    case 'ranking':
      try {
        const rankingData = JSON.parse(response);
        const topChoice = rankingData.rankings[0]?.text || '';
        const explanation = rankingData.explanation || '';
        
        return `Top choice: ${topChoice}${explanation ? ` — ${explanation}` : ''}`;
      } catch (e) {
        return response;
      }
      
    default:
      return response;
  }
}

/**
 * Get color class based on difficulty
 * @param difficulty Question difficulty
 * @returns CSS class for the difficulty
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-terracotta';
    case 'medium':
      return 'text-navy';
    case 'hard':
      return 'text-gold';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get color class based on honesty tag
 * @param tag Honesty tag
 * @returns CSS class for the tag
 */
export function getTagColor(tag: string): string {
  switch (tag) {
    case 'Honest':
      return 'bg-green-100 text-green-800';
    case 'Unsure':
      return 'bg-blue-100 text-blue-800';
    case 'Sarcastic':
      return 'bg-purple-100 text-purple-800';
    case 'Avoiding':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}