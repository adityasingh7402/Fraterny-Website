
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

/**
 * Calculates the number of days remaining until a target date based on IST (Indian Standard Time)
 * @param dateString - Target date in string format
 * @returns Number of days remaining, minimum 0
 */
export const calculateDaysLeft = (dateString: string): number => {
  try {
    const targetDate = new Date(dateString);
    
    // Get the current date in IST (Indian Standard Time)
    const nowInIST = new Date();
    const todayFormattedIST = formatInTimeZone(nowInIST, 'Asia/Kolkata', 'yyyy-MM-dd');
    const todayInIST = parseISO(todayFormattedIST);
    
    // Calculate the difference in days
    const diffTime = targetDate.getTime() - todayInIST.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch (error) {
    console.error('Error calculating days left:', error);
    return 0;
  }
};

/**
 * Schedule a function to run at midnight IST (Indian Standard Time)
 * @param callback - Function to run at midnight IST
 * @returns Cleanup function to clear the timer
 */
export const scheduleAtMidnightIST = (callback: () => void): (() => void) => {
  // IST is UTC+5:30
  const now = new Date();
  
  // Calculate time until next midnight IST (which is 18:30 UTC of the previous day)
  const currentHoursUTC = now.getUTCHours();
  const currentMinutesUTC = now.getUTCMinutes();
  const currentSecondsUTC = now.getUTCSeconds();
  const currentMillisecondsUTC = now.getUTCMilliseconds();
  
  // Convert to total milliseconds since start of day UTC
  const currentTimeMs = (
    currentHoursUTC * 3600 + 
    currentMinutesUTC * 60 + 
    currentSecondsUTC
  ) * 1000 + currentMillisecondsUTC;
  
  // Midnight IST is at 18:30 UTC
  const midnightISTMs = (18 * 3600 + 30 * 60) * 1000;
  
  // Calculate time until next midnight IST
  let timeUntilMidnightIST;
  if (currentTimeMs < midnightISTMs) {
    // Same day
    timeUntilMidnightIST = midnightISTMs - currentTimeMs;
  } else {
    // Next day
    timeUntilMidnightIST = (24 * 3600 * 1000) - currentTimeMs + midnightISTMs;
  }
  
  // Schedule the callback
  const timer = setTimeout(() => {
    callback();
    
    // Schedule it again for the next day
    const dailyInterval = setInterval(callback, 24 * 60 * 60 * 1000);
    return () => clearInterval(dailyInterval);
  }, timeUntilMidnightIST);
  
  return () => clearTimeout(timer);
};
