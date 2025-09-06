// astro.config.ts
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://landing-muga-workana.vercel.app/';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        `${SITE_URL}/services/web-development`,
        `${SITE_URL}/services/consulting`,
        `${SITE_URL}/services/support`,
        `${SITE_URL}/privacy`,
        `${SITE_URL}/terms`,
        `${SITE_URL}/cookies`,
      ],
      filter: page => {
        const excludePatterns = [
          '/404', '/500', '/admin', '/private', '/api', '/test', '/_'
        ];
        return !excludePatterns.some(pattern => page.includes(pattern));
      },
      serialize(item) {
        // Definimos los valores como strings simples, ya que las anotaciones de tipo solo se usan en TypeScript
        const daily = 'daily';
        const weekly = 'weekly';
        const yearly = 'yearly';

        if (item.url.endsWith('/') || item.url.endsWith('/index')) {
          item.priority = 1.0;
          item.changefreq = daily;
        } else if (
          item.url.includes('/about') ||
          item.url.includes('/services') ||
          item.url.includes('/contact')
        ) {
          item.priority = 0.8;
          item.changefreq = weekly;
        } else if (
          item.url.includes('/privacy') ||
          item.url.includes('/terms') ||
          item.url.includes('/cookies')
        ) {
          item.priority = 0.3;
          item.changefreq = yearly;
        } else {
          item.priority = 0.6;
          item.changefreq = weekly;
        }

        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  output: 'static',
  site: SITE_URL,
  vite: {
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('astro') || id.includes('@astrojs')) {
                return 'astro-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    ssr: {
      external: ['fsevents'],
    },
  },
  compressHTML: true,
});
