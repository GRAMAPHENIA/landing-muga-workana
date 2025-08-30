import { vi } from 'vitest';

/**
 * Utilidades para testing de componentes Astro
 */

/**
 * Mock para fetch API
 */
export const mockFetch = (response: any, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
  });
};

/**
 * Mock para localStorage
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

/**
 * Crear un evento mock para testing
 */
export const createMockEvent = (
  type: string,
  properties: Record<string, any> = {}
) => {
  const event = new Event(type, { bubbles: true, cancelable: true });

  // Crear un objeto que combine el evento con las propiedades adicionales
  const mockEvent = Object.create(event);
  Object.assign(mockEvent, properties);

  return mockEvent;
};

/**
 * Esperar a que se resuelvan todas las promesas pendientes
 */
export const flushPromises = () =>
  new Promise(resolve => setTimeout(resolve, 0));

/**
 * Crear un elemento DOM mock para testing
 */
export const createMockElement = (
  tagName: string,
  attributes: Record<string, string> = {}
) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};
