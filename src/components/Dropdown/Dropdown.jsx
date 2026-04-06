import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId as useReactId,
  useMemo,
  useRef,
} from 'react';
import { OverlayContainer } from '@react-aria/overlays';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';
import { createSafeContext } from '../../utils/createContext';

const sideClasses = {
  bottom: 'top-full mt-2 origin-top',
  top: 'bottom-full mb-2 origin-bottom',
};

const alignClasses = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

const [DropdownProvider, useDropdownContext] = createSafeContext('Dropdown');

function getEnabledItems(menuElement) {
  if (!menuElement) {
    return [];
  }

  return Array.from(menuElement.querySelectorAll('[role^="menuitem"]')).filter(
    (item) => item.getAttribute('aria-disabled') !== 'true',
  );
}

const DropdownRoot = forwardRef(function Dropdown(
  { open, defaultOpen = false, onOpenChange, closeOnSelect = true, children },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const contentId = useId('orbit-dropdown-content');
  const labelId = useId('orbit-dropdown-label');
  const contextValue = useMemo(
    () => ({
      closeMenu: () => setIsOpen(false),
      closeOnSelect,
      contentId,
      contentRef,
      forwardedRef,
      isOpen,
      labelId,
      openMenu: () => setIsOpen(true),
      setIsOpen,
      toggleMenu: () => setIsOpen((currentOpen) => !currentOpen),
      triggerRef,
    }),
    [closeOnSelect, contentId, forwardedRef, isOpen, labelId, setIsOpen],
  );

  return <DropdownProvider value={contextValue}>{children}</DropdownProvider>;
});

const DropdownTrigger = forwardRef(function DropdownTrigger(
  { asChild = false, className, children, onClick, ...restProps },
  forwardedRef,
) {
  const { contentId, isOpen, toggleMenu, triggerRef } = useDropdownContext();

  const handleClick = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      toggleMenu();
    }
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...children.props,
      ...restProps,
      'aria-controls': isOpen ? contentId : undefined,
      'aria-expanded': isOpen,
      'aria-haspopup': 'menu',
      onClick: (event) => {
        children.props.onClick?.(event);
        handleClick(event);
      },
      ref: triggerRef,
    });
  }

  return (
    <button
      {...restProps}
      ref={composeRefs(forwardedRef, triggerRef)}
      type="button"
      aria-controls={isOpen ? contentId : undefined}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-background-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground-primary)] shadow-sm transition duration-150 ease-out hover:bg-[var(--color-background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)]',
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

const DropdownContent = forwardRef(function DropdownContent(
  {
    align = 'start',
    className,
    children,
    side = 'bottom',
    sideOffset = 8,
    ...restProps
  },
  forwardedRef,
) {
  const { closeMenu, contentId, contentRef, forwardedRef: rootRef, isOpen, labelId, triggerRef } =
    useDropdownContext();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const enabledItems = getEnabledItems(contentRef.current);
    enabledItems[0]?.focus();

    const handlePointerDown = (event) => {
      const target = event.target;

      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    };

    const handleWindowBlur = () => {
      closeMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [closeMenu, contentRef, isOpen, triggerRef]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const resolvedSideClass = sideClasses[side] ?? sideClasses.bottom;
  const resolvedAlignClass = alignClasses[align] ?? alignClasses.start;

  return (
    <OverlayContainer>
      <div className="pointer-events-none fixed inset-0 z-50">
        <div
          {...restProps}
          ref={composeRefs(forwardedRef, rootRef, contentRef)}
          id={contentId}
          role="menu"
          tabIndex={-1}
          aria-labelledby={labelId}
          className={cn(
            'pointer-events-auto absolute min-w-56 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] p-2 text-[var(--color-foreground-primary)] shadow-2xl outline-none',
            resolvedSideClass,
            resolvedAlignClass,
            className,
          )}
          style={{
            marginTop: side === 'bottom' ? sideOffset : undefined,
            marginBottom: side === 'top' ? sideOffset : undefined,
          }}
          onKeyDown={(event) => {
            const enabledItems = getEnabledItems(contentRef.current);

            if (enabledItems.length === 0) {
              return;
            }

            const currentIndex = enabledItems.findIndex((item) => item === document.activeElement);

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              enabledItems[(currentIndex + 1 + enabledItems.length) % enabledItems.length].focus();
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length].focus();
            }

            if (event.key === 'Home') {
              event.preventDefault();
              enabledItems[0].focus();
            }

            if (event.key === 'End') {
              event.preventDefault();
              enabledItems[enabledItems.length - 1].focus();
            }

            if (event.key === 'Escape' || event.key === 'Tab') {
              event.preventDefault();
              closeMenu();
              triggerRef.current?.focus();
            }
          }}
        >
          {children}
        </div>
      </div>
    </OverlayContainer>
  );
});

