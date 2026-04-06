import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from './setup';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { Pagination } from '../components/Pagination';
import { RadioGroup } from '../components/RadioGroup';
import { Tabs } from '../components/Tabs';
import { Textarea } from '../components/Textarea';
import { Tooltip } from '../components/Tooltip';

describe('keyboard audit', () => {
  it('activates Button with Enter and Space', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    renderWithProviders(<Button onPress={onPress}>Publish</Button>);

    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: 'Publish' })).toHaveFocus();
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('moves through Input and Textarea with Tab order', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <div>
        <Input label="Email" />
        <Textarea label="Notes" />
      </div>,
    );

    await user.tab();
    expect(screen.getByLabelText('Email')).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Notes')).toHaveFocus();
  });

  it('toggles Checkbox from the keyboard', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Checkbox label="Enable alerts" />);

    await user.tab();
    await user.keyboard(' ');

    expect(screen.getByRole('checkbox', { name: 'Enable alerts' })).toBeChecked();
  });

  it('changes RadioGroup selection with arrow keys', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <RadioGroup label="Strategy" defaultValue="staged">
        <RadioGroup.Item value="staged">Staged</RadioGroup.Item>
        <RadioGroup.Item value="instant">Instant</RadioGroup.Item>
      </RadioGroup>,
    );

    await user.tab();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: 'Instant' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Instant' })).toBeChecked();
  });

  it('opens Tooltip on keyboard focus', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Tooltip content="Copy link" trigger="focus" delay={0} closeDelay={0}>
        <Button variant="secondary">Copy</Button>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('moves Tabs selection with keyboard arrows', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Project tabs">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">Overview panel</Tabs.Content>
        <Tabs.Content value="activity">Activity panel</Tabs.Content>
      </Tabs>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('keeps Breadcrumbs links keyboard reachable in sequence', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Breadcrumbs aria-label="Breadcrumb trail">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/projects">Projects</Breadcrumbs.Item>
        <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
      </Breadcrumbs>,
    );

    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveFocus();
  });

  it('supports keyboard activation for Pagination controls', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Pagination totalPages={3} defaultPage={1} showFirstLast={false} />);

    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
