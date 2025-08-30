/**
 * Tests para la configuración del sitemap
 * Requirement: 3.2 - Generación automática de sitemap
 */

import { describe, it, expect } from 'vitest';
import {
  sitemapConfig,
  getPagePriority,
  shouldIncludeInSitemap,
  createSitemapOptions,
} from '../../infrastructure/config/sitemap.config';

describe('Sitemap Configuration', () => {
  describe('sitemapConfig', () => {
    it('should have valid default configuration', () => {
      expect(sitemapConfig.changefreq).toBe('weekly');
      expect(sitemapConfig.priority).toBe(0.7);
      expect(sitemapConfig.lastmod).toBeInstanceOf(Date);
      expect(Array.isArray(sitemapConfig.customPages)).toBe(true);
      expect(Array.isArray(sitemapConfig.excludePatterns)).toBe(true);
    });

    it('should include expected custom pages', () => {
      expect(sitemapConfig.customPages).toContain(
        'https://mi-landing-page.com/services/web-development'
      );
      expect(sitemapConfig.customPages).toContain(
        'https://mi-landing-page.com/privacy'
      );
      expect(sitemapConfig.customPages).toContain(
        'https://mi-landing-page.com/terms'
      );
    });

    it('should have proper exclude patterns', () => {
      expect(sitemapConfig.excludePatterns).toContain('/404');
      expect(sitemapConfig.excludePatterns).toContain('/admin');
      expect(sitemapConfig.excludePatterns).toContain('/private');
    });
  });

  describe('getPagePriority', () => {
    it('should return highest priority for home page', () => {
      const homeConfig = getPagePriority('https://example.com/');
      expect(homeConfig.priority).toBe(1.0);
      expect(homeConfig.changefreq).toBe('daily');
    });

    it('should return high priority for main pages', () => {
      const aboutConfig = getPagePriority('https://example.com/about');
      expect(aboutConfig.priority).toBe(0.8);
      expect(aboutConfig.changefreq).toBe('weekly');

      const servicesConfig = getPagePriority('https://example.com/services');
      expect(servicesConfig.priority).toBe(0.8);
      expect(servicesConfig.changefreq).toBe('weekly');

      const contactConfig = getPagePriority('https://example.com/contact');
      expect(contactConfig.priority).toBe(0.8);
      expect(contactConfig.changefreq).toBe('weekly');
    });

    it('should return low priority for legal pages', () => {
      const privacyConfig = getPagePriority('https://example.com/privacy');
      expect(privacyConfig.priority).toBe(0.3);
      expect(privacyConfig.changefreq).toBe('yearly');

      const termsConfig = getPagePriority('https://example.com/terms');
      expect(termsConfig.priority).toBe(0.3);
      expect(termsConfig.changefreq).toBe('yearly');
    });

    it('should return medium priority for other pages', () => {
      const otherConfig = getPagePriority('https://example.com/blog/post-1');
      expect(otherConfig.priority).toBe(0.6);
      expect(otherConfig.changefreq).toBe('monthly');
    });
  });

  describe('shouldIncludeInSitemap', () => {
    it('should include valid pages', () => {
      expect(shouldIncludeInSitemap('https://example.com/')).toBe(true);
      expect(shouldIncludeInSitemap('https://example.com/about')).toBe(true);
      expect(shouldIncludeInSitemap('https://example.com/services')).toBe(true);
      expect(shouldIncludeInSitemap('https://example.com/contact')).toBe(true);
    });

    it('should exclude pages with forbidden patterns', () => {
      expect(shouldIncludeInSitemap('https://example.com/404')).toBe(false);
      expect(
        shouldIncludeInSitemap('https://example.com/admin/dashboard')
      ).toBe(false);
      expect(shouldIncludeInSitemap('https://example.com/private/data')).toBe(
        false
      );
      expect(shouldIncludeInSitemap('https://example.com/api/users')).toBe(
        false
      );
      expect(shouldIncludeInSitemap('https://example.com/_internal')).toBe(
        false
      );
    });
  });

  describe('createSitemapOptions', () => {
    it('should return valid sitemap options', () => {
      const options = createSitemapOptions();

      expect(options.changefreq).toBe('weekly');
      expect(options.priority).toBe(0.7);
      expect(options.lastmod).toBeInstanceOf(Date);
      expect(Array.isArray(options.customPages)).toBe(true);
      expect(typeof options.filter).toBe('function');
      expect(typeof options.serialize).toBe('function');
    });

    it('should have working filter function', () => {
      const options = createSitemapOptions();

      if (options.filter) {
        expect(options.filter('https://example.com/')).toBe(true);
        expect(options.filter('https://example.com/404')).toBe(false);
        expect(options.filter('https://example.com/admin')).toBe(false);
      }
    });

    it('should have working serialize function', () => {
      const options = createSitemapOptions();

      if (options.serialize) {
        const homeItem = options.serialize({
          url: 'https://example.com/',
          lastmod: undefined,
          changefreq: undefined,
          priority: undefined,
          links: [],
        });

        expect(homeItem.priority).toBe(1.0);
        expect(homeItem.changefreq).toBe('daily');
        expect(homeItem.lastmod).toBeInstanceOf(Date);
      }
    });
  });
});
