/**
 * Configuración de validación para formularios
 * Requirement: 6.4 - Validación tipada
 */

import type { ValidationRule, FormValidation } from '../../domain/interfaces/forms.interface';

// Reglas de validación para el formulario de contacto
export const contactFormValidation: FormValidation[] = [
  {
    field: 'name',
    rules: [
      {
        type: 'required',
        message: 'El nombre es requerido',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres',
      },
      {
        type: 'maxLength',
        value: 50,
        message: 'El nombre no puede tener más de 50 caracteres',
      },
    ],
  },
  {
    field: 'email',
    rules: [
      {
        type: 'required',
        message: 'El email es requerido',
      },
      {
        type: 'email',
        message: 'Ingresa un email válido',
      },
    ],
  },
  {
    field: 'subject',
    rules: [
      {
        type: 'required',
        message: 'El asunto es requerido',
      },
      {
        type: 'minLength',
        value: 5,
        message: 'El asunto debe tener al menos 5 caracteres',
      },
      {
        type: 'maxLength',
        value: 100,
        message: 'El asunto no puede tener más de 100 caracteres',
      },
    ],
  },
  {
    field: 'message',
    rules: [
      {
        type: 'required',
        message: 'El mensaje es requerido',
      },
      {
        type: 'minLength',
        value: 10,
        message: 'El mensaje debe tener al menos 10 caracteres',
      },
      {
        type: 'maxLength',
        value: 1000,
        message: 'El mensaje no puede tener más de 1000 caracteres',
      },
    ],
  },
];

// Mensajes de validación por defecto
export const defaultValidationMessages = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  minLength: 'Debe tener al menos {value} caracteres',
  maxLength: 'No puede tener más de {value} caracteres',
  pattern: 'El formato no es válido',
};

// Patrones de validación comunes
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
};

/**
 * Genera un mensaje de validación personalizado
 */
export function formatValidationMessage(template: string, value?: number | string): string {
  if (value !== undefined) {
    return template.replace('{value}', String(value));
  }
  return template;
}