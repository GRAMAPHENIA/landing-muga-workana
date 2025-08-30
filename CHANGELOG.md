# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-08-29

### Added

- **Modelos de dominio completos**: Interfaces TypeScript para SEO, navegación, componentes y formularios
- **Configuración central del sitio**: Archivo `site.config.ts` con validación Zod
- **Sistema de validación**: Configuración de reglas de validación para formularios con patrones predefinidos
- **Variables de entorno**: Configuración segura para datos sensibles (Formspree, URLs, redes sociales)
- **Entidades de dominio**: `FormValidator` y `SEOManager` con lógica de negocio
- **Interfaces de componentes**: Props tipadas para Button, Input, Card, Layout, Header y Footer
- **Configuración SEO**: Metadatos completos con OpenGraph, Twitter Cards y structured data
- **Arquitectura hexagonal**: Separación clara entre dominio, aplicación e infraestructura

### Changed

- Actualizado `.env.example` con variables de entorno completas
- Corregido `vitest.config.ts` para usar `reporters` en lugar de `reporter`

## [0.0.1] - 2025-08-29

### Added

- Configuración inicial del proyecto Astro con TypeScript
- Integración de TailwindCSS
- Estructura de carpetas para arquitectura hexagonal
- Configuración básica de scripts de desarrollo
