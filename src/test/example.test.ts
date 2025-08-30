import { describe, it, expect } from 'vitest';
import { mockFetch, createMockEvent, flushPromises } from './utils';

describe('Configuración de Testing', () => {
  it('debería ejecutar tests básicos correctamente', () => {
    expect(true).toBe(true);
  });

  it('debería poder usar utilidades de testing', () => {
    const fetch = mockFetch({ success: true });
    expect(fetch).toBeDefined();

    const event = createMockEvent('click');
    expect(event.type).toBe('click');
  });

  it('debería manejar promesas correctamente', async () => {
    const promise = Promise.resolve('test');
    await flushPromises();
    const result = await promise;
    expect(result).toBe('test');
  });

  it('debería poder crear elementos DOM', () => {
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Test Button');
  });
});

describe('Configuración del entorno', () => {
  it('debería tener acceso a globals de Vitest', () => {
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });

  it('debería tener DOM disponible', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  it('debería tener mocks configurados', () => {
    expect(window.matchMedia).toBeDefined();
    expect(global.IntersectionObserver).toBeDefined();
    expect(global.ResizeObserver).toBeDefined();
  });
});
