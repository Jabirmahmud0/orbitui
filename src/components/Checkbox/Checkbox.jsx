import { forwardRef, useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { useToggleState } from '@react-stately/toggle';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

const checkboxSizes = {
  sm: {
    control: 'size-4',
    icon: 'size-3',
    gap: 'gap-2.5',
    label: 'text-sm',
    helper: 'text-xs',
  },
  md: {
    control: 'size-5',
    icon: 'size-3.5',
    gap: 'gap-3',
    label: 'text-sm',
    helper: 'text-sm',
  },
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" {...props}>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

function IndeterminateIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" {...props}>
      <path d="M3.5 8h9" />
    </svg>
  );
}

/**
 * OrbitUI checkbox with indeterminate state, validation, and custom icon slots.
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorMessage]
 * @param {boolean} [props.isInvalid]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isReadOnly]
 * @param {boolean} [props.isIndeterminate]
 * @param {'sm' | 'md'} [props.size='md']
 * @param {'start' | 'end'} [props.labelPlacement='end']
 * @param {import('react').ReactNode} [props.checkedIcon]
 * @param {import('react').ReactNode} [props.indeterminateIcon]
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    helperText,
    errorMessage,
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    isIndeterminate = false,
    size = 'md',
    labelPlacement = 'end',
    checkedIcon,
    indeterminateIcon,
    className,
    ...restProps
  },
  forwardedRef,
) {
  const inputRef = useRef(null);
  const state = useToggleState({
    isSelected: restProps.isSelected,
    defaultSelected: restProps.defaultSelected,
    onChange: restProps.onChange,
    isReadOnly,
  });
  const {
    inputProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
    isSelected,
    isDisabled: checkboxIsDisabled,
    isReadOnly: checkboxIsReadOnly,
    isInvalid: checkboxIsInvalid,
    validationErrors,
  } = useCheckbox(
    {
      ...restProps,
      children: label,
      isDisabled,
      isReadOnly,
      isInvalid,
      isRequired,
      isIndeterminate,
    },
    state,
    inputRef,
  );

  const resolvedSize = checkboxSizes[size] ?? checkboxSizes.md;
  const resolvedErrorMessage =
    errorMessage ||
    (Array.isArray(validationErrors) && validationErrors.length > 0
      ? validationErrors.join(', ')
      : null);
  const indicator = isIndeterminate
    ? (indeterminateIcon ?? <IndeterminateIcon className={resolvedSize.icon} aria-hidden="true" />)
    : (checkedIcon ?? <CheckIcon className={resolvedSize.icon} aria-hidden="true" />);

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <label
        {...labelProps}
        className={cn(
          'group inline-flex w-fit max-w-full items-start rounded-[var(--radius-sm)] text-[var(--color-foreground-primary)]',
          resolvedSize.gap,
          labelPlacement === 'start' ? 'flex-row-reverse justify-end' : 'flex-row',
          checkboxIsDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}
      >
        <input {...inputProps} ref={composeRefs(forwardedRef, inputRef)} className="sr-only" />

        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-[calc(var(--radius-sm)-2px)] border shadow-sm transition duration-150 ease-out',
            'group-focus-within:ring-2 group-focus-within:ring-[var(--color-focus-ring)] group-focus-within:ring-offset-2 group-focus-within:ring-offset-[var(--color-background-page)]',
            resolvedSize.control,
            checkboxIsInvalid
              ? 'border-[var(--color-status-danger)]'
              : 'border-[var(--color-border-strong)]',
            isSelected || isIndeterminate
              ? 'bg-[var(--color-action-primary)] text-[var(--color-foreground-inverse)]'
              : 'bg-[var(--color-background-surface)] text-transparent',
            !checkboxIsDisabled && !checkboxIsReadOnly && !isSelected && !isIndeterminate
              ? 'group-hover:border-[var(--color-action-primary)]'
              : '',
            !checkboxIsDisabled && !checkboxIsReadOnly && (isSelected || isIndeterminate)
              ? 'group-hover:bg-[var(--color-action-primary-hover)]'
              : '',
          )}
        >
          {isSelected || isIndeterminate ? indicator : null}
        </span>

        <span className="min-w-0 space-y-1">
          {label ? (
            <span className={cn('block font-medium leading-6', resolvedSize.label)}>
              {label}
              {isRequired ? (
                <span className="ml-1 text-[var(--color-status-danger)]">*</span>
              ) : null}
            </span>
          ) : null}

          {checkboxIsInvalid && resolvedErrorMessage ? (
            <span
              {...errorMessageProps}
              className={cn(
                'block leading-6 text-[var(--color-status-danger)]',
                resolvedSize.helper,
              )}
            >
              {resolvedErrorMessage}
            </span>
          ) : null}

          {!checkboxIsInvalid && helperText ? (
            <span
              {...descriptionProps}
              className={cn(
                'block leading-6 text-[var(--color-foreground-muted)]',
                resolvedSize.helper,
              )}
            >
              {helperText}
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
});

export default Checkbox;
