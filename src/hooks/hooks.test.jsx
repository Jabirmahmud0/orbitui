import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useControllableState } from './useControllableState';
import { useId } from './useId';
import { useMediaQuery } from './useMediaQuery';

describe('useControllableState', () => {
  it('manages uncontrolled state updates', async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useControllableState({ defaultValue: 'draft' });

      return (
        <>
          <span>{value}</span>
          <button type="button" onClick={() => setValue('published')}>
            Update
          </button>
        </>
      );
    }

    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(screen.getByText('published')).toBeInTheDocument();
  });

  it('calls onChange without mutating controlled state locally', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Example() {
      const [value, setValue] = useControllableState({
        value: 'locked',
        onChange,
      });

      return (
        <>
          <span>{value}</span>
          <button type="button" onClick={() => setValue('next')}>
            Update
          </button>
        </>
      );
    }

    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(screen.getByText('locked')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('next');
  });

  it('supports functional updates for uncontrolled usage', async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useControllableState({ defaultValue: 1 });

      return (
        <>
          <span>{value}</span>
          <button type="button" onClick={() => setValue((previousValue) => previousValue + 1)}>
            Increment
          </button>
        </>
      );
    }

    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('useId', () => {
  it('returns a stable prefixed id', () => {
    function Example() {
      const id = useId('field');
      return <label htmlFor={id}>{id}</label>;
    }

    render(<Example />);

    expect(screen.getByText(/^field-/)).toBeInTheDocument();
  });
});

describe('useMediaQuery', () => {
  it('tracks media query changes', async () => {
    let listener = null;
    let matches = false;
    const removeEventListener = vi.fn();

    window.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      addEventListener: vi.fn((eventName, callback) => {
        if (eventName === 'change') {
          listener = callback;
        }
      }),
      removeEventListener,
    }));

    function Example() {
      const matchesMedia = useMediaQuery('(min-width: 768px)');
      return <span>{matchesMedia ? 'desktop' : 'mobile'}</span>;
    }

    render(<Example />);

    expect(screen.getByText('mobile')).toBeInTheDocument();

    matches = true;
    listener?.({ matches: true });

    expect(await screen.findByText('desktop')).toBeInTheDocument();
  });

  it('returns false when matchMedia is unavailable', () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = undefined;

    function Example() {
      const matches = useMediaQuery('(min-width: 768px)');
      return <span>{matches ? 'desktop' : 'mobile'}</span>;
    }

    render(<Example />);

    expect(screen.getByText('mobile')).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
