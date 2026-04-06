import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Combobox } from './Combobox';

const people = Array.from({ length: 20 }, (_, index) => ({
  label: `Person ${index + 1}`,
  value: `person-${index + 1}`,
}));

describe('Combobox', () => {
  it('filters options with type-ahead and commits a selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderWithProviders(
      <Combobox label="Assignee" options={people.slice(0, 4)} onValueChange={onValueChange} />,
    );

    const input = screen.getByRole('combobox', { name: 'Assignee' });

    await user.click(input);
    await user.type(input, '3');
    await user.click(screen.getByRole('option', { name: 'Person 3' }));

    expect(onValueChange).toHaveBeenCalledWith('person-3');
    expect(input).toHaveValue('Person 3');
  });

  it('loads async options and resolves remote results', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (query) =>
      people.filter((person) => person.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
    );

    renderWithProviders(<Combobox label="Remote" loadOptions={loadOptions} />);

    const input = screen.getByRole('combobox', { name: 'Remote' });

    await user.click(input);
    await user.type(input, 'person 1');

    await waitFor(() => {
      expect(loadOptions).toHaveBeenCalled();
      expect(screen.getByRole('option', { name: 'Person 1' })).toBeInTheDocument();
    });
  });

  it('renders a virtualized window for long option lists', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Combobox label="People" options={people} visibleCount={4} itemHeight={40} />,
    );

    const input = screen.getByRole('combobox', { name: 'People' });

    await user.click(input);

    expect(screen.getByRole('option', { name: 'Person 1' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Person 12' })).not.toBeInTheDocument();
  });

  it('supports keyboard navigation, escape dismissal, and returning focus to the input', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Combobox label="Navigate" options={people.slice(0, 3)} />);

    const input = screen.getByRole('combobox', { name: 'Navigate' });

    await user.click(input);
    await user.keyboard('{ArrowDown}');

    const firstOption = screen.getByRole('option', { name: 'Person 1' });
    firstOption.focus();

    fireEvent.keyDown(firstOption, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Person 2' })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('option', { name: 'Person 2' }), { key: 'ArrowUp' });
    expect(firstOption).toHaveFocus();

    fireEvent.keyDown(firstOption, { key: 'ArrowUp' });
    expect(input).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows empty states, respects disabled options, and has no accessibility violations', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = renderWithProviders(
      <Combobox
        label="Accessible"
        options={[
          { label: 'Available', value: 'available' },
          { label: 'Blocked', value: 'blocked', disabled: true },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Accessible' });

    await user.click(input);
    await user.type(input, 'zzz');
    expect(screen.getByText('No matching options')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '' } });
    await user.click(screen.getByRole('option', { name: 'Blocked' }));
    expect(onValueChange).not.toHaveBeenCalled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
