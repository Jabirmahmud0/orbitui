import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the text field', () => {
    renderWithProviders(<Input label="Email" placeholder="name@example.com" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('placeholder', 'name@example.com');
  });

  it('shows helper text when valid', () => {
    renderWithProviders(<Input label="Username" helperText="Used for your public profile." />);

    expect(screen.getByText('Used for your public profile.')).toBeInTheDocument();
  });

  it('shows the error message when invalid', () => {
    renderWithProviders(
      <Input label="Password" isInvalid errorMessage="Password must include a symbol." />,
    );

    expect(screen.getByText('Password must include a symbol.')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders left and right addons', () => {
    renderWithProviders(
      <Input
        label="Workspace URL"
        leftAddon={<span data-testid="left-addon">https://</span>}
        rightAddon={<span data-testid="right-addon">.orbitui.dev</span>}
      />,
    );

    expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    expect(screen.getByTestId('right-addon')).toBeInTheDocument();
  });

  it('supports controlled updates through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(<Input label="Name" value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Name'), 'Orbit');

    expect(onChange).toHaveBeenCalled();
  });

  it('disables the field when requested', () => {
    renderWithProviders(<Input label="Company" value="OrbitUI" isDisabled />);

    expect(screen.getByLabelText('Company')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(
      <Input
        label="Email"
        type="email"
        placeholder="name@example.com"
        helperText="We will never share your email."
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
