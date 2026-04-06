import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

function normalizeOptions(options = []) {
  return options.map((option) => ({
    ...option,
    label: option.label ?? String(option.value ?? ''),
  }));
}

function defaultFilter(option, query) {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

/**
 * Combobox with type-ahead filtering, optional async loading, and lightweight windowed rendering.
 */
export const Combobox = forwardRef(function Combobox(
  {
    options = [],
    value,
    defaultValue,
    onValueChange,
    inputValue,
    defaultInputValue = '',
    onInputValueChange,
    loadOptions,
    filterOptions = defaultFilter,
    label,
    helperText,
    errorMessage,
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    placeholder = 'Search options',
    emptyMessage = 'No matching options',
    loadingMessage = 'Loading options...',
    itemHeight = 44,
    visibleCount = 6,
    className,
    inputClassName,
    contentClassName,
  },
  forwardedRef,
) {
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [currentInputValue, setCurrentInputValue] = useControllableState({
    value: inputValue,
    defaultValue: defaultInputValue,
    onChange: onInputValueChange,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const labelId = useId('orbit-combobox-label');
  const helperId = useId('orbit-combobox-helper');
  const errorId = useId('orbit-combobox-error');
  const listboxId = useId('orbit-combobox-listbox');

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const activeOptions = loadOptions ? asyncOptions : normalizedOptions;

  useEffect(() => {
    if (!loadOptions) {
      return undefined;
    }

    let isActive = true;

    Promise.resolve(loadOptions(currentInputValue ?? ''))
      .then((results) => {
        if (isActive) {
          setAsyncOptions(normalizeOptions(results ?? []));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [currentInputValue, loadOptions]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (loadOptions) {
      return activeOptions;
    }

    const query = (currentInputValue ?? '').trim();
    if (!query) {
      return activeOptions;
    }

    return activeOptions.filter((option) => filterOptions(option, query));
  }, [activeOptions, currentInputValue, filterOptions, loadOptions]);

  const selectedOption =
    filteredOptions.find((option) => option.value === selectedValue) ||
    activeOptions.find((option) => option.value === selectedValue) ||
    null;
  const helperMessage = !isInvalid ? helperText : null;
  const describedBy = isInvalid && errorMessage ? errorId : helperMessage ? helperId : undefined;
  const totalHeight = filteredOptions.length * itemHeight;
  const viewportHeight = Math.min(filteredOptions.length, visibleCount) * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const endIndex = Math.min(filteredOptions.length, startIndex + visibleCount + 2);
  const windowedOptions = filteredOptions.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const commitSelection = (option) => {
    setSelectedValue(option.value);
    setCurrentInputValue(option.label);
    setIsOpen(false);
    inputRef.current?.focus();
  };

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

      <div
        className={cn(
          'flex min-h-11 items-center rounded-[var(--radius-md)] border bg-[var(--color-background-surface)] px-3 shadow-sm transition duration-150 ease-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background-page)]',
          isInvalid
            ? 'border-[var(--color-status-danger)] focus-within:ring-[var(--color-status-danger)]'
            : 'border-[var(--color-border-default)] focus-within:ring-[var(--color-focus-ring)]',
          isDisabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <input
          ref={composeRefs(forwardedRef, inputRef)}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={isOpen ? listboxId : undefined}
          aria-describedby={describedBy}
          aria-expanded={isOpen}
          aria-invalid={isInvalid || undefined}
          aria-labelledby={label ? labelId : undefined}
          disabled={isDisabled}
          placeholder={placeholder}
          value={currentInputValue ?? ''}
          className={cn(
            'w-full border-none bg-transparent py-2.5 text-sm text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted)] disabled:cursor-not-allowed',
            inputClassName,
          )}
          onFocus={() => {
            if (!isDisabled) {
              if (loadOptions) {
                setIsLoading(true);
              }
              setIsOpen(true);
            }
          }}
          onChange={(event) => {
            if (loadOptions) {
              setIsLoading(true);
            }
            setCurrentInputValue(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            const optionElements = Array.from(
              listboxRef.current?.querySelectorAll('[role="option"]') ?? [],
            );

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setIsOpen(true);
              optionElements[0]?.focus();
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              setIsOpen(false);
            }

            if (event.key === 'Enter' && !isOpen && selectedOption) {
              event.preventDefault();
              setCurrentInputValue(selectedOption.label);
            }
          }}
        />
        <span aria-hidden="true" className="shrink-0 text-[var(--color-foreground-muted)]">
          {isOpen ? '^' : 'v'}
        </span>
      </div>

      {isOpen ? (
        <div
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(
            'absolute top-full z-50 mt-2 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] shadow-2xl',
            contentClassName,
          )}
        >
          {isLoading ? (
            <div className="px-3 py-6 text-sm text-[var(--color-foreground-muted)]">{loadingMessage}</div>
          ) : filteredOptions.length > 0 ? (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: viewportHeight || itemHeight }}
              onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
            >
              <div style={{ height: totalHeight || itemHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                  {windowedOptions.map((option) => {
                    const isSelected = option.value === selectedValue;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        className={cn(
                          'flex w-full items-center justify-between px-3 text-left text-sm transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-focus-ring)]',
                          isSelected
                            ? 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-primary)]'
                            : 'text-[var(--color-foreground-primary)] hover:bg-[var(--color-background-subtle)]',
                          option.disabled && 'cursor-not-allowed opacity-50',
                        )}
                        style={{ height: itemHeight }}
                        onClick={() => {
                          if (!option.disabled) {
                            commitSelection(option);
                          }
                        }}
                        onKeyDown={(event) => {
                          const optionElements = Array.from(
                            listboxRef.current?.querySelectorAll('[role="option"]') ?? [],
                          );
                          const currentIndex = optionElements.findIndex(
                            (element) => element === document.activeElement,
                          );

                          if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            optionElements[(currentIndex + 1 + optionElements.length) % optionElements.length]?.focus();
                          }

                          if (event.key === 'ArrowUp') {
                            event.preventDefault();
                            if (currentIndex <= 0) {
                              inputRef.current?.focus();
                              return;
                            }

                            optionElements[currentIndex - 1]?.focus();
                          }

                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            if (!option.disabled) {
                              commitSelection(option);
                            }
                          }

                          if (event.key === 'Escape') {
                            event.preventDefault();
                            setIsOpen(false);
                            inputRef.current?.focus();
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected ? <span aria-hidden="true">x</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-3 py-6 text-sm text-[var(--color-foreground-muted)]">{emptyMessage}</div>
          )}
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

export default Combobox;
