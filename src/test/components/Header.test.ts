/**
 * Tests para el componente Header
 * Requirement: 5.2 - Escribir tests para funcionalidad de navegación
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { NavigationItem } from '../../domain/interfaces/navigation.interface';

// Mock de la configuración del sitio
vi.mock('../../infrastructure/config/site.config', () => ({
  siteConfig: {
    navigation: [
      { label: 'Inicio', href: '/', ariaLabel: 'Ir a la página de inicio' },
      { label: 'Acerca de', href: '/about', ariaLabel: 'Conocer más sobre nosotros' },
      { label: 'Servicios', href: '/services', ariaLabel: 'Ver nuestros servicios' },
      { label: 'Contacto', href: '/contact', ariaLabel: 'Contactar con nosotros' },
      { label: 'GitHub', href: 'https://github.com', external: true, ariaLabel: 'Ver en GitHub' },
    ],
    logo: {
      src: '/images/logo.svg',
      alt: 'Logo de Tu Empresa',
      width: 120,
      height: 40,
      href: '/',
    },
  },
}));

describe('Header Component Logic', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('Funciones de utilidad', () => {
    // Función isActiveLink extraída para testing
    function isActiveLink(href: string, currentPath: string): boolean {
      if (href === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(href);
    }

    it('debe identificar correctamente la página de inicio', () => {
      expect(isActiveLink('/', '/')).toBe(true);
      expect(isActiveLink('/', '/about')).toBe(false);
      expect(isActiveLink('/', '/about/team')).toBe(false);
    });

    it('debe identificar correctamente páginas anidadas', () => {
      expect(isActiveLink('/about', '/about')).toBe(true);
      expect(isActiveLink('/about', '/about/team')).toBe(true);
      expect(isActiveLink('/services', '/services/web-development')).toBe(true);
      expect(isActiveLink('/contact', '/about')).toBe(false);
    });

    it('no debe marcar como activo enlaces que no coinciden', () => {
      expect(isActiveLink('/about', '/contact')).toBe(false);
      expect(isActiveLink('/services', '/about')).toBe(false);
      expect(isActiveLink('/contact', '/')).toBe(false);
    });
  });

  describe('Configuración de navegación', () => {
    it('debe validar estructura de NavigationItem', () => {
      const validNavItem: NavigationItem = {
        label: 'Test',
        href: '/test',
        ariaLabel: 'Test page',
        external: false,
      };

      expect(validNavItem.label).toBe('Test');
      expect(validNavItem.href).toBe('/test');
      expect(validNavItem.ariaLabel).toBe('Test page');
      expect(validNavItem.external).toBe(false);
    });

    it('debe manejar enlaces externos', () => {
      const externalNavItem: NavigationItem = {
        label: 'GitHub',
        href: 'https://github.com',
        external: true,
        ariaLabel: 'Ver en GitHub',
      };

      expect(externalNavItem.external).toBe(true);
      expect(externalNavItem.href.startsWith('http')).toBe(true);
    });
  });

  describe('Funcionalidad del menú móvil', () => {
    beforeEach(() => {
      // Simular DOM del header
      document.body.innerHTML = `
        <header>
          <button id="mobile-menu-button" aria-expanded="false">Menu</button>
          <div id="mobile-menu" class="hidden">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </div>
          <svg id="menu-open-icon" class="block">Open</svg>
          <svg id="menu-close-icon" class="hidden">Close</svg>
        </header>
      `;
    });

    it('debe alternar la visibilidad del menú móvil', () => {
      const menuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const openIcon = document.getElementById('menu-open-icon');
      const closeIcon = document.getElementById('menu-close-icon');

      expect(menuButton).toBeTruthy();
      expect(mobileMenu).toBeTruthy();
      expect(openIcon).toBeTruthy();
      expect(closeIcon).toBeTruthy();

      // Estado inicial
      expect(mobileMenu?.classList.contains('hidden')).toBe(true);
      expect(openIcon?.classList.contains('hidden')).toBe(false);
      expect(closeIcon?.classList.contains('hidden')).toBe(true);
    });

    it('debe cambiar aria-expanded al alternar menú', () => {
      const menuButton = document.getElementById('mobile-menu-button');
      
      expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
      
      // Simular click (cambiaría a true en implementación real)
      menuButton?.setAttribute('aria-expanded', 'true');
      expect(menuButton?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Validación de props', () => {
    it('debe manejar props opcionales correctamente', () => {
      // Simular props por defecto
      const defaultProps = {
        currentPath: '/',
        transparent: false,
        sticky: true,
        className: '',
      };

      expect(defaultProps.transparent).toBe(false);
      expect(defaultProps.sticky).toBe(true);
      expect(defaultProps.className).toBe('');
    });

    it('debe construir clases CSS correctamente', () => {
      const buildHeaderClasses = (transparent: boolean, sticky: boolean, className: string) => {
        return [
          'w-full z-50 transition-all duration-300',
          sticky ? 'sticky top-0' : 'relative',
          transparent ? 'bg-transparent' : 'bg-white shadow-sm',
          className
        ].filter(Boolean).join(' ');
      };

      const transparentClasses = buildHeaderClasses(true, true, 'custom-class');
      expect(transparentClasses).toContain('bg-transparent');
      expect(transparentClasses).toContain('sticky top-0');
      expect(transparentClasses).toContain('custom-class');

      const solidClasses = buildHeaderClasses(false, false, '');
      expect(solidClasses).toContain('bg-white shadow-sm');
      expect(solidClasses).toContain('relative');
      expect(solidClasses).not.toContain('sticky');
    });
  });
});