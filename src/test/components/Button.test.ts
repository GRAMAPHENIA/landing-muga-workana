import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Button from '../../ui/components/Button.astro';

describe('Button Component', () => {
  it('renders button with default props', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Click me'
      }
    });

    expect(result).toContain('Click me');
    expect(result).toContain('bg-blue-600'); // primary variant
    expect(result).toContain('px-4 py-2'); // md size
    expect(result).toContain('type="button"');
  });

  it('renders button with primary variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Primary Button',
        variant: 'primary'
      }
    });

    expect(result).toContain('bg-blue-600');
    expect(result).toContain('text-white');
    expect(result).toContain('hover:bg-blue-700');
  });

  it('renders button with secondary variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Secondary Button',
        variant: 'secondary'
      }
    });

    expect(result).toContain('bg-gray-600');
    expect(result).toContain('text-white');
    expect(result).toContain('hover:bg-gray-700');
  });

  it('renders button with outline variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Outline Button',
        variant: 'outline'
      }
    });

    expect(result).toContain('border border-gray-300');
    expect(result).toContain('bg-transparent');
    expect(result).toContain('text-gray-700');
  });

  it('renders button with ghost variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Ghost Button',
        variant: 'ghost'
      }
    });

    expect(result).toContain('bg-transparent');
    expect(result).toContain('text-gray-700');
    expect(result).toContain('hover:bg-gray-100');
  });

  it('renders button with small size', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Small Button',
        size: 'sm'
      }
    });

    expect(result).toContain('px-3 py-1.5');
    expect(result).toContain('text-sm');
  });

  it('renders button with large size', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Large Button',
        size: 'lg'
      }
    });

    expect(result).toContain('px-6 py-3');
    expect(result).toContain('text-lg');
  });

  it('renders disabled button', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Disabled Button',
        disabled: true
      }
    });

    expect(result).toContain('disabled');
    expect(result).toContain('disabled:opacity-50');
  });

  it('renders loading button', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Loading Button',
        loading: true
      }
    });

    expect(result).toContain('Cargando...');
    expect(result).toContain('animate-spin');
    expect(result).toContain('disabled');
  });

  it('renders as link when href is provided', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Link Button',
        href: '/test-link'
      }
    });

    expect(result).toContain('<a');
    expect(result).toContain('href="/test-link"');
    expect(result).not.toContain('<button');
  });

  it('renders submit button type', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Submit Button',
        type: 'submit'
      }
    });

    expect(result).toContain('type="submit"');
  });

  it('applies custom className', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        text: 'Custom Button',
        className: 'custom-class'
      }
    });

    expect(result).toContain('custom-class');
  });
});