/**
 * Utility functions for validating form inputs in the profile pages
 */

// Type definitions
export type ValidationError = string;
export type ValidationResult = ValidationError | null;
export type ValidationErrors = Record<string, ValidationError>;

/**
 * Validates an email address
 * 
 * @param email Email address to validate
 * @returns Validation error message or null if valid
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

/**
 * Validates a name field
 * 
 * @param name Name to validate
 * @param fieldName Name of the field (e.g., "First name")
 * @param minLength Minimum length (default: 1)
 * @param maxLength Maximum length (default: 50)
 * @returns Validation error message or null if valid
 */
export function validateName(
  name: string, 
  fieldName: string = 'Name',
  minLength: number = 1,
  maxLength: number = 50
): ValidationResult {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  
  if (name.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  if (name.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  
  return null;
}

/**
 * Validates a phone number
 * 
 * @param phone Phone number to validate
 * @param isRequired Whether the field is required (default: false)
 * @returns Validation error message or null if valid
 */
export function validatePhone(phone: string, isRequired: boolean = false): ValidationResult {
  if (!phone.trim()) {
    return isRequired ? 'Phone number is required' : null;
  }
  
  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  
  return null;
}

/**
 * Validates a password
 * 
 * @param password Password to validate
 * @param fieldName Name of the field (e.g., "New password")
 * @returns Validation error message or null if valid
 */
export function validatePassword(password: string, fieldName: string = 'Password'): ValidationResult {
  if (!password) {
    return `${fieldName} is required`;
  }
  
  if (password.length < 8) {
    return `${fieldName} must be at least 8 characters`;
  }
  
  if (!/[A-Z]/.test(password)) {
    return `${fieldName} must contain at least one uppercase letter`;
  }
  
  if (!/[0-9]/.test(password)) {
    return `${fieldName} must contain at least one number`;
  }
  
  return null;
}

/**
 * Validates a text field with a maximum length
 * 
 * @param text Text to validate
 * @param fieldName Name of the field (e.g., "Bio")
 * @param maxLength Maximum allowed length
 * @param isRequired Whether the field is required (default: false)
 * @returns Validation error message or null if valid
 */
export function validateText(
  text: string, 
  fieldName: string, 
  maxLength: number,
  isRequired: boolean = false
): ValidationResult {
  if (!text.trim() && isRequired) {
    return `${fieldName} is required`;
  }
  
  if (text.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  
  return null;
}

/**
 * Validates a URL
 * 
 * @param url URL to validate
 * @param fieldName Name of the field (e.g., "Website")
 * @param isRequired Whether the field is required (default: false)
 * @returns Validation error message or null if valid
 */
export function validateUrl(url: string, fieldName: string = 'URL', isRequired: boolean = false): ValidationResult {
  if (!url.trim()) {
    return isRequired ? `${fieldName} is required` : null;
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
}

/**
 * Validates a file type
 * 
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeInMB Maximum file size in MB
 * @returns Validation error message or null if valid
 */
export function validateFile(
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB: number = 5
): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return `File must be one of the following types: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
  }
  
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return `File must be less than ${maxSizeInMB}MB`;
  }
  
  return null;
}

/**
 * Validates a form by running multiple validation functions
 * 
 * @param validations Object mapping field names to validation functions
 * @param values Form values
 * @returns Object with validation errors for each field
 */
export function validateForm<T extends Record<string, any>>(
  validations: Record<keyof T, (value: any) => ValidationResult>,
  values: T
): ValidationErrors {
  const errors: ValidationErrors = {};
  
  for (const field in validations) {
    const errorMessage = validations[field](values[field]);
    if (errorMessage) {
      errors[field] = errorMessage;
    }
  }
  
  return errors;
}

/**
 * Validates a confirmed password (e.g., for registration)
 * 
 * @param password Password to validate
 * @param confirmPassword Confirmed password to validate
 * @returns Validation error message or null if valid
 */
export function validateConfirmedPassword(password: string, confirmPassword: string): ValidationResult {
  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
}

/**
 * Validates the password delete confirmation text (must be "DELETE")
 * 
 * @param text Text to validate
 * @returns Validation error message or null if valid
 */
export function validateDeleteConfirmation(text: string): ValidationResult {
  if (text !== 'DELETE') {
    return 'Please type DELETE to confirm';
  }
  
  return null;
}