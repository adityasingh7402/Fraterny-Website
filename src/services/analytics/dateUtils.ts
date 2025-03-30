
// Helper function to determine start date based on period
export const getStartDateByPeriod = (endDate: Date, period: string): Date => {
  const startDate = new Date(endDate);
  
  switch (period) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case 'ytd':
      startDate.setFullYear(endDate.getFullYear(), 0, 1); // Jan 1st of current year
      break;
    case 'all':
    default:
      startDate.setFullYear(endDate.getFullYear() - 1); // One year ago by default
      break;
  }
  
  return startDate;
};
