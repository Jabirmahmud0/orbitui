import { forwardRef, useRef } from 'react';
import { useButton } from 'react-aria';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

const buttonVariants = {
  primary:
    'border-transparent bg-[var(--color-action-primary)] text-[var(--color-foreground-inverse)] hover:bg-[var(--color-action-primary-hover)] active:bg-[var(--color-action-primary-active)]',
  secondary:
    'border-[var(--color-border-strong)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] hover:bg-[color:var(--color-background-subtle)] active:border-[var(--color-border-default)]',
  outline:
    'border-[var(--color-border-strong)] bg-transparent text-[var(--color-foreground-primary)] hover:bg-[color:var(--color-background-surface)] active:bg-[color:var(--color-background-subtle)]',
  ghost:
    'border-transparent bg-transparent text-[var(--color-foreground-primary)] hover:bg-[color:var(--color-background-surface)] active:bg-[color:var(--color-background-subtle)]',
  danger:
    'border-transparent bg-[var(--color-status-danger)] text-white hover:brightness-110 active:brightness-95',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

/**
 * OrbitUI button primitive with polymorphic rendering and accessible press handling.
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {import('react').ReactNode} [props.leftIcon]
 * @param {import('react').ReactNode} [props.rightIcon]
 * @param {keyof JSX.IntrinsicElements} [props.as='button']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
export const Button = forwardRef(function Button(
  {
    as = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...restProps
  },
  forwardedRef,
) {
  const domRef = useRef(null);
  const Component = as;
  const isDisabled = Boolean(disabled || isLoading);
  const { buttonProps } = useButton(
    {
      ...restProps,
      elementType: Component,
      isDisabled,
    },
    domRef,
  );

  const type = Component === 'button' && restProps.type == null ? 'button' : restProps.type;

  return (
    <Component
      {...buttonProps}
      {...restProps}
      ref={composeRefs(forwardedRef, domRef)}
      type={type}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-[var(--radius-md)] border font-medium tracking-[0.01em] shadow-sm transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)] disabled:pointer-events-none disabled:opacity-60',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </Component>
  );
});

export default Button;
