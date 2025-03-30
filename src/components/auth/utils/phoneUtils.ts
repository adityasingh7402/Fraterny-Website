
/**
 * Formats a phone number by ensuring it has a + prefix if needed
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number with + prefix
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const trimmed = phoneNumber.trim();
  if (!trimmed) return trimmed;
  
  // If it doesn't start with +, add it (assuming it's a full international number)
  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
};

/**
 * Sanitizes phone number input by removing invalid characters
 * @param value Raw phone number input
 * @returns Sanitized phone number (only digits, +, spaces, (), and -)
 */
export const sanitizePhoneInput = (value: string): string => {
  return value.replace(/[^\d+\s()-]/g, '');
};