const DropdownLabel = forwardRef(function DropdownLabel(
  { className, children, ...restProps },
  forwardedRef,
) {
  const { labelId } = useDropdownContext();

  return (
    <div
      {...restProps}
      id={labelId}
      ref={forwardedRef}
      className={cn(
        'px-3 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground-tertiary)]',
        className,
      )}
    >
      {children}
    </div>
  );
});

const DropdownSection = forwardRef(function DropdownSection(
  { className, children, title, ...restProps },
  forwardedRef,
) {
  const titleId = useReactId();

  return (
    <div
      {...restProps}
      ref={forwardedRef}
      role="group"
      aria-labelledby={title ? titleId : undefined}
      className={cn('space-y-1 py-1', className)}
    >
      {title ? (
        <div
          id={titleId}
          className="px-3 pb-1 text-xs font-medium tracking-[0.08em] text-[var(--color-foreground-tertiary)]"
        >
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
});

const DropdownItem = forwardRef(function DropdownItem(
  {
    className,
    children,
    closeOnSelect,
    inset = false,
    isDisabled = false,
    onSelect,
    shortcut,
    tone = 'default',
    ...restProps
  },
  forwardedRef,
) {
  const { closeMenu, closeOnSelect: rootCloseOnSelect } = useDropdownContext();
  const shouldCloseOnSelect = closeOnSelect ?? rootCloseOnSelect;

  return (
    <button
      {...restProps}
      ref={forwardedRef}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={cn(
        'flex min-h-10 w-full items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm font-medium transition duration-150 ease-out focus:bg-[var(--color-background-subtle)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        inset && 'pl-8',
        tone === 'danger'
          ? 'text-[var(--color-danger-600)] hover:bg-[color:rgb(254_242_242)] focus:bg-[color:rgb(254_242_242)]'
          : 'text-[var(--color-foreground-primary)] hover:bg-[var(--color-background-subtle)]',
        className,
      )}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }

        onSelect?.(event);

        if (!event.defaultPrevented && shouldCloseOnSelect) {
          closeMenu();
        }
      }}
    >
      <span className="flex-1">{children}</span>
      {shortcut ? (
        <span className="text-xs font-medium tracking-[0.08em] text-[var(--color-foreground-tertiary)]">
          {shortcut}
        </span>
      ) : null}
    </button>
  );
});

const DropdownSeparator = forwardRef(function DropdownSeparator(
  { className, ...restProps },
  forwardedRef,
) {
  return (
    <div
      {...restProps}
      ref={forwardedRef}
      role="separator"
      className={cn('my-1 h-px bg-[var(--color-border-subtle)]', className)}
    />
  );
});

export const Dropdown = Object.assign(DropdownRoot, {
  Content: DropdownContent,
  Item: DropdownItem,
  Label: DropdownLabel,
  Section: DropdownSection,
  Separator: DropdownSeparator,
  Trigger: DropdownTrigger,
});

export {
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
  DropdownTrigger,
};
export default Dropdown;



