# Design Document

## Overview

Este documento describe el diseño técnico para una Landing Page profesional construida con Astro, TypeScript y TailwindCSS. El proyecto implementa arquitectura hexagonal para garantizar separación de responsabilidades, mantenibilidad y escalabilidad. La solución incluye configuración completa de SEO, componentes reutilizables tipados, integración con Formspree para formularios, sistema de versionado automático desde CHANGELOG.md, y documentación completa en español. El diseño prioriza el uso de HTML nativo y JavaScript vanilla para maximizar el rendimiento y seguir las mejores prácticas de Astro.

## Architecture

### Hexagonal Architecture Implementation

La arquitectura hexagonal se implementará con la siguiente estructura de capas:

```
src/
├── domain/           # Entidades de negocio y reglas de dominio
│   ├── entities/     # Modelos de datos puros
│   ├── interfaces/   # Contratos/puertos
│   └── services/     # Lógica de dominio
├── application/      # Casos de uso y orquestación
│   ├── usecases/     # Casos de uso específicos
│   └── dto/          # Data Transfer Objects
├── infrastructure/   # Adaptadores externos
│   ├── api/          # Clientes API (Formspree, etc.)
│   ├── config/       # Configuraciones
│   └── utils/        # Utilidades técnicas
└── ui/               # Capa de presentación
    ├── components/   # Componentes Astro/React
    ├── layouts/      # Layouts de página
    ├── pages/        # Páginas Astro
    └── styles/       # Estilos globales
```

### Technology Stack

- **Framework**: Astro 4.x (SSG/SSR híbrido) - siguiendo documentación oficial
- **Language**: TypeScript 5.x como lenguaje principal
- **Styling**: TailwindCSS 3.x - sin CSS inline salvo utilidades mínimas
- **Forms**: Formspree integration con fetch API nativo
- **Testing**: Vitest para testing unitario e integración
- **Linting**: ESLint + Prettier configurados para TypeScript/Astro
- **Package Manager**: pnpm (obligatorio para todo el proyecto)
- **Validation**: Zod para validación de configuraciones
- **Performance**: Lighthouse CI para auditorías automáticas

## Components and Interfaces

### Core Components Library

**Rationale**: Todos los componentes se implementan como componentes Astro (.astro) usando HTML nativo para maximizar el rendimiento y seguir las mejores prácticas del framework. Se evitan archivos de barril (index.ts) para mantener imports explícitos y mejorar tree-shaking.

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  text: string;
  href?: string;
  className?: string;
}
```

#### Input Component
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'url';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  className?: string;
  // Validación HTML5 nativa + JavaScript para UX mejorada
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    customMessage?: string;
  };
}
```

#### Card Component

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: {
    src: string;
    alt: string;
    loading?: 'lazy' | 'eager';
  };
  variant: 'default' | 'featured' | 'minimal';
  className?: string;
  // Slots de Astro para contenido flexible
  slots?: {
    header?: boolean;
    content?: boolean;
    footer?: boolean;
  };
}
```

#### Layout Components

```typescript
interface LayoutProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  // Configuración SEO dinámica desde configuración central
  seoConfig?: Partial<SEOConfig>;
}

interface HeaderProps {
  navigation: NavigationItem[];
  logo: {
    src: string;
    alt: string;
  };
  // Menú responsive con Tailwind
  mobileMenuEnabled?: boolean;
}

interface FooterProps {
  // Versión extraída automáticamente de CHANGELOG.md
  version?: string;
  links: FooterLink[];
  social: SocialLink[];
  showVersion?: boolean; // Control de visibilidad discreta
}
```

### SEO Configuration Interface

**Rationale**: Configuración centralizada en `site.config.ts` con validación Zod para garantizar consistencia y type safety. Soporte completo para metadatos básicos y avanzados, OpenGraph, Twitter Cards, y structured data.

```typescript
interface SEOConfig {
  site: {
    title: string;
    description: string;
    url: string;
    author: string;
    keywords: string[];
    language: string; // Para i18n futuro
  };
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'website';
    locale: string;
  };
  twitter: {
    card: 'summary_large_image';
    site: string;
    creator: string;
    image: string;
  };
  // Structured data para rich snippets
  structuredData?: {
    '@type': 'Organization' | 'WebSite';
    name: string;
    url: string;
    logo?: string;
  };
}
```

### Version Management System

**Rationale**: Sistema automático de versionado que lee desde CHANGELOG.md para mantener consistencia entre documentación y UI. El footer muestra la versión de forma discreta sin interferir con el diseño.

```typescript
interface VersionConfig {
  changelogPath: string;
  displayFormat: 'full' | 'short' | 'semantic';
  showInFooter: boolean;
  fallbackVersion: string;
}

