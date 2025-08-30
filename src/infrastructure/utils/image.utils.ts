/**
 * Utilidades para optimización de imágenes
 * Requirement: 8.1 - Optimización automática de imágenes
 */

import type {
  ImageUtils,
  ImageMetadata,
  ImageOptimizationOptions,
  SupportedImageFormat,
  ResponsiveImageConfig,
} from '../../domain/interfaces/image.interface';

export class ImageUtilsImpl implements ImageUtils {
  /**
   * Genera srcset automáticamente basado en breakpoints
   */
  generateSrcset(
    src: string,
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): string {
    // Si la imagen es externa, no generar srcset
    if (src.startsWith('http') || src.startsWith('//')) {
      return '';
    }

    // Extraer extensión y nombre base
    const lastDotIndex = src.lastIndexOf('.');
    let baseName: string;
    let extension: string;

    if (lastDotIndex === -1) {
      // No hay extensión
      baseName = src;
      extension = 'jpg'; // Extensión por defecto
    } else {
      baseName = src.substring(0, lastDotIndex);
      extension = src.substring(lastDotIndex + 1);
    }

    return breakpoints
      .map(width => `${baseName}_${width}w.${extension} ${width}w`)
      .join(', ');
  }

  /**
   * Genera sizes responsivos basado en breakpoints
   */
  generateSizes(
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): string {
    const sizeRules = breakpoints.map((breakpoint, index) => {
      if (index === breakpoints.length - 1) {
        // Último breakpoint sin media query
        return `${breakpoint - 40}px`;
      }
      return `(max-width: ${breakpoint}px) ${breakpoint - 40}px`;
    });

    return sizeRules.join(', ');
  }

  /**
   * Optimiza imagen para web (simulado - en producción usaría sharp o similar)
   */
  async optimizeImage(
    src: string,
    options: Partial<ImageOptimizationOptions>
  ): Promise<ImageMetadata> {
    // En un entorno real, esto usaría sharp, imagemin, o la API de Astro
    // Por ahora, simulamos la optimización

    const format = this.getImageFormat(src);
    const dimensions = await this.getImageDimensions(src);

    return {
      src,
      width: dimensions.width,
      height: dimensions.height,
      format,
      size: 0, // En producción, calcularía el tamaño real
    };
  }

  /**
   * Genera un data URL blur para placeholder
   */
  async generateBlurDataURL(src: string): Promise<string> {
    // En un entorno real, esto generaría un blur real de la imagen
    // Por ahora, retornamos un placeholder genérico

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
    }

    // Crear un gradiente simple como placeholder
    const gradient = ctx.createLinearGradient(0, 0, 10, 10);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 10, 10);

    return canvas.toDataURL('image/jpeg', 0.1);
  }

  /**
   * Valida si un formato de imagen es soportado
   */
  isValidImageFormat(format: string): format is SupportedImageFormat {
    const supportedFormats: SupportedImageFormat[] = [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'avif',
      'gif',
      'svg',
    ];
    return supportedFormats.includes(
      format.toLowerCase() as SupportedImageFormat
    );
  }

  /**
   * Obtiene el formato de una imagen desde su URL
   */
  private getImageFormat(src: string): SupportedImageFormat {
    const extension = src.split('.').pop()?.toLowerCase() || 'jpg';
    return this.isValidImageFormat(extension)
      ? (extension as SupportedImageFormat)
      : 'jpg';
  }

  /**
   * Obtiene las dimensiones de una imagen (simulado)
   */
  private async getImageDimensions(
    src: string
  ): Promise<{ width: number; height: number }> {
    // En un entorno real, esto cargaría la imagen y obtendría sus dimensiones
    // Por ahora, retornamos dimensiones por defecto
    return { width: 800, height: 600 };
  }
}

// Instancia singleton de las utilidades
export const imageUtils = new ImageUtilsImpl();

/**
 * Funciones helper para uso directo
 */

/**
 * Genera un srcset optimizado para una imagen
 */
export function createSrcset(src: string, breakpoints?: number[]): string {
  return imageUtils.generateSrcset(src, breakpoints);
}

/**
 * Genera sizes responsivos
 */
export function createSizes(breakpoints?: number[]): string {
  return imageUtils.generateSizes(breakpoints);
}

/**
 * Verifica si una imagen necesita optimización
 */
export function needsOptimization(src: string): boolean {
  // No optimizar imágenes externas o SVGs
  if (src.startsWith('http') || src.startsWith('//') || src.endsWith('.svg')) {
    return false;
  }

  return true;
}

/**
 * Obtiene la configuración responsive por defecto
 */
export function getDefaultResponsiveConfig(): ResponsiveImageConfig {
  return {
    breakpoints: [320, 640, 768, 1024, 1280, 1920],
    defaultSizes:
      '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 768px) 728px, (max-width: 1024px) 984px, (max-width: 1280px) 1240px, 1880px',
    defaultQuality: 80,
    preferredFormat: 'webp',
    fallbackFormat: 'jpg',
  };
}

/**
 * Convierte una imagen a formato WebP (simulado)
 */
export function convertToWebP(src: string): string {
  if (src.endsWith('.webp') || src.startsWith('http')) {
    return src;
  }

  return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

/**
 * Genera un placeholder SVG para imágenes
 */
export function generateSVGPlaceholder(
  width: number,
  height: number,
  color: string = '#f3f4f6'
): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <path d="M${width / 2 - 10} ${height / 2 - 5}L${width / 2} ${height / 2 + 5}L${width / 2 + 10} ${height / 2 - 5}" stroke="#d1d5db" stroke-width="2" fill="none"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Calcula el aspect ratio de una imagen
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);

  return `${width / divisor}/${height / divisor}`;
}

/**
 * Verifica si el navegador soporta un formato de imagen
 */
export function supportsImageFormat(format: SupportedImageFormat): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    const dataURL = canvas.toDataURL(`image/${format}`);
    return dataURL.indexOf(`data:image/${format}`) === 0;
  } catch {
    return false;
  }
}
