import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Select } from './Select';

const groupedOptions = [
  {
    label: 'Workspace',
    options: [
      { label: 'Design', value: 'design' },
      { label: 'Engineering', value: 'engineering' },
    ],
  },
  {
    label: 'Support',
    options: [
      { label: 'Success', value: 'success' },
      { label: 'Operations', value: 'operations', disabled: true },
    ],
  },
];

describe('Select', () => {
  it('selects a single option and closes the listbox', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderWithProviders(
      <Select label="Team" options={[{ label: 'Design', value: 'design' }]} onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole('button', { name: /Team/i }));
    await user.click(screen.getByRole('option', { name: 'Design' }));

    expect(onValueChange).toHaveBeenCalledWith('design');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Team Design/i })).toBeInTheDocument();
  });

  it('supports grouped searchable options', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Select label="Department" groups={groupedOptions} searchable />);

    await user.click(screen.getByRole('button', { name: /Department/i }));

    expect(screen.getByRole('group', { name: 'Workspace' })).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), 'succ');

    expect(screen.getByRole('option', { name: 'Success' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Design' })).not.toBeInTheDocument();
  });

  it('supports multi-select without closing after each selection', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Select label="Tags" groups={groupedOptions} multiple />);

    await user.click(screen.getByRole('button', { name: /Tags/i }));
    await user.click(screen.getByRole('option', { name: 'Design' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Engineering' }));

    expect(screen.getByRole('button', { name: /Tags Design, Engineering/i })).toBeInTheDocument();
  });

  it('supports listbox keyboard navigation and escape dismissal', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Select label="Department" groups={groupedOptions} />);

    const trigger = screen.getByRole('button', { name: /Department/i });
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    const firstOption = screen.getByRole('option', { name: 'Design' });

    firstOption.focus();
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });

    expect(screen.getByRole('option', { name: 'Engineering' })).toHaveFocus();

    fireEvent.keyDown(listbox, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <Select label="Accessible team" groups={groupedOptions} searchable />,
    );

    await user.click(screen.getByRole('button', { name: /Accessible team/i }));

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
