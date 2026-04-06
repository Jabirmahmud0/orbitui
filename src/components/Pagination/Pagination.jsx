import { forwardRef, useMemo } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

function clampPage(page, totalPages) {
  return Math.min(Math.max(page, 1), totalPages);
}

function getPaginationItems(currentPage, totalPages, siblingCount) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1);

    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    const start = totalPages - rightItemCount + 1;
    const rightRange = Array.from({ length: rightItemCount }, (_, index) => start + index);

    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, index) => leftSiblingIndex + index,
  );

  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

/**
 * Accessible pagination control with controlled/uncontrolled state and ellipsis handling.
 *
 * @param {object} props
 * @param {number} props.totalPages
 * @param {number} [props.page]
 * @param {number} [props.defaultPage=1]
 * @param {(page: number) => void} [props.onPageChange]
 * @param {number} [props.siblingCount=1]
 * @param {boolean} [props.showFirstLast=true]
 * @param {boolean} [props.isDisabled=false]
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
export const Pagination = forwardRef(function Pagination(
  {
    totalPages,
    page,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    isDisabled = false,
    className,
    ...restProps
  },
  forwardedRef,
) {
  const safeTotalPages = Math.max(1, totalPages);
  const [currentPage, setCurrentPage] = useControllableState({
    value: page,
    defaultValue: clampPage(defaultPage, safeTotalPages),
    onChange: onPageChange,
  });
  const resolvedPage = clampPage(currentPage ?? 1, safeTotalPages);
  const pageItems = useMemo(
    () => getPaginationItems(resolvedPage, safeTotalPages, siblingCount),
    [resolvedPage, safeTotalPages, siblingCount],
  );

  const goToPage = (nextPage) => {
    if (!isDisabled) {
      setCurrentPage(clampPage(nextPage, safeTotalPages));
    }
  };

  const buttonBaseClassName =
    'inline-flex min-w-10 items-center justify-center rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium tracking-[0.01em] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)]';

  return (
    <nav
      {...restProps}
      ref={forwardedRef}
      aria-label="Pagination"
      className={cn('w-full', className)}
    >
      <ul className="flex flex-wrap items-center gap-2">
        {showFirstLast ? (
          <li>
            <button
              type="button"
              aria-label="Go to first page"
              disabled={isDisabled || resolvedPage === 1}
              className={cn(
                buttonBaseClassName,
                'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onClick={() => goToPage(1)}
            >
              First
            </button>
          </li>
        ) : null}

        <li>
          <button
            type="button"
            aria-label="Go to previous page"
            disabled={isDisabled || resolvedPage === 1}
            className={cn(
              buttonBaseClassName,
              'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] disabled:cursor-not-allowed disabled:opacity-50',
            )}
            onClick={() => goToPage(resolvedPage - 1)}
          >
            Prev
          </button>
        </li>

        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`}>
                <span
                  aria-hidden="true"
                  className="inline-flex min-w-10 items-center justify-center px-1 text-sm text-[var(--color-foreground-muted)]"
                >
                  ...
                </span>
              </li>
            );
          }

          const isCurrent = item === resolvedPage;

          return (
            <li key={item}>
              <button
                type="button"
                aria-label={`Go to page ${item}`}
                aria-current={isCurrent ? 'page' : undefined}
                disabled={isDisabled}
                className={cn(
                  buttonBaseClassName,
                  isCurrent
                    ? 'border-transparent bg-[var(--color-action-primary)] text-[var(--color-foreground-inverse)] shadow-sm'
                    : 'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-background-subtle)]',
                  isDisabled ? 'cursor-not-allowed opacity-50' : '',
                )}
                onClick={() => goToPage(item)}
              >
                {item}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            aria-label="Go to next page"
            disabled={isDisabled || resolvedPage === safeTotalPages}
            className={cn(
              buttonBaseClassName,
              'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] disabled:cursor-not-allowed disabled:opacity-50',
            )}
            onClick={() => goToPage(resolvedPage + 1)}
          >
            Next
          </button>
        </li>

        {showFirstLast ? (
          <li>
            <button
              type="button"
              aria-label="Go to last page"
              disabled={isDisabled || resolvedPage === safeTotalPages}
              className={cn(
                buttonBaseClassName,
                'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onClick={() => goToPage(safeTotalPages)}
            >
              Last
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
});

export default Pagination;