interface ChangelogParser {
  parseVersion(): Promise<string>;
  parseLatestChanges(): Promise<ChangelogEntry[]>;
  validateFormat(): boolean;
}
```

## Data Models

### Configuration Models

#### Site Configuration

**Rationale**: Configuración central tipada con Zod para validación en tiempo de build. Separación clara entre configuración pública y variables de entorno sensibles.

```typescript
interface SiteConfig {
  metadata: SEOConfig;
  navigation: NavigationItem[];
  footer: FooterConfig;
  forms: FormConfig;
  version: VersionConfig;
  performance: PerformanceConfig;
}

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string; // Accesibilidad
}

interface FooterConfig {
  copyright: string;
  links: FooterSection[];
  social: SocialLink[];
  showVersion: boolean;
}

interface FormConfig {
  formspree: {
    endpoint: string; // Desde variable de entorno
    successMessage: string;
    errorMessage: string;
    enableValidation: boolean;
  };
}

interface PerformanceConfig {
  enableImageOptimization: boolean;
  enableLazyLoading: boolean;
  criticalCSSInline: boolean;
  preloadFonts: string[];
}
```

#### Version Management
```typescript
interface VersionInfo {
  version: string;
  date: string;
  changes: string[];
}

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
}
```

### Form Models

```typescript
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormValidation {
  field: keyof ContactForm;
  rules: ValidationRule[];
}

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength';
  value?: number;
  message: string;
}
```

## Error Handling

### Error Types and Handling Strategy

```typescript
// Domain Errors
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

// Infrastructure Errors
class FormSubmissionError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'FormSubmissionError';
  }
}
```

### Error Boundaries and Fallbacks

- **Form Errors**: Mostrar mensajes de error específicos por campo
- **Configuration Errors**: Fallback a valores por defecto con logging
- **Build Errors**: Validación en tiempo de build para configuraciones críticas
- **Runtime Errors**: Graceful degradation con mensajes user-friendly

## Testing Strategy

### Testing Pyramid

#### Unit Tests
- **Domain Logic**: Validación de entidades y servicios de dominio
- **Components**: Testing de props, rendering y comportamiento
- **Utilities**: Funciones puras y helpers
- **Configuration**: Validación de configuraciones

#### Integration Tests
- **Form Submission**: Testing completo del flujo de formularios
- **SEO Generation**: Verificación de metadatos generados
- **Component Integration**: Testing de componentes compuestos

#### E2E Tests
- **User Journeys**: Navegación completa del sitio
- **Form Workflows**: Envío exitoso y manejo de errores
- **SEO Validation**: Verificación de metadatos en páginas renderizadas

### Testing Tools and Configuration

```typescript
// Vitest configuration for Astro
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  plugins: [
    astro(),
  ],
});
```

### Performance Testing

- **Lighthouse CI**: Automated performance auditing
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Analysis**: Size optimization tracking
- **Image Optimization**: Automated testing of image formats and sizes

## Implementation Details

### File Structure

```
project-root/
├── .astro/                 # Astro cache
├── .kiro/                  # Kiro configuration
├── docs/                   # Documentation
│   ├── architecture.md
│   ├── contributing.md
│   └── deployment.md
├── public/                 # Static assets
│   ├── images/
│   ├── icons/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── ui/
├── CHANGELOG.md
├── README.md
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── eslint.config.js
└── package.json
```

### Configuration Management

- **Central Config**: `src/infrastructure/config/site.config.ts`
- **Environment Variables**: `.env` para configuraciones sensibles
- **Type Safety**: Todas las configuraciones tipadas con Zod
- **Validation**: Validación en tiempo de build

### SEO Implementation

- **Meta Tags**: Generación automática basada en configuración
- **Structured Data**: JSON-LD para rich snippets
- **Sitemap**: Generación automática con `@astrojs/sitemap`
- **Robots.txt**: Configuración estática optimizada

### Performance Optimizations

- **Image Optimization**: `@astrojs/image` para optimización automática
- **Code Splitting**: Lazy loading de componentes no críticos
- **CSS Purging**: TailwindCSS purge automático
- **Bundle Optimization**: Vite optimizations habilitadas