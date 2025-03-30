
/**
 * Formats a phone number by ensuring it has a + prefix and follows E.164 format
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number with + prefix
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const trimmed = phoneNumber.trim();
  if (!trimmed) return trimmed;
  
  // If it already has a country code with +, return as is
  if (trimmed.startsWith('+')) {
    // Remove any non-digit characters except the initial +
    return '+' + trimmed.substring(1).replace(/\D/g, '');
  }
  
  // If no +, assume it needs one
  return '+' + trimmed.replace(/\D/g, '');
};

/**
 * Sanitizes phone number input by removing invalid characters
 * @param value Raw phone number input
 * @returns Sanitized phone number (only digits, +, spaces, (), and -)
 */
export const sanitizePhoneInput = (value: string): string => {
  return value.replace(/[^\d+\s()-]/g, '');
};
