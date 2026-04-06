import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Pagination } from './Pagination';

function renderPagination(props = {}) {
  return renderWithProviders(<Pagination totalPages={12} defaultPage={6} {...props} />);
}

describe('Pagination', () => {
  it('renders a pagination navigation landmark', () => {
    renderPagination();

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Go to page 6' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('changes the page when a numbered button is clicked', async () => {
    const user = userEvent.setup();

    renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to page 7' }));

    expect(screen.getByRole('button', { name: 'Go to page 7' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('supports controlled page changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderPagination({ page: 4, onPageChange });

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('renders ellipsis when the range is truncated', () => {
    renderWithProviders(<Pagination totalPages={24} defaultPage={12} siblingCount={1} />);

    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('can hide first and last controls', () => {
    renderPagination({ showFirstLast: false });

    expect(screen.queryByRole('button', { name: 'Go to first page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to last page' })).not.toBeInTheDocument();
  });

  it('disables boundary navigation at the first page', () => {
    renderPagination({ defaultPage: 1 });

    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeDisabled();
  });

  it('disables all controls when the component is disabled', () => {
    renderPagination({ isDisabled: true });

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = renderPagination();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
