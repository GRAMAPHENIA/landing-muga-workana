# 🚀 Landing Page Empresarial - TechSolutions Pro

Una landing page profesional y completa construida con **Astro**, **TypeScript** y **TailwindCSS**. Diseño moderno, código optimizado y totalmente responsive.

## ✨ Características

- **🎯 Landing Page Completa**: Una sola página con todas las secciones necesarias
- **⚡ Astro 5.x**: Framework moderno y ultra-rápido
- **🎨 TailwindCSS**: Estilos utilitarios y diseño responsive
- **📱 100% Responsive**: Optimizado para móviles, tablets y desktop
- **🔍 SEO Optimizado**: Metadatos, OpenGraph, Twitter Cards y sitemap
- **📧 Formulario Funcional**: Integración con Formspree
- **🚀 Performance**: Carga ultra-rápida y Core Web Vitals optimizados

## 📋 Secciones Incluidas

1. **Header** - Navegación fija con menú móvil
2. **Hero** - Propuesta de valor principal con estadísticas
3. **Servicios** - Grid de servicios con iconos y descripciones
4. **Sobre Nosotros** - Historia, misión y valores de la empresa
5. **Testimonios** - Reseñas de clientes con fotos y valoraciones
6. **Contacto** - Formulario completo + información de contacto
7. **CTA Final** - Llamada a la acción con fondo oscuro
8. **Footer** - Enlaces, redes sociales y información legal

## 🏗️ Estructura del Proyecto

```text
src/
├── components/          # Componentes reutilizables
│   ├── Button.astro     # Botón con variantes
│   ├── Card.astro       # Tarjeta base
│   ├── ContactForm.astro # Formulario de contacto
│   ├── CTA.astro        # Llamada a la acción
│   ├── Footer.astro     # Pie de página
│   ├── Header.astro     # Cabecera con navegación
│   ├── Hero.astro       # Sección principal
│   ├── Services.astro   # Grid de servicios
│   └── Testimonials.astro # Testimonios de clientes
├── config/
│   └── site.ts          # Configuración del sitio
├── layouts/
│   └── BaseLayout.astro # Layout base con SEO
├── pages/
│   └── index.astro      # Página principal (landing)
└── styles/
    └── global.css       # Estilos globales y utilidades
```

## 🚀 Inicio Rápido

1. **Instalar dependencias**:

   ```bash
   pnpm install
   ```

2. **Configurar Formspree** (opcional):
   - Edita `src/config/site.ts`
   - Cambia el endpoint de Formspree por el tuyo

3. **Personalizar contenido**:
   - Edita `src/config/site.ts` con tu información
   - Personaliza colores en `src/styles/global.css`

4. **Iniciar desarrollo**:

   ```bash
   pnpm dev
   ```

5. **Construir para producción**:
   ```bash
   pnpm build
   ```

## 🎨 Personalización

### Cambiar Información de la Empresa

Edita `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Tu Empresa',
  title: 'Tu Título SEO',
  description: 'Tu descripción',
  email: 'tu@email.com',
  phone: '+34 600 000 000',
  // ... más configuraciones
};
```

### Modificar Servicios

En `src/config/site.ts`, actualiza el array `services`:

```typescript
services: [
  {
    title: 'Tu Servicio',
    description: 'Descripción del servicio',
    icon: '🎯',
  },
  // ... más servicios
];
```

### Cambiar Colores y Estilos

Edita `src/styles/global.css` para personalizar:

- Colores de botones
- Tipografías
- Espaciados
- Efectos hover

## 📧 Configuración del Formulario

1. Crea una cuenta en [Formspree](https://formspree.io/)
2. Crea un nuevo formulario
3. Copia el endpoint y pégalo en `src/config/site.ts`:

```typescript
formspree: {
  contactForm: 'https://formspree.io/f/tu-endpoint';
}
```

## 🌐 Despliegue

### Netlify

1. Conecta tu repositorio
2. Build command: `pnpm build`
3. Publish directory: `dist`

### Vercel

1. Importa tu proyecto
2. Framework preset: `Astro`
3. Deploy

### Otros Proveedores

El proyecto genera archivos estáticos en `/dist` que puedes subir a cualquier hosting.

## 🛠️ Comandos Disponibles

| Comando           | Descripción            |
| ----------------- | ---------------------- |
| `pnpm dev`        | Servidor de desarrollo |
| `pnpm build`      | Build de producción    |
| `pnpm preview`    | Preview del build      |
| `pnpm lint`       | Linting con ESLint     |
| `pnpm format`     | Formateo con Prettier  |
| `pnpm type-check` | Verificación de tipos  |

## 📱 Responsive Design

- **Mobile First**: Diseñado primero para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegación Móvil**: Menú hamburguesa funcional
- **Imágenes Optimizadas**: Lazy loading nativo

## 🔍 SEO Incluido

- ✅ Meta tags optimizados
- ✅ Open Graph para redes sociales
- ✅ Twitter Cards
- ✅ Sitemap automático
- ✅ Robots.txt
- ✅ URLs canónicas
- ✅ Structured data ready

## 📄 Licencia

MIT License - Úsalo libremente para proyectos personales y comerciales.

---

**¿Necesitas ayuda?** Abre un issue o contacta con nosotros.
