
import { format } from "date-fns";
import { calculateDaysLeft as coreCalculateDaysLeft } from "@/utils/dateUtils";

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
 * This version directly imports and uses the function from utils/dateUtils
 */
export const calculateDaysLeft = (dateString: string, timezone: string = 'Asia/Kolkata'): number => {
  try {
    console.log('Using calculateDaysLeft from utils/dateUtils with:', dateString);
    return coreCalculateDaysLeft(dateString, timezone);
  } catch (error) {
    console.error('Error in website-settings/calculateDaysLeft wrapper:', error);
    return 0;
  }
};
