
import { toast } from 'sonner';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Standardized error handler for API operations
 * @param error Error object from catch block
 * @param userMessage User-friendly message to display
 * @param silent If true, don't show a toast to the user
 */
export const handleApiError = (
  error: unknown, 
  userMessage: string = 'An unexpected error occurred', 
  silent: boolean = false
): ApiError => {
  // Extract error details if available
  const apiError: ApiError = {
    code: 'unknown_error',
    message: userMessage,
  };
  
  // Add detailed error info if available
  if (error instanceof Error) {
    apiError.code = error.name;
    apiError.details = error.message;
    console.error(`${userMessage}:`, error);
  } else {
    console.error(`${userMessage}:`, error);
  }
  
  // Show toast unless silent mode is enabled
  if (!silent) {
    toast.error(userMessage);
  }
  
  return apiError;
};

/**
 * Helper to add structured try/catch to async functions
 * @param fn The async function to wrap
 * @param errorMessage User-friendly error message
 */
export function withErrorHandling<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>, 
  errorMessage: string
): (...args: Args) => Promise<T | null> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, errorMessage);
      return null;
    }
  };
}
