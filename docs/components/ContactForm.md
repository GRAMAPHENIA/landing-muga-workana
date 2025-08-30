# Componente ContactForm

El componente `ContactForm` es un formulario de contacto completo integrado con Formspree que incluye validación client-side, manejo de estados y múltiples variantes de diseño.

## Características Principales

- ✅ **Validación HTML5 + JavaScript**: Validación en tiempo real con mensajes personalizados
- ✅ **Integración Formspree**: Envío directo usando fetch API nativo
- ✅ **Manejo de Estados**: Loading, success, error con UI feedback
- ✅ **Campos Configurables**: Campos opcionales (teléfono, empresa)
- ✅ **Múltiples Variantes**: Default, compact, inline
- ✅ **Accesibilidad**: ARIA labels, roles y live regions
- ✅ **TypeScript**: Props completamente tipadas
- ✅ **Responsive**: Diseño adaptable con TailwindCSS

## Instalación y Configuración

### 1. Variables de Entorno

Configura tu endpoint de Formspree en `.env`:

```bash
# Formspree configuration
FORMSPREE_ENDPOINT=https://formspree.io/f/tu-form-id
```

### 2. Configuración Central

El componente usa la configuración central de `site.config.ts`:

```typescript
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

## Uso Básico

### Formulario Estándar

```astro
---
import ContactForm from '../components/ContactForm.astro';
---

<ContactForm />
```

### Formulario Personalizado

```astro
<ContactForm
  title="Contáctanos"
  subtitle="Envíanos tu consulta"
  showPhone={true}
  showCompany={true}
  submitButtonText="Enviar consulta"
  variant="compact"
  className="max-w-4xl mx-auto"
/>
```

## Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | `"Contáctanos"` | Título del formulario |
| `subtitle` | `string` | `"Envíanos un mensaje..."` | Subtítulo descriptivo |
| `className` | `string` | `""` | Clases CSS adicionales |
| `showPhone` | `boolean` | `false` | Mostrar campo de teléfono |
| `showCompany` | `boolean` | `false` | Mostrar campo de empresa |
| `submitButtonText` | `string` | `"Enviar mensaje"` | Texto del botón de envío |
| `variant` | `"default" \| "compact" \| "inline"` | `"default"` | Variante de diseño |

## Variantes de Diseño

### Default
Formulario estándar con campos en columna única y título/subtítulo incluidos.

```astro
<ContactForm variant="default" />
```

### Compact
Formulario optimizado para espacios reducidos con campos en grid responsive.

```astro
<ContactForm 
  variant="compact"
  showPhone={true}
  showCompany={true}
/>
```

### Inline
Formulario sin título/subtítulo, ideal para integrar en secciones existentes.

```astro
<ContactForm variant="inline" />
```

## Campos del Formulario

### Campos Obligatorios

- **Nombre**: Validación de longitud (2-50 caracteres)
- **Email**: Validación de formato con regex
- **Asunto**: Validación de longitud (5-100 caracteres)
- **Mensaje**: Validación de longitud (10-1000 caracteres)

### Campos Opcionales

- **Teléfono**: Validación de formato internacional (activar con `showPhone={true}`)
- **Empresa**: Campo de texto libre (activar con `showCompany={true}`)

## Validación

### Validación Client-Side

El componente incluye validación en tiempo real:

```javascript
// Ejemplo de reglas de validación
{
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  customMessage: "Por favor, introduce un email válido"
}
```

### Mensajes de Error

Los mensajes de error son configurables y se muestran en tiempo real:

- Campo requerido: "Este campo es requerido"
- Email inválido: "Por favor, introduce un email válido"
- Longitud mínima: "El campo debe tener al menos X caracteres"
- Longitud máxima: "El campo no puede exceder X caracteres"

## Estados del Formulario

### Estado de Carga

```javascript
// Durante el envío
{
  isSubmitting: true,
  isSuccess: false,
  isError: false
}
```

### Estado de Éxito

```javascript
// Envío exitoso
{
  isSubmitting: false,
  isSuccess: true,
  isError: false,
  successMessage: "¡Mensaje enviado correctamente!"
}
```

### Estado de Error

```javascript
// Error en el envío
{
  isSubmitting: false,
  isSuccess: false,
  isError: true,
  errorMessage: "Error al enviar el mensaje"
}
```

## Integración con Formspree

### Configuración de Formspree

1. Crea una cuenta en [Formspree.io](https://formspree.io/)
2. Crea un nuevo formulario
3. Copia el endpoint (formato: `https://formspree.io/f/tu-form-id`)
4. Configura la variable de entorno `FORMSPREE_ENDPOINT`

