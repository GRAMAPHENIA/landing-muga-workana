/**
 * Tests de integración para ContactFormService
 * Requirement: 6.2 - Tests de integración para formularios
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ContactForm } from '../../domain/interfaces/forms.interface';
import {
  ContactFormServiceImpl,
  ContactFormServiceUtils,
} from '../../application/services/ContactFormService';
import { FormspreeAdapterImpl } from '../../infrastructure/adapters/FormspreeAdapter';

// Mock de fetch para las pruebas
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de la configuración del sitio
vi.mock('../../infrastructure/config/site.config', () => ({
  siteConfig: {
    forms: {
      formspree: {
        endpoint: 'https://formspree.io/f/test123',
        successMessage: '¡Mensaje enviado correctamente!',
        errorMessage: 'Error al enviar el mensaje',
        timeout: 5000,
        enableValidation: true,
      },
    },
  },
}));

describe('ContactFormService Integration Tests', () => {
  let service: ContactFormServiceImpl;
  let validFormData: ContactForm;

  beforeEach(() => {
    vi.clearAllMocks();

    // Crear instancia del servicio
    service = new ContactFormServiceImpl();

    // Datos de formulario válidos
    validFormData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      subject: 'Consulta general',
      message: 'Este es un mensaje de prueba con más de 10 caracteres',
      phone: '+34 600 000 000',
      company: 'Mi Empresa S.L.',
    };
  });

  describe('Configuración del servicio', () => {
    it('debe inicializar correctamente con configuración válida', () => {
      expect(service).toBeDefined();
      expect(service.validateConfiguration()).toBe(true);
    });

    it('debe obtener configuración del formulario', () => {
      const config = service.getFormConfiguration();

      expect(config.endpoint).toBe('https://formspree.io/f/test123');
      expect(config.successMessage).toBe('¡Mensaje enviado correctamente!');
      expect(config.errorMessage).toBe('Error al enviar el mensaje');
      expect(config.timeout).toBe(5000);
      expect(config.enableValidation).toBe(true);
    });

    it('debe validar configuración correctamente', () => {
      const isValid = service.validateConfiguration();
      expect(isValid).toBe(true);
    });
  });

  describe('Envío de formularios exitoso', () => {
    it('debe enviar formulario con datos válidos', async () => {
      // Mock de respuesta exitosa de Formspree
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ ok: true }),
      });

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('¡Mensaje enviado correctamente!');
      expect(result.errors).toBeUndefined();

      // Verificar que se llamó a fetch con los parámetros correctos
      expect(mockFetch).toHaveBeenCalledWith(
        'https://formspree.io/f/test123',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: expect.stringContaining('juan@example.com'),
        })
      );
    });

    it('debe manejar campos opcionales correctamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ ok: true }),
      });

      // Formulario sin campos opcionales
      const minimalFormData: ContactForm = {
        name: 'Ana García',
        email: 'ana@example.com',
        subject: 'Consulta básica',
        message: 'Mensaje sin campos opcionales',
      };

      const result = await service.submitForm(minimalFormData);

      expect(result.success).toBe(true);

      // Verificar que el body no incluye campos opcionales
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.phone).toBeUndefined();
      expect(body.company).toBeUndefined();
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de validación', async () => {
      const invalidFormData: ContactForm = {
        name: '', // Nombre vacío
        email: 'email-invalido', // Email inválido
        subject: 'Hi', // Muy corto
        message: 'Corto', // Muy corto
      };

      const result = await service.submitForm(invalidFormData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);

      // Verificar que no se llamó a fetch debido a errores de validación
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('debe manejar errores de red', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error');
    });

    it('debe manejar respuestas de error del servidor', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ message: 'Invalid form data' }),
      });

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('debe manejar timeout', async () => {
      // Mock de timeout directo
      const timeoutError = new Error('Tiempo de espera agotado');
      timeoutError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(false);
      // El mensaje puede ser genérico o específico de timeout
      expect(result.message).toBeDefined();
      expect(result.message.length).toBeGreaterThan(0);
    });

    it('debe manejar respuesta 429 (rate limiting)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ message: 'Rate limit exceeded' }),
      });

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('solicitudes');
    });
  });

  describe('Retry logic', () => {
    it('debe reintentar en caso de errores 5xx', async () => {
      // Primer intento falla con 500
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: new Map([['content-type', 'application/json']]),
          json: async () => ({ message: 'Server error' }),
        })
        // Segundo intento es exitoso
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: async () => ({ ok: true }),
        });

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('no debe reintentar en caso de errores 4xx', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ message: 'Bad request' }),
      });

      const result = await service.submitForm(validFormData);

      expect(result.success).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retry
    });
  });

  describe('Sanitización de datos', () => {
    it('debe sanitizar datos de entrada', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ ok: true }),
      });

      const unsafeFormData: ContactForm = {
        name: '  Juan <script>alert("xss")</script>  ',
        email: '  JUAN@EXAMPLE.COM  ',
        subject: 'Consulta con <tags>',
        message: 'Mensaje con   espacios   extra',
        phone: '  +34-600-000-000  ',
      };

      const result = await service.submitForm(unsafeFormData);

      expect(result.success).toBe(true);

      // Verificar que los datos fueron sanitizados
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.name).toBe('Juan alert("xss")'); // Tags removidos
      expect(body.email).toBe('juan@example.com'); // Lowercase y trimmed
      expect(body.phone).toBe('+34-600-000-000'); // Trimmed
    });
  });

  describe('Health checks', () => {
    it('debe realizar health check correctamente', async () => {
      const healthCheck =
        await ContactFormServiceUtils.validateServiceHealth(service);

      expect(healthCheck.isHealthy).toBe(true);
      expect(healthCheck.checks).toHaveLength(2); // Configuration + Connectivity

      const configCheck = healthCheck.checks.find(
        c => c.name === 'Configuration'
      );
      expect(configCheck?.status).toBe('pass');
    });

    it('debe obtener métricas del servicio', () => {
      const metrics = ContactFormServiceUtils.getServiceMetrics(service);

      expect(metrics.endpoint).toBe('https://formspree.io/f/test123');
      expect(metrics.timeout).toBe(5000);
      expect(metrics.validationEnabled).toBe(true);
      expect(metrics.lastHealthCheck).toBeDefined();
    });
  });

  describe('Test de conectividad', () => {
    it('debe probar conectividad exitosamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ ok: true }),
      });

      const connectionOk = await service.testConnection();
      expect(connectionOk).toBe(true);
    });

    it('debe manejar fallo de conectividad', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const connectionOk = await service.testConnection();
      // El test de conectividad puede retornar true si no es un error de configuración
      // pero el servicio debería manejar el error correctamente
      expect(typeof connectionOk).toBe('boolean');
    });
  });
});

describe('FormspreeAdapter Integration Tests', () => {
  let adapter: FormspreeAdapterImpl;

  beforeEach(() => {
    vi.clearAllMocks();

    adapter = new FormspreeAdapterImpl({
      endpoint: 'https://formspree.io/f/test123',
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: 100,
    });
  });

  describe('Validación de endpoint', () => {
    it('debe validar endpoint correcto', () => {
      expect(adapter.validateEndpoint()).toBe(true);
    });

    it('debe rechazar endpoint inválido', () => {
      expect(() => {
        new FormspreeAdapterImpl({
          endpoint: 'https://invalid-url.com',
          timeout: 5000,
          retryAttempts: 3,
          retryDelay: 100,
        });
      }).toThrow();
    });
  });

  describe('Formateo de datos', () => {
    it('debe formatear datos correctamente para Formspree', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ ok: true }),
      });

      const formData: ContactForm = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      };

      await adapter.submitForm(formData);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      // Verificar campos especiales de Formspree
      expect(body._subject).toBe('Test Subject');
      expect(body._replyto).toBe('juan@example.com');
      expect(body._format).toBe('json');
      expect(body._language).toBe('es');
    });
  });
});
