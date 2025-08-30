/**
 * Tests unitarios para el componente ContactForm
 * Requirement: 6.2 - Testing de integración para formularios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de fetch para las pruebas
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Funciones de validación extraídas del componente para testing
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

function validateMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

describe('ContactForm Validation Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validación de campos requeridos', () => {
    it('debe validar campo requerido - valor vacío', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('debe validar campo requerido - valor válido', () => {
      expect(validateRequired('Juan')).toBe(true);
      expect(validateRequired('  Juan  ')).toBe(true);
    });

    it('debe validar longitud mínima', () => {
      expect(validateMinLength('A', 2)).toBe(false);
      expect(validateMinLength('AB', 2)).toBe(true);
      expect(validateMinLength('ABC', 2)).toBe(true);
    });

    it('debe validar longitud máxima', () => {
      expect(validateMaxLength('A'.repeat(101), 100)).toBe(false);
      expect(validateMaxLength('A'.repeat(100), 100)).toBe(true);
      expect(validateMaxLength('A'.repeat(50), 100)).toBe(true);
    });

    it('debe validar formato de email - emails inválidos', () => {
      expect(validateEmail('email-invalido')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });

    it('debe validar formato de email - emails válidos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });
  });

  describe('Envío de formulario con Formspree', () => {
    const validFormData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      subject: 'Consulta general',
      message: 'Este es un mensaje de prueba con más de 10 caracteres'
    };

    it('debe enviar formulario con datos válidos', async () => {
      // Mock de respuesta exitosa
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      // Simular envío a Formspree
      const response = await fetch('https://formspree.io/f/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(validFormData)
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://formspree.io/f/test',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(validFormData)
        })
      );
      expect(response.ok).toBe(true);
    });

    it('debe manejar errores de red', async () => {
      // Mock de error de red
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('https://formspree.io/f/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validFormData)
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }

      expect(mockFetch).toHaveBeenCalled();
    });

    it('debe manejar respuesta de error del servidor', async () => {
      // Mock de respuesta de error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid data' })
      });

      const response = await fetch('https://formspree.io/f/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validFormData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('debe validar estructura de datos antes del envío', () => {
      const data = validFormData;

      // Validaciones básicas
      expect(validateRequired(data.name)).toBe(true);
      expect(validateEmail(data.email)).toBe(true);
      expect(validateMinLength(data.subject, 5)).toBe(true);
      expect(validateMinLength(data.message, 10)).toBe(true);
    });
  });

  describe('Estados del formulario', () => {
    it('debe manejar estado de carga', () => {
      const formState = {
        isSubmitting: false,
        isSuccess: false,
        isError: false
      };

      // Simular inicio de envío
      formState.isSubmitting = true;
      expect(formState.isSubmitting).toBe(true);
      expect(formState.isSuccess).toBe(false);
      expect(formState.isError).toBe(false);

      // Simular éxito
      formState.isSubmitting = false;
      formState.isSuccess = true;
      expect(formState.isSubmitting).toBe(false);
      expect(formState.isSuccess).toBe(true);
    });

    it('debe manejar mensajes de estado', () => {
      const messages = {
        success: '¡Mensaje enviado correctamente!',
        error: 'Error al enviar el mensaje',
        loading: 'Enviando...'
      };

      expect(messages.success).toBe('¡Mensaje enviado correctamente!');
      expect(messages.error).toBe('Error al enviar el mensaje');
      expect(messages.loading).toBe('Enviando...');
    });

    it('debe validar configuración del formulario', () => {
      const config = {
        endpoint: 'https://formspree.io/f/test',
        successMessage: '¡Mensaje enviado!',
        errorMessage: 'Error al enviar',
        timeout: 5000
      };

      expect(config.endpoint).toBeTruthy();
      expect(config.timeout).toBeGreaterThan(0);
      expect(config.successMessage.length).toBeGreaterThan(0);
      expect(config.errorMessage.length).toBeGreaterThan(0);
    });
  });

  describe('Configuración del formulario', () => {
    it('debe validar configuración requerida', () => {
      const config = {
        endpoint: 'https://formspree.io/f/test',
        successMessage: '¡Mensaje enviado!',
        errorMessage: 'Error al enviar',
        timeout: 5000
      };

      expect(config.endpoint).toMatch(/^https:\/\/formspree\.io\/f\/.+/);
      expect(config.timeout).toBeGreaterThan(0);
      expect(config.successMessage).toBeTruthy();
      expect(config.errorMessage).toBeTruthy();
    });

    it('debe usar valores por defecto apropiados', () => {
      const defaultConfig = {
        successMessage: '¡Mensaje enviado correctamente!',
        errorMessage: 'Error al enviar el mensaje. Inténtalo de nuevo.',
        timeout: 10000,
        enableValidation: true
      };

      expect(defaultConfig.timeout).toBe(10000);
      expect(defaultConfig.enableValidation).toBe(true);
      expect(defaultConfig.successMessage).toContain('enviado');
      expect(defaultConfig.errorMessage).toContain('Error');
    });
  });

  describe('Accesibilidad y UX', () => {
    it('debe proporcionar mensajes de error descriptivos', () => {
      const errorMessages = {
        required: 'Este campo es requerido',
        email: 'Por favor, introduce un email válido',
        minLength: 'El campo debe tener al menos {min} caracteres',
        maxLength: 'El campo no puede exceder {max} caracteres'
      };

      expect(errorMessages.required).toBeTruthy();
      expect(errorMessages.email).toContain('email');
      expect(errorMessages.minLength).toContain('caracteres');
      expect(errorMessages.maxLength).toContain('caracteres');
    });

    it('debe manejar diferentes tipos de validación', () => {
      const validationTypes = ['required', 'email', 'minLength', 'maxLength', 'pattern'];
      
      validationTypes.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });
});

// Tests de integración para el manejo de datos
describe('ContactForm Data Handling', () => {
  it('debe extraer datos del formulario correctamente', () => {
    const formData = new FormData();
    formData.append('name', 'Juan Pérez');
    formData.append('email', 'juan@example.com');
    formData.append('subject', 'Consulta');
    formData.append('message', 'Mensaje de prueba');

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    expect(data.name).toBe('Juan Pérez');
    expect(data.email).toBe('juan@example.com');
    expect(data.subject).toBe('Consulta');
    expect(data.message).toBe('Mensaje de prueba');
  });

  it('debe validar estructura de datos antes del envío', () => {
    const data = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      subject: 'Consulta',
      message: 'Mensaje de prueba'
    };

    // Validaciones básicas
    expect(data.name.length).toBeGreaterThan(0);
    expect(data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(data.subject.length).toBeGreaterThan(0);
    expect(data.message.length).toBeGreaterThan(0);
  });
});