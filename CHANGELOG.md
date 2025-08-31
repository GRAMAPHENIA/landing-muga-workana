# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-08-31

### Cambios

- **Arquitectura Modular**: Actualizada la documentación y estructura del proyecto para reflejar arquitectura modular.
- **Limpieza de Archivos**: Eliminados archivos y configuraciones en desuso, incluyendo documentación de Kiro.
- **Documentación Minimalista**: README simplificado y documentación técnica reducida.
- **Actualización de `.gitignore`**: Añadida carpeta `.kiro/` para ignorar en control de versiones.

## [1.1.0] - 2024-08-30

### Mejorado

- **Colores de Placeholders**: Cambiados todos los fondos de placeholders a neutral-400 para mejor consistencia visual
- **Avatares en Testimonios**: Añadidas iniciales en los avatares de testimonios
- **Iconos de Contacto**: Mejorados los iconos de contacto con mejor contraste
- **Logos de Empresas**: Actualizados placeholders de logos con colores neutral
- **Navegación**: Corregido scroll suave para botón "Ver trabajos"
- **Código**: Eliminado uso de pageYOffset deprecado, reemplazado por scrollY
- **Linting**: Limpieza de importaciones no utilizadas

### Técnico

- **Compatibilidad**: Uso de APIs modernas del navegador
- **Performance**: Optimización de código JavaScript
- **Mantenibilidad**: Código más limpio y consistente

## [1.0.0] - 2024-08-30

### Añadido

- **Landing Page Completa**: Implementación inicial de landing page empresarial moderna
- **Hero Section**: Sección principal con imagen central, credibilidad y estadísticas
- **Componente Features**: 3 bloques de beneficios con iconos y animaciones hover
- **Componente Services**: Grid de servicios con descripciones y precios orientativos
- **Componente Gallery**: Galería minimalista de proyectos con hover sutil
- **Componente Testimonials**: Tarjetas de testimonios con avatares placeholder grises
- **Formulario de Contacto**: Formulario completo integrado con Formspree
- **CTA Final**: Llamada a la acción con mensaje fuerte y botones
- **Footer Simple**: Enlaces básicos y redes sociales

### Técnico

- **Astro 5.x**: Framework moderno con TypeScript
- **TailwindCSS**: Sistema de diseño con paleta reducida (2-3 colores)
- **SEO Completo**: Meta tags, Open Graph, Twitter Cards optimizados
- **Responsive Design**: Diseño mobile-first completamente responsive
- **Animaciones Sutiles**: Efectos hover y fade-in con CSS y JavaScript
- **Performance**: Optimización de imágenes y carga estática
- **Navegación por Anclas**: Scroll suave entre secciones
- **Clean Code**: Componentes modulares siguiendo principios SOLID

### Diseño

- **Paleta Minimalista**: Negro, blanco y grises como colores principales
- **Tipografía Moderna**: Inter como fuente principal sans-serif
- **Espacios en Blanco**: Uso generoso de whitespace para claridad
- **Placeholders Grises**: Imágenes temporales en color gris para logos y avatares
- **Bordes Redondeados**: Diseño moderno con border-radius consistente

### Estructura

- **Arquitectura Simplificada**: Sin over-engineering, estructura clara y mantenible
- **Componentes Reutilizables**: Button, Card, ContactForm, etc.
- **Configuración Central**: `src/config/site.ts` para toda la información del sitio
- **Estilos Globales**: Sistema de utilidades CSS personalizadas
- **Documentación**: README completo en español con instrucciones

### SEO y Performance

- **Core Web Vitals**: Optimizado para métricas de rendimiento
- **Sitemap Automático**: Generación automática de sitemap.xml
- **Robots.txt**: Configuración para crawlers de búsqueda
- **Meta Tags**: Títulos y descripciones optimizadas
- **Structured Data**: Preparado para datos estructurados JSON-LD

### Próximas Mejoras

- [ ] Integración con CMS para contenido dinámico
- [ ] Modo oscuro opcional
- [ ] Más animaciones y microinteracciones
- [ ] Blog integrado
- [ ] Panel de administración
- [ ] Métricas y analytics avanzados
