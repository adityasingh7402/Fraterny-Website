import { formatInTimeZone } from 'date-fns-tz';
import { parseISO, isValid } from 'date-fns';

/**
 * Calculates the number of days remaining until a target date
 * @param dateString - Target date in string format
 * @param timezone - Optional timezone, defaults to 'Asia/Kolkata' (IST)
 * @returns Number of days remaining, minimum 0
 */
export const calculateDaysLeft = (dateString: string, timezone: string = 'Asia/Kolkata'): number => {
  try {
    if (!dateString) {
      return 0;
    }

    // Parse the target date
    const targetDate = parseISO(dateString);
    
    if (!isValid(targetDate)) {
      return 0;
    }
    
    // Get the current date in the specified timezone
    const nowInTimezone = new Date();
    const todayFormatted = formatInTimeZone(nowInTimezone, timezone, 'yyyy-MM-dd');
    const todayInTimezone = parseISO(todayFormatted);
    
    // Calculate the difference in days
    const diffTime = targetDate.getTime() - todayInTimezone.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Return 0 if the date has passed
    return Math.max(0, daysLeft);
  } catch (error) {
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
  
  // Schedule the callback
  const timer = setTimeout(() => {
    callback();
    
    // Schedule it again for the next day
    const dailyInterval = setInterval(callback, millisecondsInDay);
    return () => clearInterval(dailyInterval);
  }, millisecondsUntilMidnight);
  
  return () => clearTimeout(timer);
};
