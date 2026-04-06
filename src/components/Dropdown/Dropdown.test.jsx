import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../test/setup';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('opens from the trigger and closes after item selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithProviders(
      <Dropdown>
        <Dropdown.Trigger>Open menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Profile</Dropdown.Item>
          <Dropdown.Item>Billing</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Profile' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports grouped sections and keyboard navigation', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Workspace menu</Dropdown.Label>
          <Dropdown.Section title="Account">
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item isDisabled>Team</Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Separator />
          <Dropdown.Section title="Danger zone">
            <Dropdown.Item tone="danger">Delete workspace</Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Content>
      </Dropdown>,
    );

    const menu = screen.getByRole('menu', { name: 'Workspace menu' });

    expect(screen.getByRole('group', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Delete workspace' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'Home' });

    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
  });

  it('closes on outside interaction and returns focus on escape', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Dropdown>
        <Dropdown.Trigger>More</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Settings</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'More' });

    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
