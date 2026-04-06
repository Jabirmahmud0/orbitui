import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

function renderPlanGroup(props = {}) {
  return renderWithProviders(
    <RadioGroup label="Deployment strategy" helperText="Pick one rollout path." {...props}>
      <RadioGroup.Item value="staged" description="Roll out over 24 hours.">
        Staged rollout
      </RadioGroup.Item>
      <RadioGroup.Item value="instant">Instant release</RadioGroup.Item>
      <RadioGroup.Item value="manual" isDisabled>
        Manual approval
      </RadioGroup.Item>
    </RadioGroup>,
  );
}

describe('RadioGroup', () => {
  it('renders a labeled radiogroup with its items', () => {
    renderPlanGroup();

    expect(screen.getByRole('radiogroup', { name: 'Deployment strategy' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^Staged rollout/ })).toHaveAttribute('type', 'radio');
  });

  it('supports uncontrolled selection changes', async () => {
    const user = userEvent.setup();

    renderPlanGroup({ defaultValue: 'staged' });

    const staged = screen.getByRole('radio', { name: /^Staged rollout/ });
    const instant = screen.getByRole('radio', { name: 'Instant release' });

    expect(staged).toBeChecked();
    expect(instant).not.toBeChecked();

    await user.click(instant);

    expect(instant).toBeChecked();
    expect(staged).not.toBeChecked();
  });

  it('moves selection with arrow keys', async () => {
    const user = userEvent.setup();

    renderPlanGroup({ defaultValue: 'staged' });

    const staged = screen.getByRole('radio', { name: /^Staged rollout/ });
    const instant = screen.getByRole('radio', { name: 'Instant release' });

    staged.focus();
    await user.keyboard('{ArrowDown}');

    expect(instant).toBeChecked();
    expect(instant).toHaveFocus();
  });

  it('attaches item descriptions through aria-describedby', () => {
    renderPlanGroup();

    const radio = screen.getByRole('radio', { name: /^Staged rollout/ });
    const description = screen.getByText('Roll out over 24 hours.');

    expect(radio).toHaveAttribute('aria-describedby', expect.stringContaining(description.id));
  });

  it('renders the error message when invalid', () => {
    renderPlanGroup({ isInvalid: true, errorMessage: 'Choose a deployment strategy.' });

    expect(screen.getByText('Choose a deployment strategy.')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Deployment strategy' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('disables items marked as unavailable', () => {
    renderPlanGroup();

    expect(screen.getByRole('radio', { name: 'Manual approval' })).toBeDisabled();
  });

  it('throws when an item is rendered outside the group', () => {
    expect(() =>
      renderWithProviders(<RadioGroupItem value="orphan">Orphan option</RadioGroupItem>),
    ).toThrow('RadioGroup context must be used within RadioGroup.Provider');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderPlanGroup({ defaultValue: 'staged' });

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