### Estructura de Datos Enviados

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "subject": "Consulta general",
  "message": "Este es el mensaje del usuario",
  "phone": "+34 600 000 000",
  "company": "Mi Empresa S.L."
}
```

### Manejo de Respuestas

El componente maneja automáticamente:

- ✅ Respuestas exitosas (200-299)
- ❌ Errores del servidor (400-599)
- ⏱️ Timeouts de red
- 🔌 Errores de conexión

## Accesibilidad

### ARIA Labels y Roles

```html
<!-- Estado del formulario -->
<div role="alert" aria-live="polite">
  <div class="status-message">¡Mensaje enviado!</div>
</div>

<!-- Campos con labels asociados -->
<label for="contact-form-name">Nombre completo</label>
<input id="contact-form-name" aria-describedby="name-error" />
<div id="name-error" class="field-error" role="alert"></div>
```

### Navegación por Teclado

- ✅ Orden lógico de tabulación
- ✅ Focus visible en todos los elementos
- ✅ Envío con Enter desde cualquier campo
- ✅ Escape para cancelar (si aplicable)

## Personalización de Estilos

### Clases CSS Principales

```css
.contact-form-container  /* Contenedor principal */
.contact-form           /* Formulario */
.form-status           /* Estado del formulario */
.status-message        /* Mensaje de estado */
.field-error          /* Errores de campo */
.submit-button        /* Botón de envío */
```

### Ejemplo de Personalización

```astro
<ContactForm 
  className="custom-form"
  variant="compact"
/>

<style>
  :global(.custom-form) {
    @apply bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl;
  }
  
  :global(.custom-form .submit-button) {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700;
  }
</style>
```

## Testing

### Tests Unitarios

El componente incluye tests completos:

```bash
pnpm test ContactForm.test.ts --run
```

### Tests Incluidos

- ✅ Validación de campos
- ✅ Envío de formularios
- ✅ Manejo de errores
- ✅ Estados del formulario
- ✅ Configuración
- ✅ Accesibilidad

## Troubleshooting

### Problemas Comunes

#### 1. Formulario no envía

**Causa**: Endpoint de Formspree no configurado
**Solución**: Verificar variable `FORMSPREE_ENDPOINT` en `.env`

#### 2. Validación no funciona

**Causa**: JavaScript deshabilitado o errores de sintaxis
**Solución**: Verificar consola del navegador y configuración

#### 3. Estilos no se aplican

**Causa**: TailwindCSS no configurado correctamente
**Solución**: Verificar `tailwind.config.mjs` y purge settings

#### 4. Timeout en envíos

**Causa**: Timeout muy bajo o problemas de red
**Solución**: Aumentar timeout en configuración

```typescript
forms: {
  formspree: {
    timeout: 15000, // 15 segundos
  }
}
```

## Ejemplos Avanzados

### Formulario con Validación Personalizada

```astro
---
// Extender validación con reglas custom
const customValidation = {
  phone: {
    pattern: "^\\+?[1-9]\\d{1,14}$",
    message: "Formato: +34 600 000 000"
  }
};
---

<ContactForm 
  showPhone={true}
  showCompany={true}
  variant="compact"
/>
```

### Integración con Analytics

```astro
<ContactForm />

<script>
  // Tracking de eventos de formulario
  document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', () => {
        // Google Analytics, etc.
        gtag('event', 'form_submit', {
          event_category: 'contact',
          event_label: 'contact_form'
        });
      });
    });
  });
</script>
```

## Roadmap

### Próximas Funcionalidades

- [ ] Soporte para archivos adjuntos
- [ ] Integración con otros servicios (EmailJS, Netlify Forms)
- [ ] Validación server-side opcional
- [ ] Temas de color predefinidos
- [ ] Modo offline con queue
- [ ] Captcha integration

---

## Soporte

Para reportar bugs o solicitar funcionalidades, crea un issue en el repositorio del proyecto.