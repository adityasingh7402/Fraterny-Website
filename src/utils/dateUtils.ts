
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

/**
 * Calculates the number of days remaining until a target date
 * @param dateString - Target date in string format
 * @param timezone - Optional timezone, defaults to 'Asia/Kolkata' (IST)
 * @returns Number of days remaining, minimum 0
 */
export const calculateDaysLeft = (dateString: string, timezone: string = 'Asia/Kolkata'): number => {
  try {
    if (!dateString) {
      console.error('No target date provided to calculateDaysLeft');
      return 0;
    }

    // Parse the target date - ensure it has the correct format yyyy-MM-dd
    const targetDate = new Date(dateString);
    
    // Log data for debugging
    console.log('Target date:', targetDate);
    console.log('Target date valid:', !isNaN(targetDate.getTime()));
    
    if (isNaN(targetDate.getTime())) {
      console.error('Invalid date provided to calculateDaysLeft:', dateString);
      return 0;
    }
    
    // Get the current date in the specified timezone
    const nowInTimezone = new Date();
    const todayFormatted = formatInTimeZone(nowInTimezone, timezone, 'yyyy-MM-dd');
    const todayInTimezone = parseISO(todayFormatted);
    
    // Log the current date for debugging
    console.log('Today in timezone:', todayInTimezone);
    
    // Calculate the difference in days
    const diffTime = targetDate.getTime() - todayInTimezone.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    console.log('Days left calculated:', daysLeft);
    return daysLeft;
  } catch (error) {
    console.error('Error calculating days left:', error);
    return 0;
  }
};

/**
 * Schedule a function to run at midnight in a specific timezone
 * @param callback - Function to run at midnight
 * @param timezone - Timezone, defaults to 'Asia/Kolkata' (IST)
 * @returns Cleanup function to clear the timer
 */
export const scheduleAtMidnight = (callback: () => void, timezone: string = 'Asia/Kolkata'): (() => void) => {
  // Get current date in the specified timezone
  const now = new Date();
  
  // Format the date in the specified timezone to get the time components
  const currentTimeInTimezone = formatInTimeZone(now, timezone, 'HH:mm:ss');
  const [hours, minutes, seconds] = currentTimeInTimezone.split(':').map(Number);
  
  // Calculate milliseconds until midnight in the specified timezone
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsUntilMidnight = millisecondsInDay - ((hours * 60 * 60 + minutes * 60 + seconds) * 1000 + now.getMilliseconds());
  
  // Log information for debugging
  console.log('Hours until midnight:', millisecondsUntilMidnight / (1000 * 60 * 60));
  
  // Schedule the callback
  const timer = setTimeout(() => {
    callback();
    
    // Schedule it again for the next day
    const dailyInterval = setInterval(callback, millisecondsInDay);
    return () => clearInterval(dailyInterval);
  }, millisecondsUntilMidnight);
  
  return () => clearTimeout(timer);
};
