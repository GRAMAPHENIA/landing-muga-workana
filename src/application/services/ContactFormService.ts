/**
 * Servicio de aplicación para formularios de contacto
 * Requirement: 2.1 - Arquitectura hexagonal con servicios de aplicación
 * Requirement: 6.2 - Casos de uso para envío de formularios
 */

import type { ContactForm, FormSubmissionResult } from '../../domain/interfaces/forms.interface';
import type { SubmitContactFormUseCase } from '../usecases/SubmitContactForm.usecase';
import { SubmitContactFormUseCaseFactory } from '../usecases/SubmitContactForm.usecase';
import { FormspreeAdapterFactory } from '../../infrastructure/adapters/FormspreeAdapter';
import { siteConfig } from '../../infrastructure/config/site.config';

export interface ContactFormService {
  submitForm(formData: ContactForm): Promise<FormSubmissionResult>;
  validateConfiguration(): boolean;
  getFormConfiguration(): FormConfiguration;
}

export interface FormConfiguration {
  endpoint: string;
  successMessage: string;
  errorMessage: string;
  timeout: number;
  enableValidation: boolean;
}

export class ContactFormServiceImpl implements ContactFormService {
  private readonly submitContactFormUseCase: SubmitContactFormUseCase;
  private readonly configuration: FormConfiguration;

  constructor() {
    try {
      // Crear adaptador desde configuración
      const formspreeAdapter = FormspreeAdapterFactory.createFromSiteConfig(siteConfig);
      
      // Crear caso de uso
      this.submitContactFormUseCase = SubmitContactFormUseCaseFactory.create(formspreeAdapter);
      
      // Configuración del servicio
      this.configuration = {
        endpoint: siteConfig.forms.formspree.endpoint,
        successMessage: siteConfig.forms.formspree.successMessage,
        errorMessage: siteConfig.forms.formspree.errorMessage,
        timeout: siteConfig.forms.formspree.timeout || 10000,
        enableValidation: siteConfig.forms.formspree.enableValidation
      };

    } catch (error) {
      console.error('Error initializing ContactFormService:', error);
      throw new Error('No se pudo inicializar el servicio de formularios. Verifica la configuración.');
    }
  }

  async submitForm(formData: ContactForm): Promise<FormSubmissionResult> {
    try {
      // Validar configuración antes del envío
      if (!this.validateConfiguration()) {
        return {
          success: false,
          message: 'Configuración del formulario inválida',
          errors: [{
            field: 'configuration',
            message: 'El servicio de formularios no está configurado correctamente'
          }]
        };
      }

      // Ejecutar caso de uso
      const result = await this.submitContactFormUseCase.execute(formData);

      // Enriquecer resultado con configuración
      if (result.success) {
        result.message = this.configuration.successMessage;
      } else if (!result.message) {
        result.message = this.configuration.errorMessage;
      }

      return result;

    } catch (error) {
      console.error('Error in ContactFormService.submitForm:', error);
      
      return {
        success: false,
        message: this.configuration.errorMessage,
        errors: [{
          field: 'service',
          message: 'Error interno del servicio'
        }]
      };
    }
  }

  validateConfiguration(): boolean {
    try {
      // Verificar que existe la configuración
      if (!this.configuration.endpoint) {
        console.error('Endpoint de Formspree no configurado');
        return false;
      }

      // Verificar formato del endpoint
      const formspreeRegex = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
      if (!formspreeRegex.test(this.configuration.endpoint)) {
        console.error('Formato de endpoint de Formspree inválido');
        return false;
      }

      // Verificar timeout
      if (this.configuration.timeout <= 0) {
        console.error('Timeout inválido');
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error validating configuration:', error);
      return false;
    }
  }

  getFormConfiguration(): FormConfiguration {
    return { ...this.configuration };
  }

  /**
   * Método para probar la conectividad del servicio
   */
  async testConnection(): Promise<boolean> {
    try {
      const testData: ContactForm = {
        name: 'Test Connection',
        email: 'test@example.com',
        subject: 'Connection Test',
        message: 'This is a connection test'
      };

      const result = await this.submitContactFormUseCase.execute(testData);
      
      // Considerar exitoso si no hay errores de configuración
      // Fallar si hay errores de red o configuración
      return result.success || (!result.message?.includes('configuración') && !result.message?.includes('Network error'));

    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

/**
 * Singleton del servicio de formularios
 */
class ContactFormServiceSingleton {
  private static instance: ContactFormService | null = null;

  static getInstance(): ContactFormService {
    if (!this.instance) {
      this.instance = new ContactFormServiceImpl();
    }
    return this.instance;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}

/**
 * Factory y utilidades para el servicio
 */
export class ContactFormServiceFactory {
  static create(): ContactFormService {
    return new ContactFormServiceImpl();
  }

  static createSingleton(): ContactFormService {
    return ContactFormServiceSingleton.getInstance();
  }

  static resetSingleton(): void {
    ContactFormServiceSingleton.resetInstance();
  }
}

/**
 * Hook para usar el servicio en componentes Astro
 */
export function useContactFormService(): ContactFormService {
  return ContactFormServiceFactory.createSingleton();
}

/**
 * Utilidades para debugging y testing
 */
export class ContactFormServiceUtils {
  static async validateServiceHealth(service: ContactFormService): Promise<ServiceHealthCheck> {
    const health: ServiceHealthCheck = {
      isHealthy: true,
      checks: []
    };

    // Verificar configuración
    const configValid = service.validateConfiguration();
    health.checks.push({
      name: 'Configuration',
      status: configValid ? 'pass' : 'fail',
      message: configValid ? 'Configuración válida' : 'Configuración inválida'
    });

    if (!configValid) {
      health.isHealthy = false;
    }

    // Verificar conectividad (si el servicio lo soporta)
    if ('testConnection' in service) {
      try {
        const connectionOk = await (service as any).testConnection();
        health.checks.push({
          name: 'Connectivity',
          status: connectionOk ? 'pass' : 'fail',
          message: connectionOk ? 'Conectividad OK' : 'Error de conectividad'
        });

        if (!connectionOk) {
          health.isHealthy = false;
        }
      } catch (error) {
        health.checks.push({
          name: 'Connectivity',
          status: 'fail',
          message: `Error de conectividad: ${error}`
        });
        health.isHealthy = false;
      }
    }

    return health;
  }

  static getServiceMetrics(service: ContactFormService): ServiceMetrics {
    const config = service.getFormConfiguration();
    
    return {
      endpoint: config.endpoint,
      timeout: config.timeout,
      validationEnabled: config.enableValidation,
      lastHealthCheck: new Date().toISOString()
    };
  }
}

export interface ServiceHealthCheck {
  isHealthy: boolean;
  checks: HealthCheckResult[];
}

export interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export interface ServiceMetrics {
  endpoint: string;
  timeout: number;
  validationEnabled: boolean;
  lastHealthCheck: string;
}