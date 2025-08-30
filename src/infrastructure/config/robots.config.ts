/**
 * Configuración para robots.txt
 * Requirement: 3.2 - Configuración específica para SEO
 */

import { siteConfig } from './site.config';

export interface RobotsConfig {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export interface RobotsRule {
  userAgent: string;
  rules: {
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  };
}

// Configuración base de robots.txt
export const robotsConfig = {
  // Reglas generales para todos los crawlers
  general: {
    userAgent: '*',
    allow: ['/'],
    disallow: [
      '/admin/',
      '/private/',
      '/api/',
      '/_/',
      '/test/',
      '/.well-known/',
      '/*.json$',
      '/*.xml$',
      '/*.yml$',
      '/*.yaml$',
      '/*.config.*',
      '/.*',
    ],
    crawlDelay: 1,
  },

  // Reglas específicas para crawlers importantes
  specific: [
    {
      userAgent: 'Googlebot',
      rules: {
        allow: ['/'],
        crawlDelay: 1,
      },
    },
    {
      userAgent: 'Bingbot',
      rules: {
        allow: ['/'],
        crawlDelay: 1,
      },
    },
    {
      userAgent: 'Slurp',
      rules: {
        allow: ['/'],
        crawlDelay: 2,
      },
    },
    {
      userAgent: 'DuckDuckBot',
      rules: {
        allow: ['/'],
        crawlDelay: 1,
      },
    },
    {
      userAgent: 'Baiduspider',
      rules: {
        allow: ['/'],
        crawlDelay: 2,
      },
    },
  ],

  // Crawlers bloqueados
  blocked: ['AhrefsBot', 'MJ12bot', 'DotBot', 'SemrushBot', 'MegaIndex'],

  // Archivos permitidos específicamente
  allowedFiles: [
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/robots.txt',
    '/favicon.ico',
    '/favicon.svg',
    '/.well-known/security.txt',
  ],

  // Configuración del sitemap
  sitemap: `${siteConfig.metadata.site.url}/sitemap.xml`,

  // Host principal
  host: siteConfig.metadata.site.url.replace(/^https?:\/\//, ''),
};

/**
 * Genera el contenido del archivo robots.txt
 */
export function generateRobotsTxt(): string {
  const lines: string[] = [];

  // Encabezado
  lines.push('# Robots.txt optimizado para SEO');
  lines.push(
    `# Generado automáticamente para ${siteConfig.metadata.site.title}`
  );
  lines.push('');

  // Reglas generales
  lines.push('# Permitir acceso a todos los crawlers principales');
  lines.push(`User-agent: ${robotsConfig.general.userAgent}`);
  robotsConfig.general.allow.forEach(path => {
    lines.push(`Allow: ${path}`);
  });
  lines.push('');

  // Reglas de bloqueo generales
  lines.push('# Bloquear acceso a directorios administrativos y privados');
  robotsConfig.general.disallow.forEach(path => {
    lines.push(`Disallow: ${path}`);
  });
  lines.push('');

  // Archivos permitidos específicamente
  lines.push('# Permitir acceso específico a archivos importantes para SEO');
  robotsConfig.allowedFiles.forEach(file => {
    lines.push(`Allow: ${file}`);
  });
  lines.push('');

  // Reglas específicas por crawler
  robotsConfig.specific.forEach(crawler => {
    lines.push(`# Configuración específica para ${crawler.userAgent}`);
    lines.push(`User-agent: ${crawler.userAgent}`);

    if (crawler.rules.allow) {
      crawler.rules.allow.forEach(path => {
        lines.push(`Allow: ${path}`);
      });
    }

    if (crawler.rules.disallow) {
      crawler.rules.disallow.forEach(path => {
        lines.push(`Disallow: ${path}`);
      });
    }

    if (crawler.rules.crawlDelay) {
      lines.push(`Crawl-delay: ${crawler.rules.crawlDelay}`);
    }

    lines.push('');
  });

  // Crawlers bloqueados
  lines.push('# Bloquear crawlers problemáticos o innecesarios');
  robotsConfig.blocked.forEach(bot => {
    lines.push(`User-agent: ${bot}`);
    lines.push('Disallow: /');
    lines.push('');
  });

  // Sitemap
  lines.push('# Ubicación del sitemap');
  lines.push(`Sitemap: ${robotsConfig.sitemap}`);
  lines.push('');

  // Información adicional
  lines.push('# Información adicional');
  lines.push(`# Host: ${robotsConfig.host}`);
  lines.push(
    `# Última actualización: ${new Date().toISOString().split('T')[0]}`
  );

  return lines.join('\n');
}

/**
 * Valida si un user-agent está permitido
 */
export function isUserAgentAllowed(userAgent: string): boolean {
  return !robotsConfig.blocked.includes(userAgent);
}

/**
 * Obtiene el crawl delay para un user-agent específico
 */
export function getCrawlDelay(userAgent: string): number {
  const specificRule = robotsConfig.specific.find(
    rule => rule.userAgent.toLowerCase() === userAgent.toLowerCase()
  );

  return specificRule?.rules.crawlDelay || robotsConfig.general.crawlDelay;
}

/**
 * Verifica si una ruta está permitida para un user-agent
 */
export function isPathAllowed(userAgent: string, path: string): boolean {
  // Si el user-agent está bloqueado, no permitir nada
  if (!isUserAgentAllowed(userAgent)) {
    return false;
  }

  // Verificar archivos específicamente permitidos primero
  const isSpecificallyAllowed = robotsConfig.allowedFiles.some(allowedFile => {
    if (allowedFile.includes('*')) {
      const pattern = allowedFile.replace(/\*/g, '.*');
      return new RegExp(pattern).test(path);
    }
    return path === allowedFile;
  });

  if (isSpecificallyAllowed) {
    return true;
  }

  // Verificar rutas bloqueadas
  const isDisallowed = robotsConfig.general.disallow.some(disallowedPath => {
    if (disallowedPath.endsWith('$')) {
      // Patrón de extensión de archivo (ej: /*.json$)
      if (disallowedPath.startsWith('/*') && disallowedPath.endsWith('$')) {
        const extension = disallowedPath.slice(2, -1); // Remover /* y $
        return path.endsWith(extension);
      }
      // Otros patrones que terminan en $
      const pattern = disallowedPath.slice(0, -1);
      return path.endsWith(pattern);
    }
    if (disallowedPath.endsWith('/')) {
      return path.startsWith(disallowedPath);
    }
    if (disallowedPath === '/.*') {
      // Archivos y directorios ocultos (que empiezan con .)
      const pathParts = path.split('/');
      return pathParts.some(part => part.startsWith('.') && part.length > 1);
    }
    if (disallowedPath.includes('*')) {
      // Patrones con wildcards como /*.config.*
      if (disallowedPath.startsWith('/*') && disallowedPath.includes('.')) {
        const parts = disallowedPath.slice(2).split('*'); // Remover /*
        if (parts.length === 2) {
          const [prefix, suffix] = parts;
          const filename = path.split('/').pop() || '';
          return (
            filename.includes(prefix) &&
            (suffix === '' || filename.endsWith(suffix))
          );
        }
      }
    }
    return path === disallowedPath;
  });

  return !isDisallowed;
}
