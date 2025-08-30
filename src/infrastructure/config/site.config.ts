/**
 * Configuración central del sitio con validación Zod
 * Requirement: 3.4 - Configuración SEO y metadatos
 * Requirement: 5.4 - Variables de entorno para datos sensibles
 */

import { z } from 'zod';
import type { SiteConfig } from '../../domain/interfaces/site.interface';

// Esquemas de validación con Zod
const SEOConfigSchema = z.object({
  site: z.object({
    title: z.string().min(1, 'El título del sitio es requerido'),
    description: z
      .string()
      .min(10, 'La descripción debe tener al menos 10 caracteres'),
    url: z.string().url('URL del sitio inválida'),
    author: z.string().min(1, 'El autor es requerido'),
    keywords: z
      .array(z.string())
      .min(1, 'Al menos una palabra clave es requerida'),
    language: z.string().default('es'),
  }),
  openGraph: z.object({
    title: z.string().min(1),
    description: z.string().min(10),
    image: z.string().url('URL de imagen OpenGraph inválida'),
    type: z.literal('website'),
    locale: z.string().default('es_ES'),
  }),
  twitter: z.object({
    card: z.literal('summary_large_image'),
    site: z.string().min(1),
    creator: z.string().min(1),
    image: z.string().url('URL de imagen Twitter inválida'),
  }),
  structuredData: z
    .object({
      '@type': z.enum(['Organization', 'WebSite']),
      name: z.string().min(1),
      url: z.string().url(),
      logo: z.string().url().optional(),
    })
    .optional(),
});

const NavigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional(),
  ariaLabel: z.string().optional(),
});

const SocialLinkSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'instagram', 'github']),
  url: z.string().url(),
  ariaLabel: z.string().optional(),
});

const SiteConfigSchema = z.object({
  metadata: SEOConfigSchema,
  navigation: z.array(NavigationItemSchema),
  footer: z.object({
    copyright: z.string().min(1),
    links: z.array(
      z.object({
        title: z.string().min(1),
        links: z.array(
          z.object({
            label: z.string().min(1),
            href: z.string().min(1),
            external: z.boolean().optional(),
            ariaLabel: z.string().optional(),
          })
        ),
      })
    ),
    social: z.array(SocialLinkSchema),
    showVersion: z.boolean().default(true),
  }),
  forms: z.object({
    formspree: z.object({
      endpoint: z.string().min(1, 'Endpoint de Formspree es requerido'),
      successMessage: z.string().default('¡Mensaje enviado correctamente!'),
      errorMessage: z
        .string()
        .default('Error al enviar el mensaje. Inténtalo de nuevo.'),
      enableValidation: z.boolean().default(true),
      timeout: z.number().default(10000),
    }),
  }),
  version: z.object({
    changelogPath: z.string().default('CHANGELOG.md'),
    displayFormat: z.enum(['full', 'short', 'semantic']).default('short'),
    showInFooter: z.boolean().default(true),
    fallbackVersion: z.string().default('1.0.0'),
  }),
  performance: z.object({
    enableImageOptimization: z.boolean().default(true),
    enableLazyLoading: z.boolean().default(true),
    criticalCSSInline: z.boolean().default(true),
    preloadFonts: z.array(z.string()).default([]),
  }),
  logo: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().optional(),
    height: z.number().optional(),
    href: z.string().default('/'),
  }),
});

// Función para obtener variables de entorno con validación
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variable de entorno ${key} no encontrada`);
  }
  return value;
}

// Configuración del sitio
const siteConfigData: SiteConfig = {
  metadata: {
    site: {
      title: 'Landing Page Profesional',
      description:
        'Una landing page moderna y profesional construida con Astro, TypeScript y TailwindCSS',
      url: getEnvVar('SITE_URL', 'https://mi-landing-page.com'),
      author: 'Tu Nombre',
      keywords: [
        'landing page',
        'astro',
        'typescript',
        'tailwindcss',
        'seo',
        'profesional',
        'moderno',
        'responsive',
      ],
      language: 'es',
    },
    openGraph: {
      title: 'Landing Page Profesional',
      description:
        'Una landing page moderna y profesional construida con Astro, TypeScript y TailwindCSS',
      image: `${getEnvVar('SITE_URL', 'https://mi-landing-page.com')}/images/og-image.jpg`,
      type: 'website',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@tu_usuario',
      creator: '@tu_usuario',
      image: `${getEnvVar('SITE_URL', 'https://mi-landing-page.com')}/images/twitter-card.jpg`,
    },
    structuredData: {
      '@type': 'Organization',
      name: 'Tu Empresa',
      url: getEnvVar('SITE_URL', 'https://mi-landing-page.com'),
      logo: `${getEnvVar('SITE_URL', 'https://mi-landing-page.com')}/images/logo.png`,
    },
  },
  navigation: [
    { label: 'Inicio', href: '/', ariaLabel: 'Ir a la página de inicio' },
    {
      label: 'Acerca de',
      href: '/about',
      ariaLabel: 'Conocer más sobre nosotros',
    },
    {
      label: 'Servicios',
      href: '/services',
      ariaLabel: 'Ver nuestros servicios',
    },
    {
      label: 'Contacto',
      href: '/contact',
      ariaLabel: 'Contactar con nosotros',
    },
  ],
  footer: {
    copyright: `© ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.`,
    links: [
      {
        title: 'Empresa',
        links: [
          { label: 'Acerca de', href: '/about' },
          { label: 'Equipo', href: '/team' },
          { label: 'Carreras', href: '/careers' },
        ],
      },
      {
        title: 'Servicios',
        links: [
          { label: 'Desarrollo Web', href: '/services/web-development' },
          { label: 'Consultoría', href: '/services/consulting' },
          { label: 'Soporte', href: '/services/support' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacidad', href: '/privacy' },
          { label: 'Términos', href: '/terms' },
          { label: 'Cookies', href: '/cookies' },
        ],
      },
    ],
    social: [
      {
        platform: 'twitter',
        url: 'https://twitter.com/tu_usuario',
        ariaLabel: 'Síguenos en Twitter',
      },
      {
        platform: 'linkedin',
        url: 'https://linkedin.com/company/tu-empresa',
        ariaLabel: 'Conéctate en LinkedIn',
      },
      {
        platform: 'github',
        url: 'https://github.com/tu-usuario',
        ariaLabel: 'Ver nuestro código en GitHub',
      },
    ],
    showVersion: true,
  },
  forms: {
    formspree: {
      endpoint: getEnvVar('FORMSPREE_ENDPOINT', ''),
      successMessage: '¡Gracias por tu mensaje! Te responderemos pronto.',
      errorMessage:
        'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.',
      enableValidation: true,
      timeout: 10000,
    },
  },
  version: {
    changelogPath: 'CHANGELOG.md',
    displayFormat: 'short',
    showInFooter: true,
    fallbackVersion: '1.0.0',
  },
  performance: {
    enableImageOptimization: true,
    enableLazyLoading: true,
    criticalCSSInline: true,
    preloadFonts: ['/fonts/inter-var.woff2'],
  },
  logo: {
    src: '/images/logo.svg',
    alt: 'Logo de Tu Empresa',
    width: 120,
    height: 40,
    href: '/',
  },
};

// Validar configuración
export const siteConfig = SiteConfigSchema.parse(siteConfigData);

// Exportar esquemas para uso en otros lugares
export {
  SiteConfigSchema,
  SEOConfigSchema,
  NavigationItemSchema,
  SocialLinkSchema,
};

// Función helper para validar configuración personalizada
export function validateSiteConfig(config: unknown): SiteConfig {
  return SiteConfigSchema.parse(config);
}
