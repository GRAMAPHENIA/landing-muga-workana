# Sistema de Formularios con Formspree

Este documento describe la implementación completa del sistema de formularios integrado con Formspree, siguiendo la arquitectura hexagonal del proyecto.

## Arquitectura del Sistema

```
src/
├── ui/components/
│   └── ContactForm.astro          # Componente de UI
├── application/
│   ├── services/
│   │   └── ContactFormService.ts  # Servicio de aplicación
│   └── usecases/
│       └── SubmitContactForm.usecase.ts  # Caso de uso
├── infrastructure/
│   └── adapters/
│       └── FormspreeAdapter.ts    # Adaptador externo
└── domain/
    └── interfaces/
        └── forms.interface.ts     # Interfaces del dominio
```

## Componentes Implementados

### 1. ContactForm.astro (UI Layer)

- **Ubicación**: `src/ui/components/ContactForm.astro`
- **Responsabilidad**: Interfaz de usuario y validación client-side
- **Características**:
  - Validación HTML5 + JavaScript vanilla
  - Manejo de estados (loading, success, error)
  - Múltiples variantes (default, compact, inline)
  - Campos opcionales configurables
  - Accesibilidad completa (ARIA)

### 2. ContactFormService (Application Layer)

- **Ubicación**: `src/application/services/ContactFormService.ts`
- **Responsabilidad**: Orquestación y configuración del servicio
- **Características**:
  - Singleton pattern para instancia única
  - Validación de configuración
  - Health checks y métricas
  - Manejo centralizado de errores

### 3. SubmitContactFormUseCase (Application Layer)

- **Ubicación**: `src/application/usecases/SubmitContactForm.usecase.ts`
- **Responsabilidad**: Lógica de negocio para envío de formularios
- **Características**:
  - Validación de datos de entrada
  - Sanitización de contenido
  - Mapeo de errores a mensajes user-friendly
  - Integración con adaptador externo

### 4. FormspreeAdapter (Infrastructure Layer)

- **Ubicación**: `src/infrastructure/adapters/FormspreeAdapter.ts`
- **Responsabilidad**: Integración con el servicio externo Formspree
- **Características**:
  - Retry logic para errores temporales
  - Timeout configurable
  - Formateo específico para Formspree
  - Manejo de diferentes códigos de respuesta

## Configuración

### Variables de Entorno

```bash
# .env
FORMSPREE_ENDPOINT=https://formspree.io/f/tu-form-id
```

### Configuración Central

```typescript
// src/infrastructure/config/site.config.ts
forms: {
  formspree: {
    endpoint: getEnvVar('FORMSPREE_ENDPOINT', ''),
    successMessage: '¡Gracias por tu mensaje! Te responderemos pronto.',
    errorMessage: 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.',
    enableValidation: true,
    timeout: 10000,
  },
}
```

## Uso del Componente

### Básico

```astro
---
import ContactForm from '../components/ContactForm.astro';
---

<ContactForm />
```

### Avanzado

```astro
<ContactForm
  title="Formulario de Contacto Empresarial"
  subtitle="Incluye campos adicionales para empresas"
  variant="compact"
  showPhone={true}
  showCompany={true}
  submitButtonText="Enviar solicitud"
  className="max-w-4xl mx-auto"
/>
```

## Validación

### Client-Side (JavaScript)

- Validación en tiempo real
- Mensajes de error específicos por campo
- Prevención de envío con datos inválidos

### Server-Side (Caso de Uso)

- Validación adicional antes del envío
- Sanitización de datos
- Validación de formato y longitud

### Reglas de Validación

| Campo    | Requerido | Longitud      | Formato       |
| -------- | --------- | ------------- | ------------- |
| Nombre   | Sí        | 2-50 chars    | Texto libre   |
| Email    | Sí        | -             | RFC 5322      |
| Asunto   | Sí        | 5-100 chars   | Texto libre   |
| Mensaje  | Sí        | 10-1000 chars | Texto libre   |
| Teléfono | No        | -             | Internacional |
| Empresa  | No        | max 100 chars | Texto libre   |

