import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { CommandPalette } from './CommandPalette';

const commands = [
  {
    id: 'deploy',
    label: 'Deploy preview',
    description: 'Build and ship a preview deployment.',
    group: 'Actions',
    keywords: ['release', 'vercel'],
  },
  {
    id: 'invite',
    label: 'Invite teammate',
    description: 'Add a collaborator to the workspace.',
    group: 'People',
    keywords: ['members', 'access'],
  },
  {
    id: 'billing',
    label: 'Open billing',
    description: 'Manage invoices and plan settings.',
    group: 'Settings',
    disabled: true,
  },
];

describe('CommandPalette', () => {
  it('opens from the global keyboard shortcut', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CommandPalette items={commands} />);

    await user.keyboard('{Control>}k{/Control}');

    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search commands...')).toHaveFocus();
  });

  it('filters commands and invokes selection callbacks', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onCommandSelect = vi.fn();

    renderWithProviders(
      <CommandPalette
        items={commands.map((item) =>
          item.id === 'deploy' ? { ...item, onSelect: onCommandSelect } : item,
        )}
        defaultOpen
        onSelect={onSelect}
      />,
    );

    await user.type(screen.getByPlaceholderText('Search commands...'), 'deploy');
    await user.click(screen.getByRole('option', { name: /deploy preview/i }));

    expect(onCommandSelect).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'deploy' }));
  });

  it('supports keyboard navigation and returns focus to the input on escape', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CommandPalette items={commands} defaultOpen />);

    const input = screen.getByPlaceholderText('Search commands...');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /deploy preview/i })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /invite teammate/i })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(input).toHaveFocus();
  });

  it('ignores disabled commands and renders empty states', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithProviders(<CommandPalette items={commands} defaultOpen onSelect={onSelect} />);

    await user.click(screen.getByRole('option', { name: /open billing/i }));
    expect(onSelect).not.toHaveBeenCalled();

    await user.clear(screen.getByPlaceholderText('Search commands...'));
    await user.type(screen.getByPlaceholderText('Search commands...'), 'missing');
    expect(screen.getByText('No matching commands')).toBeInTheDocument();
  });

  it('opens from the trigger and closes on outside interaction', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CommandPalette items={commands} showTrigger triggerLabel="Jump anywhere" />);

    await user.click(screen.getByRole('button', { name: /jump anywhere/i }));
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();
  });

  it('respects hotkey opt-out and supports shortcut toggling closed', async () => {
    const user = userEvent.setup();

    const { rerender } = renderWithProviders(<CommandPalette items={commands} enableHotkey={false} />);

    await user.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();

    rerender(<CommandPalette items={commands} />);

    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();

    await user.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<CommandPalette items={commands} defaultOpen />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
