/**
 * Configuración de variables de entorno con validación
 * Requirement: 5.4 - Variables de entorno para datos sensibles
 */

import { z } from 'zod';

// Esquema de validación para variables de entorno
const EnvSchema = z.object({
  SITE_URL: z.string().url('SITE_URL debe ser una URL válida'),
  FORMSPREE_ENDPOINT: z.string().min(1, 'FORMSPREE_ENDPOINT es requerido'),
  SITE_TITLE: z.string().optional(),
  SITE_DESCRIPTION: z.string().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  TWITTER_HANDLE: z.string().optional(),
  LINKEDIN_COMPANY: z.string().optional(),
  GITHUB_USER: z.string().optional(),
  SITE_AUTHOR: z.string().optional(),
  SITE_KEYWORDS: z.string().optional(),
});

type EnvVars = z.infer<typeof EnvSchema>;

/**
 * Obtiene y valida las variables de entorno
 */
export function getEnvVars(): EnvVars {
  const env = {
    SITE_URL: import.meta.env.SITE_URL || process.env.SITE_URL,
    FORMSPREE_ENDPOINT: import.meta.env.FORMSPREE_ENDPOINT || process.env.FORMSPREE_ENDPOINT,
    SITE_TITLE: import.meta.env.SITE_TITLE || process.env.SITE_TITLE,
    SITE_DESCRIPTION: import.meta.env.SITE_DESCRIPTION || process.env.SITE_DESCRIPTION,
    GOOGLE_ANALYTICS_ID: import.meta.env.GOOGLE_ANALYTICS_ID || process.env.GOOGLE_ANALYTICS_ID,
    TWITTER_HANDLE: import.meta.env.TWITTER_HANDLE || process.env.TWITTER_HANDLE,
    LINKEDIN_COMPANY: import.meta.env.LINKEDIN_COMPANY || process.env.LINKEDIN_COMPANY,
    GITHUB_USER: import.meta.env.GITHUB_USER || process.env.GITHUB_USER,
    SITE_AUTHOR: import.meta.env.SITE_AUTHOR || process.env.SITE_AUTHOR,
    SITE_KEYWORDS: import.meta.env.SITE_KEYWORDS || process.env.SITE_KEYWORDS,
  };

  try {
    return EnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Variables de entorno inválidas:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

/**
 * Obtiene una variable de entorno específica con valor por defecto
 */
export function getEnvVar(key: keyof EnvVars, defaultValue?: string): string {
  const value = import.meta.env[key] || process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variable de entorno ${key} no encontrada`);
  }
  return value;
}

/**
 * Verifica si estamos en modo de desarrollo
 */
export function isDev(): boolean {
  return import.meta.env.DEV || process.env.NODE_ENV === 'development';
}

/**
 * Verifica si estamos en modo de producción
 */
export function isProd(): boolean {
  return import.meta.env.PROD || process.env.NODE_ENV === 'production';
}