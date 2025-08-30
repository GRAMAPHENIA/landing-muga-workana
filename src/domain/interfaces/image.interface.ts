/**
 * Interfaces para el componente Image optimizado
 * Requirement: 8.1 - Optimización automática de imágenes
 */

export interface ImageProps {
  /** URL de la imagen */
  src: string;

  /** Texto alternativo para accesibilidad (requerido) */
  alt: string;

  /** Ancho de la imagen en píxeles */
  width?: number;

  /** Alto de la imagen en píxeles */
  height?: number;

  /** Estrategia de carga: lazy (por defecto) o eager */
  loading?: 'lazy' | 'eager';

  /** Estrategia de decodificación */
  decoding?: 'async' | 'sync' | 'auto';

  /** Atributo sizes para responsive images */
  sizes?: string;

  /** Atributo srcset personalizado */
  srcset?: string;

  /** Clases CSS adicionales */
  className?: string;

  /** Indica si la imagen es de alta prioridad (LCP) */
  priority?: boolean;

  /** Calidad de compresión (1-100) */
  quality?: number;

  /** Formato de imagen preferido */
  format?: 'webp' | 'avif' | 'jpg' | 'png';

  /** Formato de fallback para navegadores no compatibles */
  fallbackFormat?: 'jpg' | 'png';

  /** Aspect ratio de la imagen (ej: "16/9", "4/3") */
  aspectRatio?: string;

  /** Comportamiento de object-fit */
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

  /** Tipo de placeholder mientras carga */
  placeholder?: 'blur' | 'empty';

  /** Data URL para placeholder blur */
  blurDataURL?: string;
}

export interface ResponsiveImageConfig {
  /** Anchos de imagen para generar srcset */
  breakpoints: number[];

  /** Sizes por defecto */
  defaultSizes: string;

  /** Calidad por defecto */
  defaultQuality: number;

  /** Formato preferido */
  preferredFormat: 'webp' | 'avif';

  /** Formato de fallback */
  fallbackFormat: 'jpg' | 'png';
}

export interface ImageOptimizationOptions {
  /** Habilitar optimización automática */
  enabled: boolean;

  /** Configuración responsive */
  responsive: ResponsiveImageConfig;

  /** Habilitar lazy loading por defecto */
  lazyLoading: boolean;

  /** Habilitar placeholders blur */
  blurPlaceholders: boolean;

  /** Directorio de imágenes optimizadas */
  outputDir: string;
}

// Configuración por defecto para optimización de imágenes
export const defaultImageConfig: ImageOptimizationOptions = {
  enabled: true,
  responsive: {
    breakpoints: [320, 640, 768, 1024, 1280, 1920],
    defaultSizes:
      '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 768px) 728px, (max-width: 1024px) 984px, (max-width: 1280px) 1240px, 1880px',
    defaultQuality: 80,
    preferredFormat: 'webp',
    fallbackFormat: 'jpg',
  },
  lazyLoading: true,
  blurPlaceholders: true,
  outputDir: '/images/optimized',
};

// Tipos para validación de formatos de imagen
export type SupportedImageFormat =
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'avif'
  | 'gif'
  | 'svg';

export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: SupportedImageFormat;
  size: number;
}

// Utilidades para trabajar con imágenes
export interface ImageUtils {
  /** Generar srcset automáticamente */
  generateSrcset(src: string, breakpoints: number[]): string;

  /** Generar sizes responsivos */
  generateSizes(breakpoints: number[]): string;

  /** Optimizar imagen para web */
  optimizeImage(
    src: string,
    options: Partial<ImageOptimizationOptions>
  ): Promise<ImageMetadata>;

  /** Generar placeholder blur */
  generateBlurDataURL(src: string): Promise<string>;

  /** Validar formato de imagen */
  isValidImageFormat(format: string): format is SupportedImageFormat;
}
