import { forwardRef, useMemo, useRef } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { createSafeContext } from '../../utils/createContext';

const listOrientations = {
  horizontal: 'flex-row items-center',
  vertical: 'flex-col items-stretch',
};

const triggerOrientations = {
  horizontal: 'min-h-11 rounded-[var(--radius-md)] px-4 py-2.5 text-sm',
  vertical: 'w-full justify-start rounded-[var(--radius-md)] px-4 py-3 text-sm',
};

const [TabsProvider, useTabsContext] = createSafeContext('Tabs');

function getEnabledTabs(listElement) {
  if (!listElement) {
    return [];
  }

  return Array.from(listElement.querySelectorAll('[role="tab"]')).filter((tab) => !tab.disabled);
}

/**
 * Compound tabs root with controlled/uncontrolled selection and orientation support.
 *
 * @param {object} props
 * @param {string} [props.value]
 * @param {string} [props.defaultValue]
 * @param {(value: string) => void} [props.onValueChange]
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const TabsRoot = forwardRef(function Tabs(
  { value, defaultValue, onValueChange, orientation = 'horizontal', className, children },
  forwardedRef,
) {
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId('tabs');
  const contextValue = useMemo(
    () => ({
      baseId,
      orientation,
      selectedValue,
      setSelectedValue,
    }),
    [baseId, orientation, selectedValue, setSelectedValue],
  );

  return (
    <TabsProvider value={contextValue}>
      <div ref={forwardedRef} className={cn('flex w-full flex-col gap-4', className)}>
        {children}
      </div>
    </TabsProvider>
  );
});

/**
 * Tab list wrapper that handles arrow-key roving between triggers.
 *
 * @param {object} props
 * @param {string} [props['aria-label']]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const TabsList = forwardRef(function TabsList(
  { className, children, onKeyDown, ...restProps },
  forwardedRef,
) {
  const { orientation } = useTabsContext();
  const localRef = useRef(null);

  const handleKeyDown = (event) => {
    const isHorizontal = orientation === 'horizontal';
    const nextKeys = isHorizontal ? ['ArrowRight'] : ['ArrowDown'];
    const prevKeys = isHorizontal ? ['ArrowLeft'] : ['ArrowUp'];
    const tabs = getEnabledTabs(localRef.current);

    if (tabs.length === 0) {
      onKeyDown?.(event);
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    if (nextKeys.includes(event.key) || prevKeys.includes(event.key)) {
      event.preventDefault();
      const fallbackIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = nextKeys.includes(event.key)
        ? (fallbackIndex + 1) % tabs.length
        : (fallbackIndex - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      tabs[0].focus();
      tabs[0].click();
    }

    if (event.key === 'End') {
      event.preventDefault();
      tabs[tabs.length - 1].focus();
      tabs[tabs.length - 1].click();
    }

    onKeyDown?.(event);
  };

  return (
    <div
      {...restProps}
      ref={(node) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      role="tablist"
      tabIndex={0}
      aria-orientation={orientation}
      className={cn(
        'inline-flex w-fit gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] p-1.5',
        listOrientations[orientation] ?? listOrientations.horizontal,
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
});

/**
 * Individual tab trigger.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {boolean} [props.isDisabled=false]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const TabsTrigger = forwardRef(function TabsTrigger(
  { value, isDisabled = false, className, children, ...restProps },
  forwardedRef,
) {
  const { baseId, orientation, selectedValue, setSelectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      {...restProps}
      ref={forwardedRef}
      id={tabId}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={isDisabled}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium tracking-[0.01em] text-[var(--color-foreground-primary)] transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)] disabled:cursor-not-allowed disabled:opacity-50',
        triggerOrientations[orientation] ?? triggerOrientations.horizontal,
        isSelected
          ? 'bg-[var(--color-action-primary)] text-[var(--color-foreground-inverse)] shadow-sm'
          : 'bg-transparent hover:bg-[var(--color-background-subtle)]',
        className,
      )}
      onClick={() => {
        if (!isDisabled) {
          setSelectedValue(value);
        }
      }}
    >
      {children}
    </button>
  );
});

/**
 * Tab panel content bound to a trigger value.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {boolean} [props.forceMount=false]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement | null}
 */
const TabsContent = forwardRef(function TabsContent(
  { value, forceMount = false, className, children, ...restProps },
  forwardedRef,
) {
  const { baseId, selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!forceMount && !isSelected) {
    return null;
  }

  return (
    <div
      {...restProps}
      ref={forwardedRef}
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!isSelected}
      tabIndex={0}
      className={cn(
        'w-full rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] p-5 text-sm leading-7 text-[var(--color-foreground-primary)] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)]',
        className,
      )}
    >
      {children}
    </div>
  );
});

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsContent, TabsList, TabsTrigger };
export default Tabs;
