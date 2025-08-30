/**
 * Exportaciones centrales de configuración
 */

// Configuración principal del sitio
export { siteConfig, validateSiteConfig } from './site.config';

// Variables de entorno
export { getEnvVars, getEnvVar, isDev, isProd } from './env.config';

// Validación de formularios
export {
  contactFormValidation,
  defaultValidationMessages,
  validationPatterns,
  formatValidationMessage,
} from './validation.config';
