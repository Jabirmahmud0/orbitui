import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { ToastProvider, toast, useToast } from './Toast';

function renderToastTree(ui) {
  return renderWithProviders(<ToastProvider>{ui}</ToastProvider>);
}

describe('Toast', () => {
  it('renders an imperative toast and allows dismissal', async () => {
    const user = userEvent.setup();

    renderToastTree(<div>shell</div>);

    act(() => {
      toast.success({ title: 'Saved', description: 'Changes are live.' });
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Changes are live.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('supports hook-driven toasts and stacking order', async () => {
    const user = userEvent.setup();

    function Demo() {
      const { show } = useToast();

      return (
        <button
          type="button"
          onClick={() => {
            show({ title: 'First' });
            show({ title: 'Second' });
          }}
        >
          Trigger stack
        </button>
      );
    }

    renderToastTree(<Demo />);

    await user.click(screen.getByRole('button', { name: 'Trigger stack' }));

    const statuses = screen.getAllByRole('status');

    expect(statuses).toHaveLength(2);
    expect(statuses[0]).toHaveTextContent('Second');
    expect(statuses[1]).toHaveTextContent('First');
  });

  it('auto dismisses toast records after their duration', () => {
    vi.useFakeTimers();

    renderToastTree(<div>shell</div>);

    act(() => {
      toast.show({ title: 'Timed', duration: 1000 });
    });

    expect(screen.getByText('Timed')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Timed')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('runs action callbacks and remains accessible', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const { container } = renderToastTree(<div>shell</div>);

    act(() => {
      toast.show({
        title: 'Unsaved changes',
        description: 'Restore the previous draft if this was accidental.',
        actionLabel: 'Undo',
        onAction,
        duration: 0,
      });
    });

    await user.click(screen.getByRole('button', { name: 'Undo' }));

    expect(onAction).toHaveBeenCalledTimes(1);

    act(() => {
      toast.show({ title: 'Accessible', description: 'Notification content', duration: 0 });
    });

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
