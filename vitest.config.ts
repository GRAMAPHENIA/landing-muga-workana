import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      // Configuración del entorno de testing
      environment: 'happy-dom',

      // Variables de entorno para testing
      env: {
        SITE_URL: 'https://mi-landing-page.com',
        FORMSPREE_ENDPOINT: 'https://formspree.io/f/test-endpoint',
        SITE_TITLE: 'Landing Page Profesional',
        SITE_DESCRIPTION:
          'Una landing page profesional construida con Astro, TypeScript y TailwindCSS',
        SITE_AUTHOR: 'Tu Nombre',
        TWITTER_HANDLE: '@tu_usuario',
        LINKEDIN_COMPANY: 'tu-empresa',
        GITHUB_USER: 'tu-usuario',
      },

      // Archivos de setup
      setupFiles: ['./src/test/setup.ts'],

      // Globals para usar describe, it, expect sin imports
      globals: true,

      // Incluir archivos de test
      include: [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],

      // Excluir archivos
      exclude: ['node_modules', 'dist', '.astro', 'coverage'],

      // Configuración de coverage
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'coverage/**',
          'dist/**',
          '.astro/**',
          'node_modules/**',
          'src/test/**',
          '**/*.d.ts',
          '**/*.config.*',
          '**/astro.config.*',
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },

      // Configuración de reporters
      reporters: ['verbose', 'html'],

      // Timeout para tests
      testTimeout: 10000,

      // Configuración de archivos de tipos
      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.json',
      },
    },
  })
);
