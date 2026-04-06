import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

function normalizeGroups(options = [], groups = []) {
  if (groups.length > 0) {
    return groups.map((group) => ({
      label: group.label,
      options: group.options ?? [],
    }));
  }

  const groupedOptions = new Map();

  options.forEach((option) => {
    const key = option.group ?? '__ungrouped__';

    if (!groupedOptions.has(key)) {
      groupedOptions.set(key, []);
    }

    groupedOptions.get(key).push(option);
  });

  return Array.from(groupedOptions.entries()).map(([label, groupOptions]) => ({
    label: label === '__ungrouped__' ? null : label,
    options: groupOptions,
  }));
}

function getOptionLabel(option) {
  if (!option) {
    return '';
  }

  return option.label ?? String(option.value ?? '');
}

function isValueSelected(optionValue, value, multiple) {
  if (multiple) {
    return Array.isArray(value) && value.includes(optionValue);
  }

  return value === optionValue;
}

/**
 * Advanced Select field with grouped options, optional search, and multi-select mode.
 */
export const Select = forwardRef(function Select(
  {
    options = [],
    groups = [],
    multiple = false,
    searchable = false,
    value,
    defaultValue,
    onValueChange,
    label,
    helperText,
    errorMessage,
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search options',
    emptyMessage = 'No matching options',
    className,
    triggerClassName,
    contentClassName,
  },
  forwardedRef,
) {
  const normalizedGroups = useMemo(() => normalizeGroups(options, groups), [options, groups]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange: onValueChange,
  });
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listboxRef = useRef(null);
  const labelId = useId('orbit-select-label');
  const helperId = useId('orbit-select-helper');
  const errorId = useId('orbit-select-error');
  const listboxId = useId('orbit-select-listbox');

  const filteredGroups = useMemo(() => {
    if (!searchable || !query.trim()) {
      return normalizedGroups;
    }

    const normalizedQuery = query.trim().toLowerCase();

    return normalizedGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          getOptionLabel(option).toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [normalizedGroups, query, searchable]);

  const allOptions = useMemo(() => normalizedGroups.flatMap((group) => group.options), [normalizedGroups]);

  const selectedOptions = useMemo(() => {
    if (multiple) {
      const selectedValues = Array.isArray(selectedValue) ? selectedValue : [];
      return selectedValues
        .map((currentValue) => allOptions.find((option) => option.value === currentValue))
        .filter(Boolean);
    }

    return [allOptions.find((option) => option.value === selectedValue)].filter(Boolean);
  }, [allOptions, multiple, selectedValue]);

  const closeMenu = () => {
    setIsOpen(false);
    setQuery('');
  };

  const openMenu = () => {
    setQuery('');
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (searchable) {
      searchRef.current?.focus();
    } else {
      const firstSelected = listboxRef.current?.querySelector('[aria-selected="true"]');
      firstSelected?.focus();
      if (!firstSelected) {
        listboxRef.current?.querySelector('[role="option"]')?.focus();
      }
    }

    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) {
        return;
      }

      closeMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, searchable]);

  const helperMessage = !isInvalid ? helperText : null;
  const describedBy = isInvalid && errorMessage ? errorId : helperMessage ? helperId : undefined;

  const handleSelect = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const nextValues = currentValues.includes(optionValue)
        ? currentValues.filter((item) => item !== optionValue)
        : [...currentValues, optionValue];

      setSelectedValue(nextValues);
      return;
    }

    setSelectedValue(optionValue);
    closeMenu();
    triggerRef.current?.focus();
  };

  const triggerText =
    selectedOptions.length > 0
      ? selectedOptions.map((option) => getOptionLabel(option)).join(', ')
      : placeholder;

  return (
    <div ref={rootRef} className={cn('relative flex w-full flex-col gap-2', className)}>
      {label ? (
        <label
          id={labelId}
          className="text-sm font-medium tracking-[0.01em] text-[var(--color-foreground-primary)]"
        >
          {label}
          {isRequired ? <span className="ml-1 text-[var(--color-status-danger)]">*</span> : null}
        </label>
      ) : null}

      <button
        ref={composeRefs(forwardedRef, triggerRef)}
        type="button"
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${labelId} ${listboxId}-value` : `${listboxId}-value`}
        aria-controls={isOpen ? listboxId : undefined}
        disabled={isDisabled}
        className={cn(
          'flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border bg-[var(--color-background-surface)] px-3 py-2.5 text-left shadow-sm transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)] disabled:cursor-not-allowed disabled:opacity-60',
          isInvalid
            ? 'border-[var(--color-status-danger)] focus-visible:ring-[var(--color-status-danger)]'
            : 'border-[var(--color-border-default)] focus-visible:ring-[var(--color-focus-ring)]',
          triggerClassName,
        )}
        onClick={() => {
          if (!isDisabled) {
            if (isOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }
        }}
        onKeyDown={(event) => {
          if (isDisabled) {
            return;
          }

          if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
            openMenu();
          }
        }}
      >
        <span
          id={`${listboxId}-value`}
          className={cn(
            'min-w-0 flex-1 truncate text-sm',
            selectedOptions.length > 0
              ? 'text-[var(--color-foreground-primary)]'
              : 'text-[var(--color-foreground-muted)]',
          )}
        >
          {triggerText}
        </span>
        <span aria-hidden="true" className="shrink-0 text-[var(--color-foreground-muted)]">
          {isOpen ? '^' : 'v'}
        </span>
      </button>

      {isOpen ? (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] shadow-2xl',
            contentClassName,
          )}
        >
          {searchable ? (
            <div className="border-b border-[var(--color-border-subtle)] p-2">
              <input
                ref={searchRef}
                type="text"
                role="searchbox"
                value={query}
                placeholder={searchPlaceholder}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] px-3 py-2 text-sm text-[var(--color-foreground-primary)] outline-none focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    listboxRef.current?.querySelector('[role="option"]')?.focus();
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    closeMenu();
                    triggerRef.current?.focus();
                  }
                }}
              />
            </div>
          ) : null}

          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-multiselectable={multiple || undefined}
            tabIndex={-1}
            className="max-h-72 overflow-y-auto p-2"
            onKeyDown={(event) => {
              const optionElements = Array.from(
                listboxRef.current?.querySelectorAll('[role="option"]') ?? [],
              );
              const activeIndex = optionElements.findIndex((element) => element === document.activeElement);

              if (event.key === 'ArrowDown') {
                event.preventDefault();
                optionElements[(activeIndex + 1 + optionElements.length) % optionElements.length]?.focus();
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                optionElements[(activeIndex - 1 + optionElements.length) % optionElements.length]?.focus();
              }

              if (event.key === 'Home') {
                event.preventDefault();
                optionElements[0]?.focus();
              }

              if (event.key === 'End') {
                event.preventDefault();
                optionElements[optionElements.length - 1]?.focus();
              }

              if (event.key === 'Escape' || event.key === 'Tab') {
                event.preventDefault();
                closeMenu();
                triggerRef.current?.focus();
              }
            }}
          >
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, groupIndex) => (
                <div
                  key={`${group.label ?? 'group'}-${groupIndex}`}
                  role="group"
                  aria-labelledby={group.label ? `${listboxId}-group-${groupIndex}` : undefined}
                  className="py-1"
                >
                  {group.label ? (
                    <div
                      id={`${listboxId}-group-${groupIndex}`}
                      className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)]"
                    >
                      {group.label}
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    {group.options.map((option) => {
                      const isSelected = isValueSelected(option.value, selectedValue, multiple);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={option.disabled}
                          tabIndex={0}
                          className={cn(
                            'flex min-h-10 w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
                            isSelected
                              ? 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-primary)]'
                              : 'text-[var(--color-foreground-primary)] hover:bg-[var(--color-background-subtle)]',
                            option.disabled && 'cursor-not-allowed opacity-50',
                          )}
                          onClick={() => {
                            if (!option.disabled) {
                              handleSelect(option.value);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              if (!option.disabled) {
                                handleSelect(option.value);
                              }
                            }
                          }}
                        >
                          <span className="flex-1">{getOptionLabel(option)}</span>
                          {isSelected ? <span aria-hidden="true">x</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-sm text-[var(--color-foreground-muted)]">{emptyMessage}</div>
            )}
          </div>
        </div>
      ) : null}

      {isInvalid && errorMessage ? (
        <p id={errorId} className="text-sm leading-6 text-[var(--color-status-danger)]">
          {errorMessage}
        </p>
      ) : null}

      {helperMessage ? (
        <p id={helperId} className="text-sm leading-6 text-[var(--color-foreground-muted)]">
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
