---
inclusion: always
---

# Estándar PNPM Obligatorio

## Package Manager Único

**USAR ÚNICAMENTE PNPM** en todo el proyecto. No usar npm ni yarn.

## Comandos de Instalación

```bash
# Crear proyecto Astro
pnpm create astro@latest

# Instalar dependencias
pnpm install

# Añadir dependencias
pnpm add <package>
pnpm add -D <dev-package>

# Remover dependencias
pnpm remove <package>
```

## Scripts de Desarrollo

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
pnpm test         # Ejecutar tests
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm type-check   # TypeScript check
```

## Configuración de Proyecto

- Usar `pnpm-workspace.yaml` si hay múltiples packages
- Configurar `.npmrc` con configuraciones específicas de pnpm
- Lockfile: `pnpm-lock.yaml` (incluir en git)

## Razones para PNPM

1. **Performance**: Más rápido que npm/yarn
2. **Espacio**: Deduplicación eficiente de dependencias
3. **Seguridad**: Mejor aislamiento de dependencias
4. **Compatibilidad**: Totalmente compatible con Astro y TypeScript

**REGLA**: Si ves comandos npm o yarn en documentación, siempre convertir a pnpm.