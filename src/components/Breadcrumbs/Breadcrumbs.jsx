import { Children, cloneElement, forwardRef, isValidElement, useMemo, useRef } from 'react';
import { useBreadcrumbItem, useBreadcrumbs } from 'react-aria';

import { cn } from '../../utils/cn';
import { createSafeContext } from '../../utils/createContext';

const [BreadcrumbsProvider, useBreadcrumbsContext] = createSafeContext('Breadcrumbs');

function getVisibleItems(children, maxItems, itemsBeforeCollapse, itemsAfterCollapse) {
  const items = Children.toArray(children).filter(Boolean);

  if (!maxItems || items.length <= maxItems) {
    return items;
  }

  const safeBefore = Math.max(1, itemsBeforeCollapse);
  const safeAfter = Math.max(1, itemsAfterCollapse);
  const visibleCount = safeBefore + safeAfter + 1;

  if (visibleCount >= items.length) {
    return items;
  }

  return [
    ...items.slice(0, safeBefore),
    { __breadcrumbEllipsis: true },
    ...items.slice(items.length - safeAfter),
  ];
}

/**
 * Semantic breadcrumbs navigation with optional middle collapsing.
 *
 * @param {object} props
 * @param {string} [props['aria-label']]
 * @param {import('react').ReactNode} [props.separator='/']
 * @param {number} [props.maxItems]
 * @param {number} [props.itemsBeforeCollapse=1]
 * @param {number} [props.itemsAfterCollapse=1]
 * @param {import('react').ReactNode} [props.ellipsis='...']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const BreadcrumbsRoot = forwardRef(function Breadcrumbs(
  {
    children,
    separator = '/',
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    ellipsis = '...',
    className,
    ...restProps
  },
  forwardedRef,
) {
  const { navProps } = useBreadcrumbs(restProps);
  const visibleItems = getVisibleItems(children, maxItems, itemsBeforeCollapse, itemsAfterCollapse);
  const contextValue = useMemo(() => ({ separator }), [separator]);

  return (
    <BreadcrumbsProvider value={contextValue}>
      <nav {...navProps} ref={forwardedRef} className={cn('w-full', className)}>
        <ol className="flex flex-wrap items-center gap-y-2 text-sm text-[var(--color-foreground-muted)]">
          {visibleItems.map((item, index) => {
            const isLastVisible = index === visibleItems.length - 1;

            if (item && item.__breadcrumbEllipsis) {
              return (
                <li key={`ellipsis-${index}`} className="inline-flex items-center">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center px-2 text-[var(--color-foreground-muted)]"
                  >
                    {ellipsis}
                  </span>
                  {!isLastVisible ? (
                    <span aria-hidden="true" className="px-2 text-[var(--color-foreground-muted)]">
                      {separator}
                    </span>
                  ) : null}
                </li>
              );
            }

            if (!isValidElement(item)) {
              return null;
            }

            return cloneElement(item, {
              key: item.key ?? `breadcrumb-${index}`,
              isLastVisible,
            });
          })}
        </ol>
      </nav>
    </BreadcrumbsProvider>
  );
});

/**
 * Individual breadcrumb item.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.isCurrent]
 * @param {boolean} [props.isDisabled]
 * @param {string} [props.href]
 * @param {keyof JSX.IntrinsicElements} [props.as='a']
 * @param {string} [props.className]
 * @param {boolean} [props.isLastVisible]
 * @returns {import('react').ReactElement}
 */
const BreadcrumbsItem = forwardRef(function BreadcrumbsItem(
  {
    children,
    isCurrent,
    isDisabled,
    href,
    as = 'a',
    className,
    isLastVisible = false,
    ...restProps
  },
  forwardedRef,
) {
  const { separator } = useBreadcrumbsContext();
  const itemRef = useRef(null);
  const { itemProps } = useBreadcrumbItem(
    {
      ...restProps,
      href,
      isDisabled,
      isCurrent: isCurrent ?? isLastVisible,
      elementType: as,
    },
    itemRef,
  );
  const Component = as;
  const resolvedCurrent = isCurrent ?? isLastVisible;

  return (
    <li className="inline-flex items-center">
      <Component
        {...itemProps}
        {...restProps}
        ref={(node) => {
          itemRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        href={Component === 'a' ? href : undefined}
        className={cn(
          'inline-flex items-center rounded-[var(--radius-sm)] px-2 py-1 transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)]',
          resolvedCurrent
            ? 'font-medium text-[var(--color-foreground-primary)]'
            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground-primary)]',
          isDisabled ? 'cursor-not-allowed opacity-50' : '',
          className,
        )}
      >
        {children}
      </Component>

      {!isLastVisible ? (
        <span aria-hidden="true" className="px-2 text-[var(--color-foreground-muted)]">
          {separator}
        </span>
      ) : null}
    </li>
  );
});

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
});

export { BreadcrumbsItem };
export default Breadcrumbs;
