# Configuración de Testing

Este directorio contiene la configuración y utilidades para testing del proyecto.

## Estructura

- `setup.ts` - Configuración global para todos los tests
- `utils.ts` - Utilidades helper para testing
- `example.test.ts` - Ejemplo de tests básicos
- `README.md` - Esta documentación

## Comandos de Testing

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests una sola vez
pnpm test:run

# Ejecutar tests con coverage
pnpm test:coverage

# Abrir UI de Vitest
pnpm vitest --ui
```

## Configuración

### Entorno

- **Framework**: Vitest 3.x
- **Environment**: happy-dom (más rápido que jsdom)
- **Globals**: Habilitados (describe, it, expect disponibles sin imports)

### Coverage

- **Provider**: v8
- **Thresholds**: 80% en todas las métricas
- **Reportes**: text, json, html

### Utilidades Disponibles

#### mockFetch

```typescript
const fetch = mockFetch({ success: true });
```

#### mockLocalStorage

```typescript
const localStorage = mockLocalStorage();
```

#### createMockEvent

```typescript
const event = createMockEvent('click');
```

#### flushPromises

```typescript
await flushPromises(); // Espera a que se resuelvan todas las promesas
```

#### createMockElement

```typescript
const button = createMockElement('button', { type: 'submit' });
```

## Escribir Tests

### Para Componentes Astro

```typescript
import { describe, it, expect } from 'vitest';

describe('MiComponente', () => {
  it('debería renderizar correctamente', () => {
    // Test logic aquí
  });
});
```

### Para Servicios de Dominio

```typescript
import { describe, it, expect } from 'vitest';
import { MiServicio } from '@/domain/services/MiServicio';

describe('MiServicio', () => {
  it('debería procesar datos correctamente', () => {
    const servicio = new MiServicio();
    const resultado = servicio.procesar('datos');
    expect(resultado).toBe('esperado');
  });
});
```

### Para Formularios

```typescript
import { describe, it, expect } from 'vitest';
import { mockFetch } from '@/test/utils';

describe('ContactForm', () => {
  it('debería enviar formulario correctamente', async () => {
    global.fetch = mockFetch({ success: true });

    // Test logic aquí

    expect(fetch).toHaveBeenCalledWith(/* parámetros esperados */);
  });
});
```

## Mocks Globales

Los siguientes mocks están disponibles automáticamente:

- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`
- `console.error` y `console.warn` (silenciados en tests)

## Configuración TypeScript

Los tipos de Vitest están incluidos globalmente en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```
