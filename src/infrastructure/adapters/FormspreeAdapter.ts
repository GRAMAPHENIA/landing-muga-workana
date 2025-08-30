/**
 * Adaptador para integración con Formspree
 * Requirement: 6.2 - Adaptadores para Formspree en infraestructura
 * Requirement: 2.1 - Arquitectura hexagonal con adaptadores externos
 */

import type {
  ContactForm,
  FormResponse,
} from '../../domain/interfaces/forms.interface';

export interface FormspreeAdapter {
  submitForm(formData: ContactForm): Promise<FormspreeResponse>;
  validateEndpoint(): boolean;
}

export interface FormspreeResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: any;
}

export interface FormspreeConfig {
  endpoint: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export class FormspreeAdapterImpl implements FormspreeAdapter {
  private readonly config: FormspreeConfig;

  constructor(config: FormspreeConfig) {
    this.config = config;

    if (!this.validateEndpoint()) {
      throw new Error('Endpoint de Formspree inválido o no configurado');
    }
  }

  async submitForm(formData: ContactForm): Promise<FormspreeResponse> {
    let lastError: Error | null = null;

    // Implementar retry logic
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.makeRequest(formData);

        if (response.success) {
          return response;
        }

        // Si no es un error de red, no reintentar
        if (response.statusCode && response.statusCode < 500) {
          return response;
        }

        lastError = new Error(
          `HTTP ${response.statusCode}: ${response.message}`
        );
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error('Error desconocido');

        // Si es el último intento, lanzar el error
        if (attempt === this.config.retryAttempts) {
          break;
        }

        // Esperar antes del siguiente intento
        await this.delay(this.config.retryDelay * attempt);
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    throw (
      lastError ||
      new Error('Error al enviar formulario después de múltiples intentos')
    );
  }

  private async makeRequest(formData: ContactForm): Promise<FormspreeResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'Astro-Landing-Page/1.0',
        },
        body: JSON.stringify(this.formatFormData(formData)),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Procesar respuesta
      const responseData = await this.parseResponse(response);

      if (response.ok) {
        return {
          success: true,
          statusCode: response.status,
          data: responseData,
        };
      } else {
        return {
          success: false,
          message: this.getErrorMessage(response.status, responseData),
          statusCode: response.status,
          data: responseData,
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Tiempo de espera agotado');
        }
        throw error;
      }

      throw new Error('Error de red desconocido');
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        console.warn('Error parsing JSON response:', error);
        return {};
      }
    }

    return { message: await response.text() };
  }

  private formatFormData(formData: ContactForm): Record<string, any> {
    const formatted: Record<string, any> = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      _subject: formData.subject, // Campo especial de Formspree
    };

    // Añadir campos opcionales si están presentes
    if (formData.phone) {
      formatted.phone = formData.phone;
    }

    if (formData.company) {
      formatted.company = formData.company;
    }

    // Metadatos adicionales
    formatted._replyto = formData.email;
    formatted._format = 'json';
    formatted._language = 'es';
    formatted._next = window?.location?.origin || '';

    return formatted;
  }

  private getErrorMessage(statusCode: number, responseData: any): string {
    // Mensajes específicos por código de estado
    switch (statusCode) {
      case 400:
        return responseData?.message || 'Datos del formulario inválidos';
      case 401:
        return 'No autorizado para enviar formularios';
      case 403:
        return 'Acceso denegado al servicio de formularios';
      case 404:
        return 'Formulario no encontrado. Verifica la configuración.';
      case 422:
        return responseData?.message || 'Error de validación en el servidor';
      case 429:
        return 'Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.';
      case 500:
        return 'Error interno del servidor. Inténtalo más tarde.';
      case 502:
      case 503:
      case 504:
        return 'Servicio temporalmente no disponible. Inténtalo más tarde.';
      default:
        return responseData?.message || `Error del servidor (${statusCode})`;
    }
  }

  validateEndpoint(): boolean {
    if (!this.config.endpoint) {
      return false;
    }

    // Validar formato del endpoint de Formspree
    const formspreeRegex = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
    return formspreeRegex.test(this.config.endpoint);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Método para probar la conectividad con Formspree
   */
  async testConnection(): Promise<boolean> {
    try {
      const testData: ContactForm = {
        name: 'Test Connection',
        email: 'test@example.com',
        subject: 'Connection Test',
        message: 'This is a connection test message',
      };

      const response = await this.makeRequest(testData);
      return response.success || response.statusCode === 422; // 422 es OK para test
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

/**
 * Factory para crear instancias del adaptador
 */
export class FormspreeAdapterFactory {
  static create(
    config: Partial<FormspreeConfig> & { endpoint: string }
  ): FormspreeAdapter {
    const fullConfig: FormspreeConfig = {
      endpoint: config.endpoint,
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };

    return new FormspreeAdapterImpl(fullConfig);
  }

  static createFromSiteConfig(siteConfig: any): FormspreeAdapter {
    const formspreeConfig = siteConfig.forms?.formspree;

    if (!formspreeConfig?.endpoint) {
      throw new Error(
        'Configuración de Formspree no encontrada en site.config.ts'
      );
    }

    return this.create({
      endpoint: formspreeConfig.endpoint,
      timeout: formspreeConfig.timeout || 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    });
  }
}

/**
 * Utilidades para testing y debugging
 */
export class FormspreeUtils {
  static validateFormspreeEndpoint(endpoint: string): boolean {
    const formspreeRegex = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
    return formspreeRegex.test(endpoint);
  }

  static extractFormIdFromEndpoint(endpoint: string): string | null {
    const match = endpoint.match(/\/f\/([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }

  static generateTestFormData(): ContactForm {
    return {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      subject: 'Mensaje de prueba',
      message:
        'Este es un mensaje de prueba para verificar la funcionalidad del formulario.',
      phone: '+34 600 000 000',
      company: 'Empresa de Prueba S.L.',
    };
  }
}
