import { render, screen } from '@testing-library/react';

import { createSafeContext } from './createContext';

describe('createSafeContext', () => {
  it('returns the provided value', () => {
    const [ExampleProvider, useExampleContext] = createSafeContext('Example');

    function Consumer() {
      const value = useExampleContext();
      return <span>{value.label}</span>;
    }

    render(
      <ExampleProvider value={{ label: 'Available' }}>
        <Consumer />
      </ExampleProvider>,
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('throws a descriptive error outside the provider', () => {
    const [, useExampleContext] = createSafeContext('Example');

    function Consumer() {
      useExampleContext();
      return null;
    }

    expect(() => render(<Consumer />)).toThrowError(
      'Example context must be used within Example.Provider',
    );
  });
});
