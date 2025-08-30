import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';

export default [
  // Configuración base de JavaScript
  js.configs.recommended,
  
  // Configuración para archivos TypeScript
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      // Reglas base de TypeScript
      ...tseslint.configs.recommended.rules,
      
      // Reglas personalizadas para el proyecto
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      
      // Reglas generales de JavaScript/TypeScript
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },
  
  // Configuración para archivos Astro
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Reglas específicas para archivos Astro
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-set-html-directive': 'warn',
      'astro/no-unused-css-selector': 'warn',
      'astro/prefer-class-list-directive': 'error',
      'astro/prefer-split-class-list': 'error',
      'astro/semi': ['error', 'always'],
    },
  },
  
  // Ignorar archivos específicos
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      'pnpm-lock.yaml',
    ],
  },
];