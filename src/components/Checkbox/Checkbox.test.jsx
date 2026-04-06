import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('associates the accessible name with the checkbox input', () => {
    renderWithProviders(<Checkbox label="Accept terms" helperText="Required to continue." />);

    expect(screen.getByRole('checkbox', { name: /^Accept terms/ })).toHaveAttribute(
      'type',
      'checkbox',
    );
  });

  it('toggles when clicked in uncontrolled mode', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Checkbox label="Enable notifications" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Enable notifications' });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('shows the helper text when valid', () => {
    renderWithProviders(<Checkbox label="Beta access" helperText="Includes preview features." />);

    expect(screen.getByText('Includes preview features.')).toBeInTheDocument();
  });

  it('shows the error message when invalid', () => {
    renderWithProviders(
      <Checkbox label="Accept policy" isInvalid errorMessage="You must accept the policy." />,
    );

    expect(screen.getByText('You must accept the policy.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /^Accept policy/ })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('sets the native indeterminate state', () => {
    renderWithProviders(<Checkbox label="Parent item" isIndeterminate />);

    expect(screen.getByRole('checkbox', { name: 'Parent item' }).indeterminate).toBe(true);
  });

  it('renders custom icons for selected and indeterminate states', () => {
    renderWithProviders(
      <div>
        <Checkbox
          label="Selected item"
          defaultSelected
          checkedIcon={<span data-testid="checked-icon">OK</span>}
        />
        <Checkbox
          label="Partial item"
          isIndeterminate
          indeterminateIcon={<span data-testid="indeterminate-icon">-</span>}
        />
      </div>,
    );

    expect(screen.getByTestId('checked-icon')).toBeInTheDocument();
    expect(screen.getByTestId('indeterminate-icon')).toBeInTheDocument();
  });

  it('disables the checkbox when requested', () => {
    renderWithProviders(<Checkbox label="Managed setting" isDisabled defaultSelected />);

    expect(screen.getByRole('checkbox', { name: 'Managed setting' })).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(
      <Checkbox label="Product updates" helperText="Receive important release notifications." />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
