import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import App from './App.jsx';
import { renderWithProviders } from './test/setup';

describe('App', () => {
  it('renders the scaffold headline', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { name: /tailwind v4 is now driving the library shell/i }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<App />);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
