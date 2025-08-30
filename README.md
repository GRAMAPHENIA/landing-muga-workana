# Landing Page Profesional con Astro

Una landing page profesional construida con Astro, TypeScript y TailwindCSS siguiendo arquitectura hexagonal y las mejores prácticas de desarrollo.

## 🚀 Características

- **Framework**: Astro 4.x con TypeScript
- **Estilos**: TailwindCSS con configuración personalizada
- **Arquitectura**: Hexagonal (Clean Architecture)
- **SEO**: Configuración completa con metadatos, OpenGraph, Twitter Cards
- **Formularios**: Integración con Formspree
- **Versionado**: Automático desde CHANGELOG.md
- **Testing**: Vitest para pruebas unitarias e integración
- **Calidad**: ESLint + Prettier configurados

## 📁 Estructura del Proyecto

```text
/
├── docs/                    # Documentación técnica
├── public/                  # Assets estáticos
├── src/
│   ├── domain/             # Entidades y reglas de negocio
│   │   ├── entities/       # Modelos de datos
│   │   ├── interfaces/     # Contratos/puertos
│   │   └── services/       # Lógica de dominio
│   ├── application/        # Casos de uso
│   │   ├── usecases/       # Casos de uso específicos
│   │   └── dto/            # Data Transfer Objects
│   ├── infrastructure/     # Adaptadores externos
│   │   ├── api/            # Clientes API (Formspree, etc.)
│   │   ├── config/         # Configuraciones
│   │   └── utils/          # Utilidades técnicas
│   └── ui/                 # Capa de presentación
│       ├── components/     # Componentes Astro
│       ├── layouts/        # Layouts de página
│       ├── pages/          # Páginas Astro
│       └── styles/         # Estilos globales
├── CHANGELOG.md            # Historial de cambios
└── package.json
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto usando **pnpm**:

| Comando           | Acción                                               |
| :---------------- | :--------------------------------------------------- |
| `pnpm install`    | Instala las dependencias                             |
| `pnpm dev`        | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build`      | Construye el sitio para producción en `./dist/`      |
| `pnpm preview`    | Previsualiza la construcción localmente              |
| `pnpm test`       | Ejecuta las pruebas con Vitest                       |
| `pnpm lint`       | Ejecuta ESLint para revisar el código                |
| `pnpm format`     | Formatea el código con Prettier                      |
| `pnpm type-check` | Verifica los tipos de TypeScript                     |

## 🛠️ Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

## 📚 Documentación

- [Arquitectura](./docs/architecture.md) - Explicación de la arquitectura hexagonal
- [Componentes](./docs/components.md) - Documentación de componentes reutilizables
- [Contribución](./docs/contributing.md) - Guía para contribuir al proyecto
- [Despliegue](./docs/deployment.md) - Instrucciones de despliegue

## 🎯 Próximos Pasos

1. Configurar variables de entorno para Formspree
2. Personalizar la configuración SEO en `src/infrastructure/config/site.config.ts`
3. Añadir contenido a las páginas principales
4. Configurar el dominio en `astro.config.mjs`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
