import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';

function normalizeItems(items = []) {
  return items.map((item, index) => ({
    id: item.id ?? `command-${index}`,
    keywords: item.keywords ?? [],
    group: item.group ?? 'Suggestions',
    ...item,
  }));
}

function matchesItem(item, query) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const haystack = [item.label, item.group, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

/**
 * Command palette with global shortcut support, grouped actions, and keyboard-first navigation.
 */
export const CommandPalette = forwardRef(function CommandPalette(
  {
    items = [],
    open,
    defaultOpen = false,
    onOpenChange,
    placeholder = 'Search commands...',
    emptyMessage = 'No matching commands',
    label = 'Command palette',
    description = 'Search and run actions across the workspace.',
    enableHotkey = true,
    showTrigger = false,
    triggerLabel = 'Open command palette',
    footer,
    onSelect,
    className,
    overlayClassName,
    contentClassName,
    inputClassName,
  },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);
  const titleId = useId('orbit-command-title');
  const descriptionId = useId('orbit-command-description');
  const listId = useId('orbit-command-list');

  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const filteredItems = useMemo(
    () => normalizedItems.filter((item) => matchesItem(item, query)),
    [normalizedItems, query],
  );
  const groupedItems = useMemo(() => {
    const nextGroups = new Map();

    filteredItems.forEach((item) => {
      if (!nextGroups.has(item.group)) {
        nextGroups.set(item.group, []);
      }

      nextGroups.get(item.group).push(item);
    });

    return Array.from(nextGroups.entries()).map(([group, groupItems]) => ({
      group,
      items: groupItems,
    }));
  }, [filteredItems]);

  const resolvedActiveIndex =
    filteredItems.length === 0 ? -1 : Math.min(activeIndex, filteredItems.length - 1);

  const openPalette = () => {
    setQuery('');
    setActiveIndex(0);
    setIsOpen(true);
  };

  const closePalette = () => {
    setIsOpen(false);
  };

  const focusItemAtIndex = (index) => {
    if (index < 0 || index >= filteredItems.length) {
      return;
    }

    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  };

  const moveActiveIndex = (direction) => {
    if (filteredItems.length === 0) {
      return;
    }

    const startIndex = resolvedActiveIndex >= 0 ? resolvedActiveIndex : direction > 0 ? -1 : 0;
    const nextIndex = (startIndex + direction + filteredItems.length) % filteredItems.length;
    focusItemAtIndex(nextIndex);
  };

  const handleSelect = (item) => {
    if (item.disabled) {
      return;
    }

    item.onSelect?.(item);
    onSelect?.(item);
    closePalette();
  };

  useEffect(() => {
    if (!enableHotkey) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (isShortcut) {
        event.preventDefault();

        if (isOpen) {
          setIsOpen(false);
        } else {
          setQuery('');
          setActiveIndex(0);
          setIsOpen(true);
        }
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableHotkey, isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div ref={forwardedRef} className={cn('contents', className)}>
      {showTrigger ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground-primary)] shadow-sm transition hover:bg-[var(--color-background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          onClick={openPalette}
        >
          <span>{triggerLabel}</span>
          <span className="text-xs tracking-[0.12em] text-[var(--color-foreground-tertiary)]">Ctrl K</span>
        </button>
      ) : null}

      {isOpen ? (
        <div
          className={cn(
            'fixed inset-0 z-[70] flex items-start justify-center bg-[color:rgb(15_23_42_/_0.58)] px-4 py-8 backdrop-blur-[4px] sm:py-16',
            overlayClassName,
          )}
        >
          <div
            ref={rootRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={cn(
              'flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] shadow-2xl',
              contentClassName,
            )}
          >
            <div className="border-b border-[var(--color-border-subtle)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id={titleId} className="text-lg font-semibold tracking-tight text-[var(--color-foreground-primary)]">
                    {label}
                  </h2>
                  <p id={descriptionId} className="mt-1 text-sm text-[var(--color-foreground-secondary)]">
                    {description}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close command palette"
                  className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)] transition hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground-primary)]"
                  onClick={closePalette}
                >
                  Esc
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-foreground-tertiary)]">
                  Go to
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  placeholder={placeholder}
                  value={query}
                  className={cn(
                    'w-full bg-transparent text-sm text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted)]',
                    inputClassName,
                  )}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusItemAtIndex(0);
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusItemAtIndex(filteredItems.length - 1);
                    }

                    if (event.key === 'Home') {
                      event.preventDefault();
                      focusItemAtIndex(0);
                    }

                    if (event.key === 'End') {
                      event.preventDefault();
                      focusItemAtIndex(filteredItems.length - 1);
                    }

                    if (event.key === 'Enter' && filteredItems[resolvedActiveIndex]) {
                      event.preventDefault();
                      handleSelect(filteredItems[resolvedActiveIndex]);
                    }

                    if (event.key === 'Escape') {
                      event.preventDefault();
                      event.stopPropagation();
                      closePalette();
                    }
                  }}
                />
              </div>
            </div>

            <div id={listId} role="listbox" className="max-h-[24rem] overflow-y-auto px-3 py-3">
              {groupedItems.length > 0 ? (
                groupedItems.map((group) => (
                  <div key={group.group} className="py-2">
                    <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)]">
                      {group.group}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const itemIndex = filteredItems.findIndex((candidate) => candidate.id === item.id);
                        const isActive = itemIndex === resolvedActiveIndex;

                        return (
                          <button
                            key={item.id}
                            ref={(element) => {
                              itemRefs.current[itemIndex] = element;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            aria-disabled={item.disabled || undefined}
                            disabled={item.disabled}
                            className={cn(
                              'flex w-full items-center justify-between gap-4 rounded-[var(--radius-lg)] px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-45',
                              isActive
                                ? 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-primary)]'
                                : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground-primary)]',
                            )}
                            onClick={() => handleSelect(item)}
                            onFocus={() => setActiveIndex(itemIndex)}
                            onKeyDown={(event) => {
                              if (event.key === 'ArrowDown') {
                                event.preventDefault();
                                moveActiveIndex(1);
                              }

                              if (event.key === 'ArrowUp') {
                                event.preventDefault();
                                moveActiveIndex(-1);
                              }

                              if (event.key === 'Home') {
                                event.preventDefault();
                                focusItemAtIndex(0);
                              }

                              if (event.key === 'End') {
                                event.preventDefault();
                                focusItemAtIndex(filteredItems.length - 1);
                              }

                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleSelect(item);
                              }

                              if (event.key === 'Escape') {
                                event.preventDefault();
                                event.stopPropagation();
                                inputRef.current?.focus();
                              }
                            }}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">{item.label}</div>
                              {item.description ? (
                                <div className="mt-1 truncate text-xs text-[var(--color-foreground-tertiary)]">
                                  {item.description}
                                </div>
                              ) : null}
                            </div>
                            {item.shortcut ? (
                              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-foreground-tertiary)]">
                                {item.shortcut}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-sm text-[var(--color-foreground-muted)]">{emptyMessage}</div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-5 py-3 text-xs text-[var(--color-foreground-tertiary)]">
              <span>{footer ?? 'Use arrow keys to navigate and Enter to run a command.'}</span>
              <span>Cmd/Ctrl + K</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default CommandPalette;
