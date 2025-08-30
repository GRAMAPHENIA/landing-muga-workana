import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      // Configuración del entorno de testing
      environment: 'happy-dom',
      
      // Archivos de setup
      setupFiles: ['./src/test/setup.ts'],
      
      // Globals para usar describe, it, expect sin imports
      globals: true,
      
      // Incluir archivos de test
      include: [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ],
      
      // Excluir archivos
      exclude: [
        'node_modules',
        'dist',
        '.astro',
        'coverage'
      ],
      
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
          '**/astro.config.*'
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          }
        }
      },
      
      // Configuración de reporters
      reporters: ['verbose', 'html'],
      
      // Timeout para tests
      testTimeout: 10000,
      
      // Configuración de archivos de tipos
      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.json'
      }
    }
  })
);