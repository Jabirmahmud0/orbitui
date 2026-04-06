import { forwardRef, useMemo, useState } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';

function getRowValue(row, accessor) {
  if (typeof accessor === 'function') {
    return accessor(row);
  }

  return row?.[accessor];
}

function compareValues(left, right) {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return -1;
  }

  if (right == null) {
    return 1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function defaultFilter(row, columns, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return columns.some((column) => {
    const candidate = getRowValue(row, column.accessor ?? column.key);
    return String(candidate ?? '').toLowerCase().includes(normalizedQuery);
  });
}

/**
 * DataTable with client-side sorting, filtering, row selection, and lightweight row virtualization.
 */
export const DataTable = forwardRef(function DataTable(
  {
    columns = [],
    data = [],
    rowKey = 'id',
    sort,
    defaultSort = null,
    onSortChange,
    filterValue,
    defaultFilterValue = '',
    onFilterValueChange,
    filterPlaceholder = 'Filter rows',
    selectable = false,
    selectedRowIds,
    defaultSelectedRowIds = [],
    onSelectedRowIdsChange,
    emptyMessage = 'No rows available',
    loading = false,
    loadingMessage = 'Loading rows...',
    rowHeight = 52,
    visibleRowCount = 8,
    className,
    toolbarClassName,
    tableClassName,
    contentClassName,
  },
  forwardedRef,
) {
  const [sortState, setSortState] = useControllableState({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });
  const [query, setQuery] = useControllableState({
    value: filterValue,
    defaultValue: defaultFilterValue,
    onChange: onFilterValueChange,
  });
  const [selectedIds, setSelectedIds] = useControllableState({
    value: selectedRowIds,
    defaultValue: defaultSelectedRowIds,
    onChange: onSelectedRowIdsChange,
  });
  const [scrollTop, setScrollTop] = useState(0);
  const labelId = useId('orbit-table-label');
  const descriptionId = useId('orbit-table-description');
  const selectionSet = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);

  const filteredRows = useMemo(() => {
    if (!query?.trim()) {
      return data;
    }

    return data.filter((row) => defaultFilter(row, columns, query));
  }, [columns, data, query]);

  const sortedRows = useMemo(() => {
    if (!sortState?.column) {
      return filteredRows;
    }

    const activeColumn = columns.find((column) => column.key === sortState.column);
    if (!activeColumn) {
      return filteredRows;
    }

    const accessor = activeColumn.accessor ?? activeColumn.key;
    const direction = sortState.direction === 'desc' ? -1 : 1;

    return [...filteredRows].sort(
      (leftRow, rightRow) =>
        compareValues(getRowValue(leftRow, accessor), getRowValue(rightRow, accessor)) * direction,
    );
  }, [columns, filteredRows, sortState]);

  const rowIds = useMemo(
    () =>
      sortedRows.map((row, index) =>
        typeof rowKey === 'function' ? rowKey(row, index) : row?.[rowKey] ?? `${index}`,
      ),
    [rowKey, sortedRows],
  );

  const totalHeight = sortedRows.length * rowHeight;
  const viewportHeight = Math.min(sortedRows.length, visibleRowCount) * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endIndex = Math.min(sortedRows.length, startIndex + visibleRowCount + 4);
  const visibleRows = sortedRows.slice(startIndex, endIndex);
  const topSpacerHeight = startIndex * rowHeight;
  const bottomSpacerHeight = Math.max(0, totalHeight - topSpacerHeight - visibleRows.length * rowHeight);
  const allVisibleSelected = rowIds.length > 0 && rowIds.every((rowId) => selectionSet.has(rowId));

  const toggleSort = (column) => {
    if (!column.sortable) {
      return;
    }

    setSortState((currentSort) => {
      if (!currentSort || currentSort.column !== column.key) {
        return { column: column.key, direction: 'asc' };
      }

      if (currentSort.direction === 'asc') {
        return { column: column.key, direction: 'desc' };
      }

      return null;
    });
  };

  const toggleRowSelection = (rowId) => {
    setSelectedIds((currentSelection = []) =>
      currentSelection.includes(rowId)
        ? currentSelection.filter((currentId) => currentId !== rowId)
        : [...currentSelection, rowId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allVisibleSelected ? [] : rowIds);
  };

  return (
    <div ref={forwardedRef} className={cn('flex w-full flex-col gap-4', className)}>
      <div
        className={cn(
          'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
          toolbarClassName,
        )}
      >
        <div>
          <h3
            id={labelId}
            className="text-base font-semibold tracking-tight text-[var(--color-foreground-primary)]"
          >
            Data table
          </h3>
          <p
            id={descriptionId}
            className="text-sm leading-6 text-[var(--color-foreground-secondary)]"
          >
            Sort, scan, and filter structured data with keyboard-friendly controls.
          </p>
        </div>
        <label className="flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-3 py-2.5 shadow-sm md:w-80">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)]">
            Filter
          </span>
          <input
            type="text"
            value={query ?? ''}
            placeholder={filterPlaceholder}
            className="w-full bg-transparent text-sm text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted)]"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] shadow-sm',
          contentClassName,
        )}
      >
        <div className="overflow-x-auto">
          <table
            aria-describedby={descriptionId}
            aria-labelledby={labelId}
            className={cn('min-w-full border-collapse text-left', tableClassName)}
          >
            <thead className="bg-[var(--color-background-subtle)] text-xs uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)]">
              <tr>
                {selectable ? (
                  <th className="w-14 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      checked={allVisibleSelected}
                      className="h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-action-primary)]"
                      onChange={toggleSelectAll}
                    />
                  </th>
                ) : null}
                {columns.map((column) => {
                  const isSorted = sortState?.column === column.key;
                  const direction = isSorted ? sortState.direction : undefined;

                  return (
                    <th
                      key={column.key}
                      aria-sort={
                        direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                            ? 'descending'
                            : column.sortable
                              ? 'none'
                              : undefined
                      }
                      className={cn('px-4 py-3 font-semibold', column.headerClassName)}
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-left text-current transition hover:text-[var(--color-foreground-primary)] focus:outline-none focus-visible:text-[var(--color-foreground-primary)]"
                          onClick={() => toggleSort(column)}
                        >
                          <span>{column.header}</span>
                          <span aria-hidden="true" className="text-[10px]">
                            {direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}
                          </span>
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-sm text-[var(--color-foreground-muted)]">{loadingMessage}</div>
        ) : sortedRows.length === 0 ? (
          <div className="px-4 py-10 text-sm text-[var(--color-foreground-muted)]">{emptyMessage}</div>
        ) : (
          <div
            className="overflow-auto"
            style={{ maxHeight: viewportHeight || rowHeight }}
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <table className={cn('min-w-full border-collapse text-left', tableClassName)}>
              <tbody>
                {topSpacerHeight > 0 ? (
                  <tr aria-hidden="true" style={{ height: topSpacerHeight }}>
                    <td colSpan={columns.length + (selectable ? 1 : 0)} />
                  </tr>
                ) : null}
                {visibleRows.map((row, visibleIndex) => {
                  const rowIndex = startIndex + visibleIndex;
                  const rowId = rowIds[rowIndex];
                  const isSelected = selectionSet.has(rowId);

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        'border-t border-[var(--color-border-subtle)] text-sm text-[var(--color-foreground-primary)] transition',
                        isSelected && 'bg-[var(--color-background-subtle)]',
                      )}
                      style={{ height: rowHeight }}
                    >
                      {selectable ? (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={`Select row ${rowIndex + 1}`}
                            checked={isSelected}
                            className="h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-action-primary)]"
                            onChange={() => toggleRowSelection(rowId)}
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => {
                        const value = getRowValue(row, column.accessor ?? column.key);

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'px-4 py-3 align-middle text-[var(--color-foreground-secondary)]',
                              column.cellClassName,
                            )}
                          >
                            {column.render ? column.render(value, row, rowIndex) : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {bottomSpacerHeight > 0 ? (
                  <tr aria-hidden="true" style={{ height: bottomSpacerHeight }}>
                    <td colSpan={columns.length + (selectable ? 1 : 0)} />
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export default DataTable;
