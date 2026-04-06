import { render, screen } from '@testing-library/react';

import { OrbitProvider, useOrbitContext } from './OrbitProvider';

describe('OrbitProvider', () => {
  it('wraps children with theme and brand data attributes', () => {
    render(
      <OrbitProvider theme="dark" brand="brand-a">
        <span>Inside provider</span>
      </OrbitProvider>,
    );

    const provider = screen.getByText('Inside provider').closest('[data-orbit-provider]');

    expect(provider).toHaveAttribute('data-theme', 'dark');
    expect(provider).toHaveAttribute('data-brand', 'brand-a');
  });

  it('injects custom css variables for object themes', () => {
    render(
      <OrbitProvider theme={{ '--color-action-primary': '#ff00aa', accentColor: '#22c55e' }}>
        <span>Custom theme</span>
      </OrbitProvider>,
    );

    const provider = screen.getByText('Custom theme').closest('[data-orbit-provider]');

    expect(provider).toHaveStyle({
      '--color-action-primary': '#ff00aa',
      '--accent-color': '#22c55e',
    });
  });

  it('exposes theme configuration through context', () => {
    function Consumer() {
      const orbit = useOrbitContext();
      return <span>{`${orbit.themeName}:${orbit.brand ?? 'none'}`}</span>;
    }

    render(
      <OrbitProvider theme="dark" brand="brand-b">
        <Consumer />
      </OrbitProvider>,
    );

    expect(screen.getByText('dark:brand-b')).toBeInTheDocument();
  });
});
