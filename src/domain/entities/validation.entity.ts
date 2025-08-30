/**
 * Entidades para validación de formularios
 * Requirement: 6.4 - Validación tipada
 */

import type {
  ValidationRule,
  FormFieldError,
} from '../interfaces/forms.interface';

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class FormSubmissionError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'FormSubmissionError';
  }
}

export class FormValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  static validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  static validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  static validatePattern(value: string, pattern: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(value);
  }

  static validateField(
    value: string,
    rules: ValidationRule[]
  ): FormFieldError[] {
    const errors: FormFieldError[] = [];

    for (const rule of rules) {
      let isValid = true;

      switch (rule.type) {
        case 'required':
          isValid = this.validateRequired(value);
          break;
        case 'email':
          isValid = this.validateEmail(value);
          break;
        case 'minLength':
          isValid = this.validateMinLength(value, rule.value as number);
          break;
        case 'maxLength':
          isValid = this.validateMaxLength(value, rule.value as number);
          break;
        case 'pattern':
          isValid = this.validatePattern(value, rule.value as string);
          break;
      }

      if (!isValid) {
        errors.push({
          field: 'field',
          message: rule.message,
        });
      }
    }

    return errors;
  }
}
