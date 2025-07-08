import { useState, useEffect } from 'react';
import { useQuest } from '../core/useQuest';
import { Question, QuestionResponse } from '../core/types';
import { isValidResponse, getValidationError } from '../utils/questValidation';

interface UseQuestResponsesOptions {
  validateOnChange?: boolean;
}

/**
 * Hook for managing and validating question responses
 */
export function useQuestResponses(
  question: Question | null,
  options: UseQuestResponsesOptions = {}
) {
  const { validateOnChange = false } = options;
  
  const { session, submitResponse } = useQuest();
  
  // Get previous response if it exists
  const previousResponse = question && session?.responses?.[question.id];
  
  // Current response state
  const [response, setResponse] = useState<string>(previousResponse?.response || '');
  const [tags, setTags] = useState<string[]>(previousResponse?.tags || []);
  const [error, setError] = useState<string | null>(null);
  
  // Reset response when question changes
  useEffect(() => {
    if (question) {
      setResponse(previousResponse?.response || '');
      setTags(previousResponse?.tags || []);
      setError(null);
    }
  }, [question, previousResponse]);
  
  // Validate response when it changes
  useEffect(() => {
    if (validateOnChange && question && response) {
      validateResponse();
    } else {
      setError(null);
    }
  }, [response, validateOnChange, question]);
  
  // Handle response change
  const handleResponseChange = (newResponse: string) => {
    setResponse(newResponse);
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setTags(prevTags => {
      // If tag is already selected, remove it
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      }
      // Otherwise, add it
      return [...prevTags, tag];
    });
  };
  
  // Validate response
  const validateResponse = (): boolean => {
    if (!question) return false;
    
    // Check if response is valid
    if (!isValidResponse(response, question)) {
      setError(getValidationError(response, question));
      return false;
    }
    
    setError(null);
    return true;
  };
  
  // Submit response
  const handleSubmit = async () => {
    if (!question) return false;
    
    // Validate before submitting
    if (!validateResponse()) {
      return false;
    }
    
    // Submit response
    await submitResponse(question.id, response, tags.length > 0 ? tags : undefined);
    return true;
  };
  
  return {
    response,
    tags,
    error,
    isValid: !error && response.trim().length > 0,
    isAnswered: !!previousResponse,
    handleResponseChange,
    handleTagSelect,
    validateResponse,
    handleSubmit
  };
}

export default useQuestResponses;