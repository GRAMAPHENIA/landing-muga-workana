/**
 * Tests para las utilidades de imágenes
 * Requirement: 8.1 - Optimización automática de imágenes
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ImageUtilsImpl,
  createSrcset,
  createSizes,
  needsOptimization,
  getDefaultResponsiveConfig,
  convertToWebP,
  generateSVGPlaceholder,
  calculateAspectRatio,
} from '../../infrastructure/utils/image.utils';

describe('Image Utils', () => {
  let imageUtils: ImageUtilsImpl;

  beforeEach(() => {
    imageUtils = new ImageUtilsImpl();
  });

  describe('ImageUtilsImpl', () => {
    describe('generateSrcset', () => {
      it('should generate srcset for local images', () => {
        const srcset = imageUtils.generateSrcset('/images/hero.jpg');

        expect(srcset).toContain('/images/hero_320w.jpg 320w');
        expect(srcset).toContain('/images/hero_640w.jpg 640w');
        expect(srcset).toContain('/images/hero_1920w.jpg 1920w');
      });

      it('should return empty string for external images', () => {
        const srcset = imageUtils.generateSrcset(
          'https://example.com/image.jpg'
        );
        expect(srcset).toBe('');
      });

      it('should use custom breakpoints', () => {
        const srcset = imageUtils.generateSrcset(
          '/images/hero.jpg',
          [400, 800]
        );

        expect(srcset).toBe(
          '/images/hero_400w.jpg 400w, /images/hero_800w.jpg 800w'
        );
      });

      it('should handle images without extension', () => {
        const srcset = imageUtils.generateSrcset('/images/hero');
        expect(srcset).toContain('hero_320w');
      });
    });

    describe('generateSizes', () => {
      it('should generate responsive sizes', () => {
        const sizes = imageUtils.generateSizes();

        expect(sizes).toContain('(max-width: 320px) 280px');
        expect(sizes).toContain('(max-width: 640px) 600px');
        expect(sizes).toContain('1880px'); // Last size without media query
      });

      it('should use custom breakpoints', () => {
        const sizes = imageUtils.generateSizes([400, 800]);

        expect(sizes).toBe('(max-width: 400px) 360px, 760px');
      });
    });

    describe('optimizeImage', () => {
      it('should return image metadata', async () => {
        const metadata = await imageUtils.optimizeImage('/images/test.jpg', {});

        expect(metadata).toHaveProperty('src');
        expect(metadata).toHaveProperty('width');
        expect(metadata).toHaveProperty('height');
        expect(metadata).toHaveProperty('format');
        expect(metadata).toHaveProperty('size');
      });

      it('should detect image format correctly', async () => {
        const jpgMetadata = await imageUtils.optimizeImage(
          '/images/test.jpg',
          {}
        );
        expect(jpgMetadata.format).toBe('jpg');

        const pngMetadata = await imageUtils.optimizeImage(
          '/images/test.png',
          {}
        );
        expect(pngMetadata.format).toBe('png');

        const webpMetadata = await imageUtils.optimizeImage(
          '/images/test.webp',
          {}
        );
        expect(webpMetadata.format).toBe('webp');
      });
    });

    describe('generateBlurDataURL', () => {
      it('should generate a data URL', async () => {
        // Mock canvas and context
        const mockCanvas = {
          width: 0,
          height: 0,
          getContext: () => ({
            createLinearGradient: () => ({
              addColorStop: () => {},
            }),
            fillRect: () => {},
            fillStyle: '',
          }),
          toDataURL: () => 'data:image/jpeg;base64,test',
        };

        // Mock document.createElement
        const originalCreateElement = document.createElement;
        document.createElement = (tagName: string) => {
          if (tagName === 'canvas') {
            return mockCanvas as any;
          }
          return originalCreateElement.call(document, tagName);
        };

        const dataURL =
          await imageUtils.generateBlurDataURL('/images/test.jpg');

        expect(dataURL).toMatch(/^data:image\//);

        // Restore original method
        document.createElement = originalCreateElement;
      });
    });

    describe('isValidImageFormat', () => {
      it('should validate supported formats', () => {
        expect(imageUtils.isValidImageFormat('jpg')).toBe(true);
        expect(imageUtils.isValidImageFormat('jpeg')).toBe(true);
        expect(imageUtils.isValidImageFormat('png')).toBe(true);
        expect(imageUtils.isValidImageFormat('webp')).toBe(true);
        expect(imageUtils.isValidImageFormat('avif')).toBe(true);
        expect(imageUtils.isValidImageFormat('gif')).toBe(true);
        expect(imageUtils.isValidImageFormat('svg')).toBe(true);
      });

      it('should reject unsupported formats', () => {
        expect(imageUtils.isValidImageFormat('bmp')).toBe(false);
        expect(imageUtils.isValidImageFormat('tiff')).toBe(false);
        expect(imageUtils.isValidImageFormat('pdf')).toBe(false);
      });

      it('should be case insensitive', () => {
        expect(imageUtils.isValidImageFormat('JPG')).toBe(true);
        expect(imageUtils.isValidImageFormat('PNG')).toBe(true);
        expect(imageUtils.isValidImageFormat('WebP')).toBe(true);
      });
    });
  });

  describe('Helper Functions', () => {
    describe('createSrcset', () => {
      it('should create srcset using default breakpoints', () => {
        const srcset = createSrcset('/images/hero.jpg');
        expect(srcset).toContain('320w');
        expect(srcset).toContain('1920w');
      });

      it('should create srcset using custom breakpoints', () => {
        const srcset = createSrcset('/images/hero.jpg', [400, 800]);
        expect(srcset).toBe(
          '/images/hero_400w.jpg 400w, /images/hero_800w.jpg 800w'
        );
      });
    });

    describe('createSizes', () => {
      it('should create sizes using default breakpoints', () => {
        const sizes = createSizes();
        expect(sizes).toContain('(max-width: 320px) 280px');
      });

      it('should create sizes using custom breakpoints', () => {
        const sizes = createSizes([400, 800]);
        expect(sizes).toBe('(max-width: 400px) 360px, 760px');
      });
    });

    describe('needsOptimization', () => {
      it('should return true for local images', () => {
        expect(needsOptimization('/images/hero.jpg')).toBe(true);
        expect(needsOptimization('/images/hero.png')).toBe(true);
        expect(needsOptimization('/images/hero.webp')).toBe(true);
      });

      it('should return false for external images', () => {
        expect(needsOptimization('https://example.com/image.jpg')).toBe(false);
        expect(needsOptimization('//cdn.example.com/image.jpg')).toBe(false);
      });

      it('should return false for SVG images', () => {
        expect(needsOptimization('/images/logo.svg')).toBe(false);
      });
    });

    describe('getDefaultResponsiveConfig', () => {
      it('should return valid responsive configuration', () => {
        const config = getDefaultResponsiveConfig();

        expect(config.breakpoints).toHaveLength(6);
        expect(config.breakpoints).toContain(320);
        expect(config.breakpoints).toContain(1920);
        expect(config.defaultQuality).toBe(80);
        expect(config.preferredFormat).toBe('webp');
        expect(config.fallbackFormat).toBe('jpg');
      });
    });

    describe('convertToWebP', () => {
      it('should convert image extensions to webp', () => {
        expect(convertToWebP('/images/hero.jpg')).toBe('/images/hero.webp');
        expect(convertToWebP('/images/hero.jpeg')).toBe('/images/hero.webp');
        expect(convertToWebP('/images/hero.png')).toBe('/images/hero.webp');
      });

      it('should not convert already webp images', () => {
        expect(convertToWebP('/images/hero.webp')).toBe('/images/hero.webp');
      });

      it('should not convert external images', () => {
        const externalUrl = 'https://example.com/image.jpg';
        expect(convertToWebP(externalUrl)).toBe(externalUrl);
      });
    });

    describe('generateSVGPlaceholder', () => {
      it('should generate valid SVG placeholder', () => {
        const svg = generateSVGPlaceholder(100, 50);

        expect(svg).toMatch(/^data:image\/svg\+xml;base64,/);

        // Decodificar el SVG para verificar el contenido
        const decodedSvg = atob(svg.split(',')[1]);
        expect(decodedSvg).toContain('width="100"');
        expect(decodedSvg).toContain('height="50"');
      });

      it('should use custom color', () => {
        const svg = generateSVGPlaceholder(100, 50, '#ff0000');
        const decodedSvg = atob(svg.split(',')[1]);

        expect(decodedSvg).toContain('fill="#ff0000"');
      });
    });

    describe('calculateAspectRatio', () => {
      it('should calculate correct aspect ratios', () => {
        expect(calculateAspectRatio(1920, 1080)).toBe('16/9');
        expect(calculateAspectRatio(1200, 900)).toBe('4/3');
        expect(calculateAspectRatio(800, 800)).toBe('1/1');
      });

      it('should handle non-standard ratios', () => {
        expect(calculateAspectRatio(1366, 768)).toBe('683/384');
      });
    });
  });
});
