import js from '@eslint/js';
import tsparser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';

export default [
  // Configuración base de JavaScript
  js.configs.recommended,

  // Configuración para archivos JavaScript y TypeScript
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: false,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        AbortController: 'readonly',
        Response: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        FormData: 'readonly',
        Event: 'readonly',
        NodeListOf: 'readonly',
        global: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        clearInterval: 'readonly',
        setInterval: 'readonly',
        performance: 'readonly',
        navigator: 'readonly',
        SVGElement: 'readonly',
        HTMLElement: 'readonly',
        getComputedStyle: 'readonly',
        history: 'readonly',
        location: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      // Reglas básicas
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-undef': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-useless-escape': 'warn',
      'no-cond-assign': 'warn',
      'no-func-assign': 'warn',
      'no-empty': 'warn',
      'getter-return': 'warn',
    },
  },

  // Configuración para archivos Astro
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Reglas específicas para archivos Astro
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'warn',
      'astro/no-set-html-directive': 'warn',
      'astro/no-unused-css-selector': 'warn',
      'astro/prefer-class-list-directive': 'off',
      'astro/prefer-split-class-list': 'off',
      'astro/semi': ['error', 'always'],
      'no-console': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'warn',
    },
  },

  // Ignorar archivos específicos
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'coverage/**',
      'html/**',
      '*.config.js',
      '*.config.mjs',
      'pnpm-lock.yaml',
    ],
  },
];
