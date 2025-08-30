import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Card from '../../ui/components/Card.astro';

describe('Card Component', () => {
  it('renders card with default variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Test Card',
        content: 'This is test content'
      }
    });

    expect(result).toContain('Test Card');
    expect(result).toContain('This is test content');
    expect(result).toContain('bg-white');
    expect(result).toContain('rounded-lg');
    expect(result).toContain('hover:shadow-md'); // default variant
  });

  it('renders card with featured variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Featured Card',
        variant: 'featured'
      }
    });

    expect(result).toContain('Featured Card');
    expect(result).toContain('border-blue-200'); // featured variant
    expect(result).toContain('shadow-md');
    expect(result).toContain('ring-1 ring-blue-100');
    expect(result).toContain('text-xl font-bold'); // featured title styling
  });

  it('renders card with minimal variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Minimal Card',
        variant: 'minimal'
      }
    });

    expect(result).toContain('Minimal Card');
    expect(result).toContain('shadow-none'); // minimal variant
    expect(result).toContain('border-gray-100');
    expect(result).toContain('hover:shadow-sm');
  });

  it('renders card with title and subtitle', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Main Title',
        subtitle: 'Subtitle text'
      }
    });

    expect(result).toContain('Main Title');
    expect(result).toContain('Subtitle text');
    expect(result).toContain('text-lg font-semibold'); // title styling
    expect(result).toContain('text-sm text-gray-600'); // subtitle styling
  });

  it('renders card with image', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Card with Image',
        image: {
          src: '/test-image.jpg',
          alt: 'Test image'
        }
      }
    });

    expect(result).toContain('src="/test-image.jpg"');
    expect(result).toContain('alt="Test image"');
    expect(result).toContain('loading="lazy"'); // default loading
    expect(result).toContain('object-cover');
  });

  it('renders card with eager loading image', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Card with Eager Image',
        image: {
          src: '/eager-image.jpg',
          alt: 'Eager image',
          loading: 'eager'
        }
      }
    });

    expect(result).toContain('loading="eager"');
  });

  it('renders card with all content props', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Complete Card',
        subtitle: 'Card subtitle',
        content: 'Card content text'
      }
    });

    expect(result).toContain('Complete Card');
    expect(result).toContain('Card subtitle');
    expect(result).toContain('Card content text');
  });

  it('applies custom className', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Custom Card',
        className: 'custom-card-class'
      }
    });

    expect(result).toContain('custom-card-class');
  });

  it('renders with semantic HTML structure', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Semantic Card'
      }
    });

    expect(result).toContain('<article'); // semantic article element
    expect(result).toContain('<h3'); // semantic heading
  });

  it('renders card without header when slots.header is false', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'No Header Card',
        content: 'Content only',
        slots: { header: false, content: true, footer: false }
      }
    });

    expect(result).not.toContain('No Header Card'); // title should not render
    expect(result).toContain('Content only');
  });

  it('renders card without content when slots.content is false', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Header Only Card',
        content: 'Hidden content',
        slots: { header: true, content: false, footer: false }
      }
    });

    expect(result).toContain('Header Only Card');
    expect(result).not.toContain('Hidden content'); // content should not render
  });

  it('renders footer section when slots.footer is true', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Card, {
      props: {
        title: 'Card with Footer',
        slots: { header: true, content: true, footer: true }
      }
    });

    expect(result).toContain('bg-gray-50'); // footer background
    expect(result).toContain('border-t border-gray-200'); // footer border
  });
});