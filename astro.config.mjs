// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Importar configuración del sitio
// Nota: En astro.config.mjs usamos la URL directamente por limitaciones de ES modules
const SITE_URL = 'https://mi-landing-page.com';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false, // Usaremos nuestros estilos globales
    }),
    sitemap({
      // Configuración del sitemap con prioridades dinámicas
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),

      // Páginas personalizadas adicionales
      customPages: [
        `${SITE_URL}/services/web-development`,
        `${SITE_URL}/services/consulting`,
        `${SITE_URL}/services/support`,
        `${SITE_URL}/privacy`,
        `${SITE_URL}/terms`,
        `${SITE_URL}/cookies`,
      ],

      // Filtrar páginas que no queremos en el sitemap
      filter: page => {
        const excludePatterns = [
          '/404',
          '/500',
          '/admin',
          '/private',
          '/api',
          '/test',
          '/_',
        ];
        return !excludePatterns.some(pattern => page.includes(pattern));
      },

      // Configurar prioridades específicas por página
      serialize(item) {
        // Página de inicio tiene máxima prioridad
        if (item.url.endsWith('/') || item.url.endsWith('/index')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // Páginas principales tienen alta prioridad
        else if (
          item.url.includes('/about') ||
          item.url.includes('/services') ||
          item.url.includes('/contact')
        ) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // Páginas legales tienen baja prioridad
        else if (
          item.url.includes('/privacy') ||
          item.url.includes('/terms') ||
          item.url.includes('/cookies')
        ) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        // Páginas secundarias tienen prioridad media
        else {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }

        // Actualizar fecha de modificación como string
        item.lastmod = new Date().toISOString();

        return item;
      },
    }),
  ],
  output: 'static',
  site: SITE_URL,
  
  // Optimizaciones para reducir el tamaño del bundle
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar TailwindCSS en su propio chunk
            tailwind: ['tailwindcss'],
          },
        },
      },
    },
    // Optimizar dependencias
    optimizeDeps: {
      exclude: ['vue', '@vue/runtime-core', '@vue/runtime-dom'],
    },
  },
});
