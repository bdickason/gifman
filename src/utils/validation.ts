// Validation utility functions

import type { FormField, ValidationError } from '../types';

/**
 * Validate a single form field
 * @param field Form field configuration
 * @param value Field value to validate
 * @returns Validation error or null if valid
 */
export const validateField = (field: FormField, value: any): ValidationError | null => {
  // Required field validation
  if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return {
      field: field.name,
      message: `${field.label} is required`
    };
  }

  // Skip further validation if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String length validation
  if (typeof value === 'string') {
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      return {
        field: field.name,
        message: `${field.label} must be at least ${field.validation.minLength} characters`
      };
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      return {
        field: field.name,
        message: `${field.label} must be no more than ${field.validation.maxLength} characters`
      };
    }
  }

  // Pattern validation
  if (field.validation?.pattern && typeof value === 'string') {
    if (!field.validation.pattern.test(value)) {
      return {
        field: field.name,
        message: `${field.label} format is invalid`
      };
    }
  }

  // Custom validation
  if (field.validation?.custom) {
    const customError = field.validation.custom(value);
    if (customError) {
      return {
        field: field.name,
        message: customError
      };
    }
  }

  return null;
};

/**
 * Validate multiple form fields
 * @param fields Array of form field configurations
 * @param values Object containing field values
 * @returns Array of validation errors
 */
export const validateFields = (fields: FormField[], values: Record<string, any>): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    const error = validateField(field, values[field.name]);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

/**
 * Check if a string is a valid email
 * @param email Email string to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a string is a valid URL
 * @param url URL string to validate
 * @returns True if valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if a string contains only alphanumeric characters
 * @param str String to validate
 * @returns True if alphanumeric only
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Check if a string is a valid phone number (basic validation)
 * @param phone Phone string to validate
 * @returns True if valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Check if a value is within a numeric range
 * @param value Numeric value to check
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns True if value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Check if a string meets password strength requirements
 * @param password Password string to validate
 * @param options Password strength options
 * @returns Object with strength score and feedback
 */
export const validatePasswordStrength = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { score: number; feedback: string[] } => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;

  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= minLength) {
    score += 1;
  } else {
    feedback.push(`Password must be at least ${minLength} characters long`);
  }

  // Character type checks
  if (requireUppercase && /[A-Z]/.test(password)) {
    score += 1;
  } else if (requireUppercase) {
    feedback.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && /[a-z]/.test(password)) {
    score += 1;
  } else if (requireLowercase) {
    feedback.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && /\d/.test(password)) {
    score += 1;
  } else if (requireNumbers) {
    feedback.push('Password must contain at least one number');
  }

  if (requireSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else if (requireSpecialChars) {
    feedback.push('Password must contain at least one special character');
  }

  return { score, feedback };
};
