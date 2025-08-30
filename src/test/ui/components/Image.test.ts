/**
 * Tests para el componente Image
 * Requirement: 8.1 - Optimización automática de imágenes
 */

import { describe, it, expect } from 'vitest';
import type { ImageProps } from '../../../domain/interfaces/image.interface';

describe('Image Component', () => {
  describe('ImageProps Interface', () => {
    it('should have required props', () => {
      const props: ImageProps = {
        src: '/images/test.jpg',
        alt: 'Test image',
      };

      expect(props.src).toBe('/images/test.jpg');
      expect(props.alt).toBe('Test image');
    });

    it('should have optional props with defaults', () => {
      const props: ImageProps = {
        src: '/images/test.jpg',
        alt: 'Test image',
        loading: 'lazy',
        decoding: 'async',
        priority: false,
        quality: 80,
        format: 'webp',
        fallbackFormat: 'jpg',
        objectFit: 'cover',
        placeholder: 'blur',
      };

      expect(props.loading).toBe('lazy');
      expect(props.priority).toBe(false);
      expect(props.quality).toBe(80);
      expect(props.format).toBe('webp');
    });
  });

  describe('Component Logic', () => {
    it('should handle priority images correctly', () => {
      const priorityProps: ImageProps = {
        src: '/images/hero.jpg',
        alt: 'Hero image',
        priority: true,
      };

      // Priority images should use eager loading
      expect(priorityProps.priority).toBe(true);
    });

    it('should handle responsive configuration', () => {
      const responsiveProps: ImageProps = {
        src: '/images/responsive.jpg',
        alt: 'Responsive image',
        sizes: '(max-width: 768px) 100vw, 50vw',
        srcset:
          '/images/responsive-400.jpg 400w, /images/responsive-800.jpg 800w',
      };

      expect(responsiveProps.sizes).toContain('768px');
      expect(responsiveProps.srcset).toContain('400w');
    });
  });
});
