/**
 * Interfaces para formularios y validación
 * Requirement: 6.2 - Integración con Formspree
 */

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

export interface FormValidation {
  field: keyof ContactForm;
  rules: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern";
  value?: number | string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  successMessage?: string;
}

export interface FormConfig {
  formspree: {
    endpoint: string;
    successMessage: string;
    errorMessage: string;
    enableValidation: boolean;
    timeout?: number;
  };
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  errors?: FormFieldError[];
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
}

export interface FormResponse {
  ok: boolean;
  status: number;
  message?: string;
  data?: any;
}