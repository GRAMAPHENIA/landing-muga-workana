/**
 * Tests para la configuración de robots.txt
 * Requirement: 3.2 - Configuración específica para SEO
 */

import { describe, it, expect } from 'vitest';
import {
  robotsConfig,
  generateRobotsTxt,
  isUserAgentAllowed,
  getCrawlDelay,
  isPathAllowed,
} from '../../infrastructure/config/robots.config';

describe('Robots Configuration', () => {
  describe('robotsConfig', () => {
    it('should have valid general configuration', () => {
      expect(robotsConfig.general.userAgent).toBe('*');
      expect(robotsConfig.general.allow).toContain('/');
      expect(robotsConfig.general.disallow).toContain('/admin/');
      expect(robotsConfig.general.crawlDelay).toBe(1);
    });

    it('should have specific crawler configurations', () => {
      expect(robotsConfig.specific).toHaveLength(5);

      const googlebot = robotsConfig.specific.find(
        c => c.userAgent === 'Googlebot'
      );
      expect(googlebot).toBeDefined();
      expect(googlebot?.rules.crawlDelay).toBe(1);
    });

    it('should have blocked crawlers list', () => {
      expect(robotsConfig.blocked).toContain('AhrefsBot');
      expect(robotsConfig.blocked).toContain('MJ12bot');
      expect(robotsConfig.blocked).toContain('SemrushBot');
    });

    it('should have allowed files configuration', () => {
      expect(robotsConfig.allowedFiles).toContain('/sitemap.xml');
      expect(robotsConfig.allowedFiles).toContain('/robots.txt');
      expect(robotsConfig.allowedFiles).toContain('/favicon.ico');
    });

    it('should have valid sitemap URL', () => {
      expect(robotsConfig.sitemap).toMatch(/^https:\/\/.+\/sitemap\.xml$/);
    });
  });

  describe('generateRobotsTxt', () => {
    it('should generate valid robots.txt content', () => {
      const content = generateRobotsTxt();

      expect(content).toContain('User-agent: *');
      expect(content).toContain('Allow: /');
      expect(content).toContain('Disallow: /admin/');
      expect(content).toContain(
        'Sitemap: https://mi-landing-page.com/sitemap.xml'
      );
    });

    it('should include specific crawler configurations', () => {
      const content = generateRobotsTxt();

      expect(content).toContain('User-agent: Googlebot');
      expect(content).toContain('User-agent: Bingbot');
      expect(content).toContain('Crawl-delay: 1');
    });

    it('should include blocked crawlers', () => {
      const content = generateRobotsTxt();

      expect(content).toContain('User-agent: AhrefsBot');
      expect(content).toContain('User-agent: MJ12bot');
      robotsConfig.blocked.forEach(bot => {
        expect(content).toContain(`User-agent: ${bot}`);
      });
    });

    it('should include allowed files', () => {
      const content = generateRobotsTxt();

      expect(content).toContain('Allow: /sitemap.xml');
      expect(content).toContain('Allow: /robots.txt');
      expect(content).toContain('Allow: /favicon.ico');
    });
  });

  describe('isUserAgentAllowed', () => {
    it('should allow legitimate crawlers', () => {
      expect(isUserAgentAllowed('Googlebot')).toBe(true);
      expect(isUserAgentAllowed('Bingbot')).toBe(true);
      expect(isUserAgentAllowed('DuckDuckBot')).toBe(true);
    });

    it('should block problematic crawlers', () => {
      expect(isUserAgentAllowed('AhrefsBot')).toBe(false);
      expect(isUserAgentAllowed('MJ12bot')).toBe(false);
      expect(isUserAgentAllowed('SemrushBot')).toBe(false);
    });

    it('should allow unknown crawlers by default', () => {
      expect(isUserAgentAllowed('UnknownBot')).toBe(true);
      expect(isUserAgentAllowed('CustomCrawler')).toBe(true);
    });
  });

  describe('getCrawlDelay', () => {
    it('should return specific crawl delay for known crawlers', () => {
      expect(getCrawlDelay('Googlebot')).toBe(1);
      expect(getCrawlDelay('Bingbot')).toBe(1);
      expect(getCrawlDelay('Slurp')).toBe(2);
      expect(getCrawlDelay('Baiduspider')).toBe(2);
    });

    it('should return default crawl delay for unknown crawlers', () => {
      expect(getCrawlDelay('UnknownBot')).toBe(1);
      expect(getCrawlDelay('CustomCrawler')).toBe(1);
    });

    it('should be case insensitive', () => {
      expect(getCrawlDelay('googlebot')).toBe(1);
      expect(getCrawlDelay('BINGBOT')).toBe(1);
    });
  });

  describe('isPathAllowed', () => {
    it('should block paths for blocked user agents', () => {
      expect(isPathAllowed('AhrefsBot', '/')).toBe(false);
      expect(isPathAllowed('MJ12bot', '/about')).toBe(false);
      expect(isPathAllowed('SemrushBot', '/contact')).toBe(false);
    });

    it('should allow root path for legitimate crawlers', () => {
      expect(isPathAllowed('Googlebot', '/')).toBe(true);
      expect(isPathAllowed('Bingbot', '/about')).toBe(true);
      expect(isPathAllowed('DuckDuckBot', '/contact')).toBe(true);
    });

    it('should block admin paths', () => {
      expect(isPathAllowed('Googlebot', '/admin/')).toBe(false);
      expect(isPathAllowed('Bingbot', '/admin/dashboard')).toBe(false);
      expect(isPathAllowed('DuckDuckBot', '/private/data')).toBe(false);
    });

    it('should allow specifically permitted files', () => {
      expect(isPathAllowed('Googlebot', '/sitemap.xml')).toBe(true);
      expect(isPathAllowed('Bingbot', '/robots.txt')).toBe(true);
      expect(isPathAllowed('DuckDuckBot', '/favicon.ico')).toBe(true);
    });

    it('should handle wildcard patterns', () => {
      expect(isPathAllowed('Googlebot', '/sitemap-index.xml')).toBe(true);
      expect(isPathAllowed('Bingbot', '/sitemap-pages.xml')).toBe(true);
    });

    it('should block file extensions', () => {
      expect(isPathAllowed('Googlebot', '/config.json')).toBe(false);
      expect(isPathAllowed('Bingbot', '/settings.yml')).toBe(false);
      expect(isPathAllowed('DuckDuckBot', '/astro.config.mjs')).toBe(false);
    });

    it('should block hidden files and directories', () => {
      expect(isPathAllowed('Googlebot', '/.env')).toBe(false);
      expect(isPathAllowed('Bingbot', '/.git/config')).toBe(false);
      expect(isPathAllowed('DuckDuckBot', '/.astro/settings.json')).toBe(false);
    });
  });
});
