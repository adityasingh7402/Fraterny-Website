
/**
 * Calculates the number of days remaining until a target date
 * @param dateString - Target date in string format
 * @returns Number of days remaining, minimum 0
 */
export const calculateDaysLeft = (dateString: string): number => {
  const targetDate = new Date(dateString).getTime();
  const today = new Date().getTime();
  return Math.max(0, Math.floor((targetDate - today) / (1000 * 60 * 60 * 24)));
};