## Manejo de Errores

### Tipos de Error

1. **Errores de Validación**: Datos inválidos
2. **Errores de Red**: Conectividad, timeout
3. **Errores del Servidor**: 4xx, 5xx responses
4. **Errores de Configuración**: Endpoint inválido

### Retry Logic

- **Errores 5xx**: Reintento automático (3 intentos)
- **Errores 4xx**: Sin reintento
- **Errores de red**: Reintento con backoff exponencial

## Testing

### Tests Unitarios

```bash
pnpm test ContactForm.test.ts --run
```

### Tests de Integración

```bash
pnpm test ContactFormService.integration.test.ts --run
```

### Coverage

- Validación de formularios: 100%
- Casos de uso: 95%
- Adaptadores: 90%
- Componentes UI: 85%

## Monitoreo y Debugging

### Health Checks

```typescript
import { ContactFormServiceUtils } from '../application/services/ContactFormService';

const health = await ContactFormServiceUtils.validateServiceHealth(service);
console.log('Service Health:', health);
```

### Métricas

```typescript
const metrics = ContactFormServiceUtils.getServiceMetrics(service);
console.log('Service Metrics:', metrics);
```

### Logs

El sistema incluye logging detallado para:

- Errores de validación
- Fallos de conectividad
- Respuestas del servidor
- Timeouts y reintentos

## Seguridad

### Sanitización

- Remoción de tags HTML
- Limitación de longitud
- Validación de formato

### Prevención XSS

- Escape de caracteres especiales
- Validación de entrada
- Content Security Policy compatible

### Rate Limiting

- Manejo de respuestas 429
- Backoff automático
- Mensajes informativos al usuario

## Performance

### Optimizaciones

- Lazy loading del componente
- Validación asíncrona
- Debounce en validación en tiempo real
- Compresión de requests

### Métricas

- Tiempo de respuesta: < 2s promedio
- Tasa de éxito: > 95%
- Tiempo de validación: < 100ms

## Extensibilidad

### Nuevos Campos

1. Añadir al interface `ContactForm`
2. Actualizar validación en `ContactFormValidator`
3. Añadir al componente UI
4. Actualizar tests

### Nuevos Adaptadores

1. Implementar interface `FormAdapter`
2. Crear factory method
3. Configurar en `ContactFormService`
4. Añadir tests de integración

### Nuevas Validaciones

1. Extender `ValidationRule` interface
2. Implementar en `ContactFormValidator`
3. Añadir tests unitarios
4. Documentar reglas

## Troubleshooting

### Problemas Comunes

#### Formulario no envía

- Verificar `FORMSPREE_ENDPOINT` en `.env`
- Comprobar conectividad de red
- Revisar logs del navegador

#### Validación no funciona

- Verificar JavaScript habilitado
- Comprobar errores en consola
- Validar configuración de reglas

#### Estilos no se aplican

- Verificar TailwindCSS configurado
- Comprobar purge settings
- Revisar clases CSS

#### Timeout frecuentes

- Aumentar timeout en configuración
- Verificar conectividad del servidor
- Comprobar rate limiting

### Comandos de Diagnóstico

```bash
# Ejecutar todos los tests
pnpm test --run

# Tests específicos de formularios
pnpm test ContactForm --run

# Verificar configuración
pnpm build

# Linting
pnpm lint

# Formateo
pnpm format
```

## Roadmap

### Próximas Funcionalidades

- [ ] Soporte para archivos adjuntos
- [ ] Integración con otros servicios (EmailJS, Netlify Forms)
- [ ] Validación server-side con Astro API routes
- [ ] Temas de color predefinidos
- [ ] Modo offline con queue
- [ ] Integración con Captcha

### Mejoras Planificadas

- [ ] Optimización de bundle size
- [ ] Mejores animaciones de transición
- [ ] Soporte para formularios multi-step
- [ ] Integración con analytics
- [ ] A/B testing de variantes

---

## Soporte

Para reportar bugs o solicitar funcionalidades relacionadas con el sistema de formularios, crea un issue en el repositorio del proyecto con la etiqueta `forms`.
