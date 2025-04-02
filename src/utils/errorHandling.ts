
import { toast } from 'sonner';
import { ToastActionElement } from '@/components/ui/toast';
import { ReactNode } from 'react';

// Standardized error types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  context?: Record<string, unknown>;
}

// Error options for displaying errors
export interface ErrorOptions {
  title?: string;
  silent?: boolean;
  variant?: 'default' | 'destructive';
  action?: ReactNode;
  duration?: number;
  context?: Record<string, unknown>;
}

/**
 * Centralized error handler for the application
 * @param error The error object
 * @param userMessage User-friendly message to display
 * @param options Additional options for error handling
 */
export function handleError(
  error: unknown, 
  userMessage: string = 'An unexpected error occurred', 
  options: ErrorOptions = {}
): ApiError {
  // Extract error details if available
  const apiError: ApiError = {
    code: 'unknown_error',
    message: userMessage,
    context: options.context
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
  if (!options.silent) {
    toast.error(options.title || userMessage, {
      description: options.title ? userMessage : undefined,
      duration: options.duration || 5000,
      action: options.action as any,
      closeButton: true,
    });
  }
  
  return apiError;
}

/**
 * Helper to add structured try/catch to async functions
 * @param fn The async function to wrap
 * @param errorMessage User-friendly error message
 * @param options Additional options for error handling
 */
export function withErrorHandling<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>, 
  errorMessage: string,
  options: ErrorOptions = {}
): (...args: Args) => Promise<T | null> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorMessage, options);
      return null;
    }
  };
}

// Export the legacy function names for backward compatibility
export const handleApiError = handleError;
export const showError = handleError;
