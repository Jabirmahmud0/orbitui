import { forwardRef, useRef } from 'react';
import { useTextField } from 'react-aria';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

/**
 * OrbitUI input field with label, description, validation, and addon slots.
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorMessage]
 * @param {boolean} [props.isInvalid]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isDisabled]
 * @param {import('react').ReactNode} [props.leftAddon]
 * @param {import('react').ReactNode} [props.rightAddon]
 * @param {string} [props.className]
 * @param {string} [props.inputClassName]
 * @returns {import('react').ReactElement}
 */
export const Input = forwardRef(function Input(
  {
    label,
    helperText,
    errorMessage,
    isInvalid,
    isRequired,
    isDisabled,
    leftAddon,
    rightAddon,
    className,
    inputClassName,
    ...restProps
  },
  forwardedRef,
) {
  const inputRef = useRef(null);
  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid: fieldIsInvalid,
    validationErrors,
  } = useTextField(
    {
      ...restProps,
      label,
      errorMessage,
      isInvalid,
      isRequired,
      isDisabled,
    },
    inputRef,
  );

  const resolvedErrorMessage =
    errorMessage ||
    (Array.isArray(validationErrors) && validationErrors.length > 0
      ? validationErrors.join(', ')
      : null);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <label
          {...labelProps}
          className="text-sm font-medium tracking-[0.01em] text-[var(--color-foreground-primary)]"
        >
          {label}
          {isRequired ? <span className="ml-1 text-[var(--color-status-danger)]">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          'flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] border bg-[var(--color-background-surface)] px-3 shadow-sm transition duration-150 ease-out',
          fieldIsInvalid
            ? 'border-[var(--color-status-danger)] focus-within:ring-[var(--color-status-danger)]'
            : 'border-[var(--color-border-default)] focus-within:border-[var(--color-action-primary)] focus-within:ring-[var(--color-focus-ring)]',
          'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background-page)]',
          isDisabled ? 'cursor-not-allowed opacity-60' : '',
        )}
      >
        {leftAddon ? (
          <span className="shrink-0 text-[var(--color-foreground-muted)]">{leftAddon}</span>
        ) : null}

        <input
          {...inputProps}
          {...restProps}
          ref={composeRefs(forwardedRef, inputRef)}
          className={cn(
            'w-full border-none bg-transparent text-sm text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted)] disabled:cursor-not-allowed',
            inputClassName,
          )}
        />

        {rightAddon ? (
          <span className="shrink-0 text-[var(--color-foreground-muted)]">{rightAddon}</span>
        ) : null}
      </div>

      {fieldIsInvalid && resolvedErrorMessage ? (
        <p {...errorMessageProps} className="text-sm leading-6 text-[var(--color-status-danger)]">
          {resolvedErrorMessage}
        </p>
      ) : null}

      {!fieldIsInvalid && helperText ? (
        <p {...descriptionProps} className="text-sm leading-6 text-[var(--color-foreground-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
