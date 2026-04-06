import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { DataTable } from './DataTable';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'score', header: 'Score', sortable: true },
];

const rows = [
  { id: '1', name: 'Ari Lane', role: 'Designer', score: 82 },
  { id: '2', name: 'Maya Chen', role: 'Engineer', score: 97 },
  { id: '3', name: 'Jules Park', role: 'Support', score: 76 },
  { id: '4', name: 'Nia Cole', role: 'Engineer', score: 89 },
  { id: '5', name: 'Omar Ali', role: 'Operations', score: 91 },
  { id: '6', name: 'Pia West', role: 'Engineer', score: 73 },
];

describe('DataTable', () => {
  it('filters rows from the toolbar query input', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DataTable columns={columns} data={rows} />);

    await user.type(screen.getByPlaceholderText('Filter rows'), 'Maya');

    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.queryByText('Ari Lane')).not.toBeInTheDocument();
  });

  it('sorts rows by sortable headers and cycles sorting state', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DataTable columns={columns} data={rows.slice(0, 4)} />);

    const scoreHeader = screen.getByRole('button', { name: /score/i });

    await user.click(scoreHeader);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Jules Park');

    await user.click(scoreHeader);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Maya Chen');

    await user.click(scoreHeader);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ari Lane');
  });

  it('supports row selection and select-all behavior', async () => {
    const user = userEvent.setup();
    const onSelectedRowIdsChange = vi.fn();

    renderWithProviders(
      <DataTable
        columns={columns}
        data={rows.slice(0, 3)}
        selectable
        onSelectedRowIdsChange={onSelectedRowIdsChange}
      />,
    );

    await user.click(screen.getByLabelText('Select row 1'));
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(['1']);

    await user.click(screen.getByLabelText('Select all rows'));
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(['1', '2', '3']);
  });

  it('renders virtualized windows for longer datasets', () => {
    const longRows = Array.from({ length: 24 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Person ${index + 1}`,
      role: index % 2 === 0 ? 'Engineer' : 'Support',
      score: 70 + index,
    }));

    renderWithProviders(
      <DataTable columns={columns} data={longRows} visibleRowCount={3} rowHeight={40} />,
    );

    const viewport = screen.getByText('Person 1').closest('table').parentElement;

    expect(screen.queryByText('Person 18')).not.toBeInTheDocument();

    fireEvent.scroll(viewport, { target: { scrollTop: 640 } });

    expect(screen.getByText('Person 18')).toBeInTheDocument();
  });

  it('renders loading and empty states', () => {
    const { rerender } = renderWithProviders(
      <DataTable columns={columns} data={[]} loading loadingMessage="Fetching metrics..." />,
    );

    expect(screen.getByText('Fetching metrics...')).toBeInTheDocument();

    rerender(<DataTable columns={columns} data={[]} emptyMessage="Nothing found" />);
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(
      <DataTable columns={columns} data={rows.slice(0, 4)} selectable />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
