import { Children, cloneElement, isValidElement, useRef } from 'react';
import { useTooltip, useTooltipTrigger } from 'react-aria';
import { mergeProps } from '@react-aria/utils';
import { useTooltipTriggerState } from '@react-stately/tooltip';

import { cn } from '../../utils/cn';

const placementClasses = {
  top: {
    wrapper: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    arrow: '-bottom-1.5 left-1/2 -translate-x-1/2 rotate-45',
  },
  right: {
    wrapper: 'left-full top-1/2 ml-3 -translate-y-1/2',
    arrow: '-left-1.5 top-1/2 -translate-y-1/2 rotate-45',
  },
  bottom: {
    wrapper: 'left-1/2 top-full mt-3 -translate-x-1/2',
    arrow: '-top-1.5 left-1/2 -translate-x-1/2 rotate-45',
  },
  left: {
    wrapper: 'right-full top-1/2 mr-3 -translate-y-1/2',
    arrow: '-right-1.5 top-1/2 -translate-y-1/2 rotate-45',
  },
};

/**
 * Accessible tooltip trigger with delayed hover/focus activation and directional arrow.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 * @param {'top' | 'right' | 'bottom' | 'left'} [props.placement='top']
 * @param {number} [props.delay=600]
 * @param {number} [props.closeDelay=100]
 * @param {boolean} [props.isDisabled=false]
 * @param {'focus' | 'hover'} [props.trigger='hover']
 * @param {boolean} [props.showArrow=true]
 * @param {string} [props.className]
 * @param {string} [props.contentClassName]
 * @returns {import('react').ReactElement}
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 600,
  closeDelay = 100,
  isDisabled = false,
  trigger = 'hover',
  showArrow = true,
  className,
  contentClassName,
  ...restProps
}) {
  const triggerRef = useRef(null);
  const state = useTooltipTriggerState({ delay, closeDelay, isDisabled, trigger });
  const { triggerProps, tooltipProps: triggerTooltipProps } = useTooltipTrigger(
    {
      delay,
      closeDelay,
      isDisabled,
      trigger,
    },
    state,
    triggerRef,
  );
  const { tooltipProps } = useTooltip(restProps, state);
  const resolvedPlacement = placementClasses[placement] ?? placementClasses.top;
  const child = Children.only(children);

  const triggerNode = isValidElement(child) ? (
    cloneElement(child, {
      ...mergeProps(child.props, triggerProps),
    })
  ) : (
    <span {...triggerProps} className="inline-flex" role="button" tabIndex={0}>
      {child}
    </span>
  );

  return (
    <span ref={triggerRef} className={cn('relative inline-flex w-fit', className)}>
      {triggerNode}

      {state.isOpen && content ? (
        <span
          {...mergeProps(triggerTooltipProps, tooltipProps)}
          data-placement={placement}
          className={cn(
            'pointer-events-none absolute z-50 inline-flex max-w-64 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-foreground-primary)] px-3 py-2 text-xs leading-5 text-[var(--color-foreground-inverse)] shadow-lg',
            resolvedPlacement.wrapper,
            contentClassName,
          )}
        >
          {content}
          {showArrow ? (
            <span
              aria-hidden="true"
              className={cn(
                'absolute size-3 border border-[var(--color-border-strong)] bg-[var(--color-foreground-primary)]',
                resolvedPlacement.arrow,
              )}
            />
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export default Tooltip;
