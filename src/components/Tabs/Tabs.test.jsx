import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Tabs, TabsContent } from './Tabs';

function renderProjectTabs(props = {}) {
  return renderWithProviders(
    <Tabs defaultValue="overview" {...props}>
      <Tabs.List aria-label="Project tabs">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings" isDisabled>
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">Overview panel</Tabs.Content>
      <Tabs.Content value="activity">Activity panel</Tabs.Content>
      <Tabs.Content value="settings">Settings panel</Tabs.Content>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('renders a tablist with the selected panel', () => {
    renderProjectTabs();

    expect(screen.getByRole('tablist', { name: 'Project tabs' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('switches panels when a tab is clicked', async () => {
    const user = userEvent.setup();

    renderProjectTabs();

    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('supports controlled state updates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderProjectTabs({ value: 'overview', onValueChange });

    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    expect(onValueChange).toHaveBeenCalledWith('Activity'.toLowerCase());
  });

  it('moves focus and selection with arrow keys', async () => {
    const user = userEvent.setup();

    renderProjectTabs();

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
  });

  it('respects vertical orientation keyboard navigation', async () => {
    const user = userEvent.setup();

    renderProjectTabs({ orientation: 'vertical' });

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tablist', { name: 'Project tabs' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('does not allow selecting disabled tabs', async () => {
    const user = userEvent.setup();

    renderProjectTabs();

    const disabledTab = screen.getByRole('tab', { name: 'Settings' });

    expect(disabledTab).toBeDisabled();

    await user.click(disabledTab);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('can force-mount hidden panels', () => {
    renderWithProviders(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Force mounted tabs">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Overview panel</Tabs.Content>
        <TabsContent value="activity" forceMount>
          Activity panel
        </TabsContent>
      </Tabs>,
    );

    const panels = screen.getAllByRole('tabpanel', { hidden: true });

    expect(panels).toHaveLength(2);
    expect(screen.getByText('Activity panel').closest('[role="tabpanel"]')).toHaveAttribute(
      'hidden',
    );
  });

  it('links the selected tab and panel ids', () => {
    renderProjectTabs();

    const selectedTab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');

    expect(selectedTab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', selectedTab.id);
  });

  it('throws when content is rendered outside of Tabs', () => {
    expect(() =>
      renderWithProviders(<TabsContent value="orphan">Orphan panel</TabsContent>),
    ).toThrow('Tabs context must be used within Tabs.Provider');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderProjectTabs();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
