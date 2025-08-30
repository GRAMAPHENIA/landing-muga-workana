import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Input from '../../ui/components/Input.astro';

describe('Input Component', () => {
  it('renders input with basic props', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'test-input',
        label: 'Test Label',
      },
    });

    expect(result).toContain('Test Label');
    expect(result).toContain('name="test-input"');
    expect(result).toContain('type="text"'); // default type
    expect(result).toContain('id="input-test-input"');
  });

  it('renders input with email type', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'email',
        label: 'Email',
        type: 'email',
      },
    });

    expect(result).toContain('type="email"');
  });

  it('renders input with placeholder', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'test',
        label: 'Test',
        placeholder: 'Enter text here',
      },
    });

    expect(result).toContain('placeholder="Enter text here"');
  });

  it('renders required input with asterisk', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'required-input',
        label: 'Required Field',
        required: true,
      },
    });

    expect(result).toContain('required');
    expect(result).toContain('text-red-500'); // asterisk styling
    expect(result).toContain('*');
  });

  it('renders disabled input', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'disabled-input',
        label: 'Disabled Field',
        disabled: true,
      },
    });

    expect(result).toContain('disabled');
    expect(result).toContain('bg-gray-50'); // disabled styling
    expect(result).toContain('cursor-not-allowed');
  });

  it('renders input with error state', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'error-input',
        label: 'Error Field',
        error: 'This field has an error',
      },
    });

    expect(result).toContain('This field has an error');
    expect(result).toContain('border-red-300'); // error styling
    expect(result).toContain('text-red-600'); // error message styling
    expect(result).toContain('role="alert"');
    expect(result).toContain('aria-invalid="true"');
  });

  it('renders input with value', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'value-input',
        label: 'Value Field',
        value: 'Initial value',
      },
    });

    expect(result).toContain('value="Initial value"');
  });

  it('renders input with validation attributes', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'validation-input',
        label: 'Validation Field',
        validation: {
          pattern: '[A-Za-z]+',
          minLength: 3,
          maxLength: 20,
          customMessage: 'Custom error message',
        },
      },
    });

    expect(result).toContain('pattern="[A-Za-z]+"');
    expect(result).toContain('minlength="3"');
    expect(result).toContain('maxlength="20"');
  });

  it('renders password input type', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'password',
        label: 'Password',
        type: 'password',
      },
    });

    expect(result).toContain('type="password"');
  });

  it('renders tel input type', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
      },
    });

    expect(result).toContain('type="tel"');
  });

  it('renders url input type', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'website',
        label: 'Website',
        type: 'url',
      },
    });

    expect(result).toContain('type="url"');
  });

  it('applies custom className', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'custom-input',
        label: 'Custom Field',
        className: 'custom-class',
      },
    });

    expect(result).toContain('custom-class');
  });

  it('renders proper accessibility attributes', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Input, {
      props: {
        name: 'accessible-input',
        label: 'Accessible Field',
        error: 'Error message',
      },
    });

    expect(result).toContain('aria-describedby="error-accessible-input"');
    expect(result).toContain('aria-invalid="true"');
    expect(result).toContain('id="error-accessible-input"');
  });
});
