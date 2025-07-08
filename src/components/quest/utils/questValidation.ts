import { Question } from '../core/types';

/**
 * Check if a text response is valid
 */
export const isValidTextResponse = (
  response: string,
  question: Question
): boolean => {
  // Check if response is empty
  if (!response.trim()) {
    return false;
  }
  
  // Check minimum length if specified
  if (question.minLength && response.length < question.minLength) {
    return false;
  }
  
  // Check maximum length if specified
  if (question.maxLength && response.length > question.maxLength) {
    return false;
  }
  
  return true;
};

/**
 * Check if a scale rating is valid
 */
export const isValidScaleRating = (
  response: string,
  question: Question
): boolean => {
  // Parse response as number
  const rating = parseInt(response, 10);
  
  // Check if response is a valid number
  if (isNaN(rating)) {
    return false;
  }
  
  // Check if rating is within range
  const min = question.minScale || 1;
  const max = question.maxScale || 10;
  
  return rating >= min && rating <= max;
};

/**
 * Check if a response is valid based on question type
 */
export const isValidResponse = (
  response: string,
  question: Question
): boolean => {
  // Empty response is never valid
  if (!response.trim()) {
    return false;
  }
  
  // Check based on question type
  switch (question.type) {
    case 'text_input':
      return isValidTextResponse(response, question);
      
    case 'scale_rating':
      return isValidScaleRating(response, question);
      
    case 'multiple_choice':
      // For multiple choice, response should be one of the options
      return question.options ? question.options.includes(response) : false;
      
    case 'image_choice':
      // For image choice, we would need to check against valid image values
      // This is a simplified version
      return response.length > 0;
      
    default:
      return response.length > 0;
  }
};

/**
 * Get validation error message
 */
export const getValidationError = (
  response: string,
  question: Question
): string | null => {
  // Check if response is empty
  if (!response.trim()) {
    return 'Response is required';
  }
  
  // Check based on question type
  switch (question.type) {
    case 'text_input':
      if (question.minLength && response.length < question.minLength) {
        return `Response must be at least ${question.minLength} characters`;
      }
      if (question.maxLength && response.length > question.maxLength) {
        return `Response cannot exceed ${question.maxLength} characters`;
      }
      break;
      
    case 'scale_rating':
      const rating = parseInt(response, 10);
      if (isNaN(rating)) {
        return 'Response must be a number';
      }
      const min = question.minScale || 1;
      const max = question.maxScale || 10;
      if (rating < min || rating > max) {
        return `Response must be between ${min} and ${max}`;
      }
      break;
      
    case 'multiple_choice':
      if (question.options && !question.options.includes(response)) {
        return 'Please select a valid option';
      }
      break;
  }
  
  return null;
};