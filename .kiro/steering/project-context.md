---
inclusion: always
---

# Contexto del Proyecto Landing Page

## Objetivo Principal
Crear una Landing Page profesional con Astro que sirva como base reutilizable para proyectos comerciales.

## Características Clave
- **SEO Completo**: Metadatos, OpenGraph, Twitter Cards, sitemap, robots.txt
- **Componentes Reutilizables**: Button, Input, Card, Layout con props tipadas
- **Formularios Funcionales**: Integración con Formspree para contacto
- **Versionado Automático**: Footer que lee versión desde CHANGELOG.md
- **Documentación Completa**: README y /docs en español

## Configuración Central
El archivo `src/infrastructure/config/site.config.ts` contiene:
- Metadatos SEO (títulos, descripciones, keywords)
- Configuración OpenGraph y Twitter Cards
- Enlaces de navegación y footer
- Configuración de Formspree

## Componentes Principales
1. **BaseLayout.astro**: Layout base con SEO automático
2. **Header.astro**: Navegación responsive
3. **Footer.astro**: Con versión automática desde CHANGELOG.md
4. **Button.astro**: Variantes primary, secondary, outline, ghost
5. **Input.astro**: Con validación HTML5 + JavaScript
6. **Card.astro**: Para contenido modular
7. **ContactForm.astro**: Formulario integrado con Formspree

## Páginas Requeridas
- `index.astro`: Página principal con hero, features, testimonios, CTA
- `about.astro`: Información de la empresa
- `contact.astro`: Formulario de contacto dedicado

## Performance y SEO
- Optimización automática de imágenes con Astro
- Lazy loading nativo HTML
- Critical CSS inlining
- Sitemap y robots.txt automáticos
- Structured data (JSON-LD)

## Testing
- Tests unitarios para todos los componentes
- Tests de integración para formularios
- Tests E2E para user journeys principales
- Lighthouse CI para performance