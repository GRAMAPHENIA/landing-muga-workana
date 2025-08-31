import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      environment: 'happy-dom',

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

      setupFiles: ['./src/test/setup.ts'],

      globals: true,

      include: [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],

      exclude: ['node_modules', 'dist', '.astro', 'coverage'],

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

      reporters: ['verbose', 'html'],

      testTimeout: 10000,

      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.json',
      },
    },
  })
);
