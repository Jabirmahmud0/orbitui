import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

function renderTooltip(props = {}) {
  return renderWithProviders(
    <Tooltip content="Copy deployment URL" delay={0} closeDelay={0} trigger="focus" {...props}>
      <Button variant="secondary">Copy link</Button>
    </Tooltip>,
  );
}

describe('Tooltip', () => {
  it('shows the tooltip on focus', async () => {
    const user = userEvent.setup();

    renderTooltip();

    await user.tab();

    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy deployment URL');
  });

  it('links the trigger to the tooltip with aria-describedby when open', async () => {
    const user = userEvent.setup();

    renderTooltip();

    await user.tab();

    const trigger = screen.getByRole('button', { name: 'Copy link' });
    const tooltip = screen.getByRole('tooltip');

    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('applies the requested placement marker', async () => {
    const user = userEvent.setup();

    renderTooltip({ placement: 'right' });

    await user.tab();

    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'right');
  });

  it('can hide the arrow decoration', async () => {
    const user = userEvent.setup();

    renderTooltip({ showArrow: false });

    await user.tab();

    expect(screen.getByRole('tooltip').querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();

    renderTooltip({ isDisabled: true });

    await user.tab();

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = renderTooltip();

    await user.tab();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
