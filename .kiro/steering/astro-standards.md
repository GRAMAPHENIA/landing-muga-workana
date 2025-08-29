---
inclusion: always
---

# Estándares de Desarrollo Astro

## Stack Tecnológico Obligatorio

- **Framework**: Astro 4.x únicamente
- **Lenguaje**: TypeScript para todo el código
- **Estilos**: TailwindCSS únicamente, sin CSS inline salvo utilidades mínimas
- **Formularios**: Integración con Formspree usando fetch API nativo
- **Testing**: Vitest para pruebas unitarias e integración

## Reglas de Código

### Componentes Astro

- Usar únicamente componentes `.astro` con HTML nativo
- NO usar React, Vue u otros frameworks de UI
- Props siempre tipadas con TypeScript
- Usar slots de Astro para contenido dinámico
- NO crear archivos de barril (index.ts reexportando)

### Arquitectura Hexagonal

```
src/
├── domain/           # Entidades y reglas de negocio
├── application/      # Casos de uso
├── infrastructure/   # Adaptadores externos
└── ui/               # Componentes y páginas Astro
```

### Validación y Formularios

- Validación HTML5 nativa + JavaScript vanilla
- Manejo de estados con JavaScript puro (no librerías)
- Fetch API para comunicación con Formspree
- TypeScript para tipado de formularios

### SEO y Performance

- Metadatos configurables desde archivo central
- Lazy loading nativo HTML para imágenes
- Optimización automática de Astro para assets
- Core Web Vitals como métrica obligatoria

## Comandos Estándar (PNPM Obligatorio)

```bash
pnpm create astro@latest  # Crear nuevo proyecto Astro
pnpm install             # Instalar dependencias
pnpm dev                 # Desarrollo
pnpm build               # Build de producción
pnpm preview             # Preview del build
pnpm test                # Ejecutar tests
pnpm lint                # Linting con ESLint
pnpm format              # Formateo con Prettier
```

**IMPORTANTE**: Usar ÚNICAMENTE pnpm como package manager en todo el proyecto.

## Estructura de Archivos

- Configuración central en `src/infrastructure/config/`
- Componentes reutilizables en `src/ui/components/`
- Layouts en `src/ui/layouts/`
- Páginas en `src/ui/pages/`
- Documentación en `/docs`
