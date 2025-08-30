/**
 * Caso de uso: Enviar formulario de contacto
 * Requirement: 2.1 - Arquitectura hexagonal con casos de uso
 * Requirement: 6.2 - Casos de uso para envío de formularios
 */

import type {
  ContactForm,
  FormSubmissionResult,
  FormFieldError,
} from '../../domain/interfaces/forms.interface';
import type { FormspreeAdapter } from '../../infrastructure/adapters/FormspreeAdapter';

export interface SubmitContactFormUseCase {
  execute(formData: ContactForm): Promise<FormSubmissionResult>;
}

export class SubmitContactFormUseCaseImpl implements SubmitContactFormUseCase {
  constructor(
    private readonly formspreeAdapter: FormspreeAdapter,
    private readonly validator: ContactFormValidator
  ) {}

  async execute(formData: ContactForm): Promise<FormSubmissionResult> {
    try {
      // 1. Validar datos del formulario
      const validationResult = await this.validator.validate(formData);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: 'Datos del formulario inválidos',
          errors: validationResult.errors,
        };
      }

      // 2. Sanitizar datos
      const sanitizedData = this.sanitizeFormData(formData);

      // 3. Enviar a través del adaptador
      const result = await this.formspreeAdapter.submitForm(sanitizedData);

      // 4. Procesar respuesta
      if (result.success) {
        return {
          success: true,
          message: 'Formulario enviado correctamente',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Error al enviar el formulario',
        };
      }
    } catch (error) {
      console.error('Error in SubmitContactFormUseCase:', error);

      return {
        success: false,
        message: this.getErrorMessage(error),
        errors: [],
      };
    }
  }

  private sanitizeFormData(formData: ContactForm): ContactForm {
    return {
      name: this.sanitizeString(formData.name),
      email: this.sanitizeEmail(formData.email),
      subject: this.sanitizeString(formData.subject),
      message: this.sanitizeString(formData.message),
      phone: formData.phone ? this.sanitizePhone(formData.phone) : undefined,
      company: formData.company
        ? this.sanitizeString(formData.company)
        : undefined,
    };
  }

  private sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/<[^>]*>/g, '') // Remover tags HTML completos
      .substring(0, 1000); // Limitar longitud
  }

  private sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private sanitizePhone(phone: string): string {
    return phone
      .trim()
      .replace(/[^\d\s\-\+\(\)]/g, '') // Solo números y caracteres de formato
      .substring(0, 20);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // Mapear errores conocidos a mensajes user-friendly
      if (
        error.message.includes('timeout') ||
        error.message.includes('Tiempo de espera')
      ) {
        return 'Tiempo de espera agotado. Por favor, inténtalo de nuevo.';
      }
      if (error.message.includes('network')) {
        return 'Error de conexión. Verifica tu conexión a internet.';
      }
      if (error.message.includes('400')) {
        return 'Datos del formulario inválidos. Revisa los campos.';
      }
      if (error.message.includes('429')) {
        return 'Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.';
      }
      if (error.message.includes('500')) {
        return 'Error del servidor. Inténtalo más tarde.';
      }
    }

    return 'Error inesperado. Por favor, inténtalo de nuevo.';
  }
}

/**
 * Validador de formularios de contacto
 */
export interface ContactFormValidator {
  validate(formData: ContactForm): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export class ContactFormValidatorImpl implements ContactFormValidator {
  async validate(formData: ContactForm): Promise<ValidationResult> {
    const errors: FormFieldError[] = [];

    // Validar nombre
    if (!this.isValidName(formData.name)) {
      errors.push({
        field: 'name',
        message: 'El nombre debe tener entre 2 y 50 caracteres',
      });
    }

    // Validar email
    if (!this.isValidEmail(formData.email)) {
      errors.push({
        field: 'email',
        message: 'Por favor, introduce un email válido',
      });
    }

    // Validar asunto
    if (!this.isValidSubject(formData.subject)) {
      errors.push({
        field: 'subject',
        message: 'El asunto debe tener entre 5 y 100 caracteres',
      });
    }

    // Validar mensaje
    if (!this.isValidMessage(formData.message)) {
      errors.push({
        field: 'message',
        message: 'El mensaje debe tener entre 10 y 1000 caracteres',
      });
    }

    // Validar teléfono (opcional)
    if (formData.phone && !this.isValidPhone(formData.phone)) {
      errors.push({
        field: 'phone',
        message: 'Por favor, introduce un teléfono válido',
      });
    }

    // Validar empresa (opcional)
    if (formData.company && !this.isValidCompany(formData.company)) {
      errors.push({
        field: 'company',
        message: 'El nombre de la empresa no puede exceder 100 caracteres',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  private isValidSubject(subject: string): boolean {
    const trimmed = subject.trim();
    return trimmed.length >= 5 && trimmed.length <= 100;
  }

  private isValidMessage(message: string): boolean {
    const trimmed = message.trim();
    return trimmed.length >= 10 && trimmed.length <= 1000;
  }

  private isValidPhone(phone: string): boolean {
    // Formato internacional básico
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone.trim());
  }

  private isValidCompany(company: string): boolean {
    return company.trim().length <= 100;
  }
}

/**
 * Factory para crear instancias del caso de uso
 */
export class SubmitContactFormUseCaseFactory {
  static create(formspreeAdapter: FormspreeAdapter): SubmitContactFormUseCase {
    const validator = new ContactFormValidatorImpl();
    return new SubmitContactFormUseCaseImpl(formspreeAdapter, validator);
  }
}
