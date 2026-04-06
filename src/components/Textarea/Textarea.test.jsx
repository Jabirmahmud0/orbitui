import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('associates the label with the textarea', () => {
    renderWithProviders(<Textarea label="Notes" placeholder="Write here" />);

    expect(screen.getByLabelText('Notes')).toHaveAttribute('placeholder', 'Write here');
  });

  it('shows helper text when valid', () => {
    renderWithProviders(<Textarea label="Summary" helperText="Keep this concise." />);

    expect(screen.getByText('Keep this concise.')).toBeInTheDocument();
  });

  it('shows the error message when invalid', () => {
    renderWithProviders(
      <Textarea label="Summary" isInvalid errorMessage="Summary must be at least 20 characters." />,
    );

    expect(screen.getByText('Summary must be at least 20 characters.')).toBeInTheDocument();
    expect(screen.getByLabelText('Summary')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows the character count when requested', () => {
    renderWithProviders(
      <Textarea label="Description" defaultValue="OrbitUI" maxLength={120} showCharacterCount />,
    );

    expect(screen.getByText('7 / 120')).toBeInTheDocument();
  });

  it('supports controlled updates through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(<Textarea label="Comment" value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Comment'), 'Looks solid');

    expect(onChange).toHaveBeenCalled();
  });

  it('auto-resizes when enabled', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Textarea label="Notes" autoResize defaultValue="Resize me" />);

    const textarea = screen.getByLabelText('Notes');

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 168,
    });

    await user.type(textarea, '!');

    expect(textarea.style.height).toBe('168px');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(
      <Textarea label="Overview" helperText="Add implementation context for reviewers." />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
