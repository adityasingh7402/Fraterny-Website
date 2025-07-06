/**
 * Utility functions for formatting data in the profile pages
 */

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

/**
 * Calculates a trend direction based on a percentage change
 * 
 * @param change Percentage change value (e.g., 0.05 for 5% increase)
 * @returns Trend direction: 'up', 'down', or 'stable'
 */
export function calculateTrend(change: number): 'up' | 'down' | 'stable' {
  if (change > 0.02) return 'up'; // >2% increase is an upward trend
  if (change < -0.02) return 'down'; // >2% decrease is a downward trend
  return 'stable'; // Within ±2% is considered stable
}

/**
 * Formats a percentage value with the % symbol
 * 
 * @param value Value to format (e.g., 0.85 for 85%)
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "85%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a date in a user-friendly format
 * 
 * @param dateString ISO date string to format
 * @param formatString Optional custom format string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined, formatString: string = 'yyyy-MM-dd'): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a relative time from now (e.g., "2 days ago")
 * 
 * @param dateString ISO date string to format
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a time duration in minutes to a human-readable format
 * 
 * @param minutes Number of minutes
 * @returns Formatted duration string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}

/**
 * Formats a number with thousands separators
 * 
 * @param value Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

/**
 * Shortens a text to a maximum length with ellipsis
 * 
 * @param text Text to shorten
 * @param maxLength Maximum length before truncation
 * @returns Shortened text with ellipsis if needed
 */
export function shortenText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Formats an engagement score with appropriate styling class
 * 
 * @param score Engagement score (0-10)
 * @returns CSS class name for the score
 */
export function getEngagementScoreClass(score: number): string {
  if (score >= 8.5) return 'text-green-500';
  if (score >= 6) return 'text-emerald-500';
  if (score >= 3) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Returns a trend icon name based on trend direction
 * 
 * @param trend Trend direction ('up', 'down', or 'stable')
 * @returns Icon name for the trend
 */
export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return 'arrow-up';
    case 'down': return 'arrow-down';
    case 'stable': return 'minus';
  }
}

/**
 * Returns a CSS class for styling trends
 * 
 * @param trend Trend direction ('up', 'down', or 'stable')
 * @returns CSS class name for the trend
 */
export function getTrendClass(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return 'text-green-500';
    case 'down': return 'text-red-500';
    case 'stable': return 'text-gray-500';
  }
}

/**
 * Formats a quest status for display
 * 
 * @param status Quest session status
 * @returns Formatted status string
 */
export function formatQuestStatus(status: 'started' | 'in_progress' | 'completed' | 'abandoned'): string {
  switch (status) {
    case 'started': return 'Started';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'abandoned': return 'Abandoned';
  }
}

/**
 * Returns a CSS class for styling quest status
 * 
 * @param status Quest session status
 * @returns CSS class name for the status
 */
export function getQuestStatusClass(status: 'started' | 'in_progress' | 'completed' | 'abandoned'): string {
  switch (status) {
    case 'started': return 'text-blue-500';
    case 'in_progress': return 'text-amber-500';
    case 'completed': return 'text-green-500';
    case 'abandoned': return 'text-red-500';
  }
}

/**
 * Formats a subscription type for display
 * 
 * @param type Subscription type
 * @returns Formatted subscription type string
 */
export function formatSubscriptionType(type: 'free' | 'paid'): string {
  switch (type) {
    case 'free': return 'Free Plan';
    case 'paid': return 'Premium Plan';
  }
}

/**
 * Formats a payment status for display
 * 
 * @param status Payment status
 * @returns Formatted payment status string
 */
export function formatPaymentStatus(status: 'active' | 'cancelled' | 'expired' | 'pending'): string {
  switch (status) {
    case 'active': return 'Active';
    case 'cancelled': return 'Cancelled';
    case 'expired': return 'Expired';
    case 'pending': return 'Pending';
  }
}

/**
 * Returns a CSS class for styling payment status
 * 
 * @param status Payment status
 * @returns CSS class name for the status
 */
export function getPaymentStatusClass(status: 'active' | 'cancelled' | 'expired' | 'pending'): string {
  switch (status) {
    case 'active': return 'text-green-500';
    case 'cancelled': return 'text-amber-500';
    case 'expired': return 'text-red-500';
    case 'pending': return 'text-blue-500';
  }
}