/**
 * Configuración específica para el sitemap
 * Requirement: 3.2 - Generación automática de sitemap
 */

import type { SitemapOptions } from '@astrojs/sitemap';
import { siteConfig } from './site.config';

export interface SitemapConfig {
  changefreq:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
  lastmod: Date;
  customPages: string[];
  excludePatterns: string[];
}

// Configuración base del sitemap
export const sitemapConfig: SitemapConfig = {
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
  customPages: [
    // Páginas de servicios específicos
    `${siteConfig.metadata.site.url}/services/web-development`,
    `${siteConfig.metadata.site.url}/services/consulting`,
    `${siteConfig.metadata.site.url}/services/support`,
    // Páginas legales
    `${siteConfig.metadata.site.url}/privacy`,
    `${siteConfig.metadata.site.url}/terms`,
    `${siteConfig.metadata.site.url}/cookies`,
  ],
  excludePatterns: [
    '/404',
    '/500',
    '/admin',
    '/private',
    '/api',
    '/test',
    '/_',
  ],
};

// Configuración de prioridades por tipo de página
export const pagePriorities = {
  home: { priority: 1.0, changefreq: 'daily' as const },
  main: { priority: 0.8, changefreq: 'weekly' as const },
  secondary: { priority: 0.6, changefreq: 'monthly' as const },
  legal: { priority: 0.3, changefreq: 'yearly' as const },
} as const;

// Función para determinar la prioridad de una página
export function getPagePriority(url: string): {
  priority: number;
  changefreq: SitemapConfig['changefreq'];
} {
  // Página de inicio
  if (url.endsWith('/') || url.endsWith('/index')) {
    return pagePriorities.home;
  }

  // Páginas principales
  if (
    url.includes('/about') ||
    url.includes('/services') ||
    url.includes('/contact')
  ) {
    return pagePriorities.main;
  }

  // Páginas legales
  if (
    url.includes('/privacy') ||
    url.includes('/terms') ||
    url.includes('/cookies')
  ) {
    return pagePriorities.legal;
  }

  // Páginas secundarias por defecto
  return pagePriorities.secondary;
}

// Función para filtrar páginas del sitemap
export function shouldIncludeInSitemap(url: string): boolean {
  return !sitemapConfig.excludePatterns.some(pattern => url.includes(pattern));
}

// Configuración completa para @astrojs/sitemap
export function createSitemapOptions(): Partial<SitemapOptions> {
  return {
    changefreq: sitemapConfig.changefreq,
    priority: sitemapConfig.priority,
    lastmod: sitemapConfig.lastmod,
    customPages: sitemapConfig.customPages,
    filter: shouldIncludeInSitemap,
    serialize: item => {
      const pageConfig = getPagePriority(item.url);
      item.priority = pageConfig.priority;
      item.changefreq = pageConfig.changefreq;
      item.lastmod = sitemapConfig.lastmod;
      return item;
    },
  };
}
