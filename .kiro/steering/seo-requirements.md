---
inclusion: fileMatch
fileMatchPattern: "*.astro"
---

# Requisitos SEO para Componentes Astro

## Metadatos Obligatorios en Layouts

Cada layout debe incluir:

```typescript
interface SEOProps {
  title: string; // Título específico de la página
  description: string; // Descripción meta (150-160 caracteres)
  keywords?: string[]; // Keywords relevantes
  ogImage?: string; // Imagen OpenGraph específica
  canonical?: string; // URL canónica si es diferente
}
```

## Estructura HTML Semántica

- Usar elementos semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- Jerarquía de headings correcta (H1 único por página, H2-H6 en orden)
- Alt text descriptivo en todas las imágenes
- Links con aria-label cuando sea necesario

## OpenGraph y Twitter Cards

Configuración automática desde `site.config.ts`:

- `og:title`, `og:description`, `og:image`, `og:url`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

## Structured Data

Implementar JSON-LD para:

- Organization (datos de la empresa)
- WebSite (información del sitio)
- BreadcrumbList (navegación)

## Performance SEO

- Lazy loading para imágenes no críticas
- Preload para recursos críticos
- Optimización de Core Web Vitals
- Minificación automática de CSS/JS
