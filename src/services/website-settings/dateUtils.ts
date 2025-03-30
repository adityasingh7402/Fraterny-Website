
import { format } from "date-fns";

/**
 * Formats the registration close date into a human-readable format
 */
export const formatRegistrationCloseDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'March 2025'; // Fallback
  }
};

/**
 * Wrapper for calculateDaysLeft from utils/dateUtils.ts
 * This version directly returns a number instead of a Promise
 */
export const calculateDaysLeft = (dateString: string, timezone: string = 'Asia/Kolkata'): number => {
  try {
    // Import the function directly from the module
    const dateUtils = require('@/utils/dateUtils');
    // Log the imported function and parameters for debugging
    console.log('Using calculateDaysLeft from utils/dateUtils with:', dateString);
    return dateUtils.calculateDaysLeft(dateString, timezone);
  } catch (error) {
    console.error('Error in website-settings/calculateDaysLeft wrapper:', error);
    return 0;
  }
};
