import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Button } from './Button';

describe('Button', () => {
  it('renders with the default button semantics', () => {
    renderWithProviders(<Button>Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('bg-[var(--color-action-primary)]');
  });

  it('renders alternate variants and sizes', () => {
    renderWithProviders(
      <Button variant="outline" size="lg">
        Large outline
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Large outline' });

    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('bg-transparent');
  });

  it('supports polymorphic rendering through the as prop', () => {
    renderWithProviders(
      <Button as="a" href="/docs">
        Read docs
      </Button>,
    );

    const buttonLink = screen.getByRole('button', { name: 'Read docs' });

    expect(buttonLink.tagName).toBe('A');
    expect(buttonLink).toHaveAttribute('href', '/docs');
  });

  it('shows a loading spinner and marks itself busy', () => {
    renderWithProviders(<Button isLoading>Saving</Button>);

    const button = screen.getByRole('button', { name: 'Saving' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('renders left and right icons when not loading', () => {
    renderWithProviders(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Icon button
      </Button>,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('activates on keyboard interaction', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    renderWithProviders(<Button onPress={onPress}>Keyboard</Button>);

    const button = screen.getByRole('button', { name: 'Keyboard' });
    button.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<Button>Accessible</Button>);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
