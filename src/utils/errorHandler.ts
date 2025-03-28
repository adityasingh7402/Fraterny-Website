
import { toast as sonnerToast } from 'sonner';
import { toast as shadcnToast } from '@/hooks/use-toast';
import { handleApiError, ApiError } from './errorHandling';

// Determines which toast system to use
const USE_SONNER = true; // Toggle between toast systems

interface ErrorOptions {
  title?: string;
  silent?: boolean;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
  duration?: number;
}

/**
 * Unified error handler for the application
 * @param error The error object
 * @param userMessage User-friendly message to display
 * @param options Additional options for the toast
 */
export const showError = (
  error: unknown, 
  userMessage: string = 'An unexpected error occurred', 
  options: ErrorOptions = {}
): ApiError => {
  // Process the error using our existing error handling utility
  const apiError = handleApiError(error, userMessage, options.silent);
  
  // If silent mode is enabled, don't show any toast
  if (options.silent) {
    return apiError;
  }
  
  // Show toast using the selected toast system
  if (USE_SONNER) {
    sonnerToast.error(options.title || userMessage, {
      description: options.title ? userMessage : undefined,
      duration: options.duration || 5000,
      action: options.action,
    });
  } else {
    shadcnToast({
      title: options.title || userMessage,
      description: options.title ? userMessage : undefined,
      variant: options.variant || 'destructive',
      duration: options.duration || 5000,
      action: options.action,
    });
  }
  
  return apiError;
};

/**
 * Show a success message
 * @param message The success message to display
 * @param options Additional options for the toast
 */
export const showSuccess = (
  message: string,
  options: ErrorOptions = {}
) => {
  if (USE_SONNER) {
    sonnerToast.success(options.title || message, {
      description: options.title ? message : undefined,
      duration: options.duration || 5000,
      action: options.action,
    });
  } else {
    shadcnToast({
      title: options.title || message,
      description: options.title ? message : undefined,
      variant: 'default',
      duration: options.duration || 5000,
      action: options.action,
    });
  }
};

/**
 * Type-safe wrapper for async functions with standardized error handling
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
      showError(error, errorMessage, options);
      return null;
    }
  };
}
