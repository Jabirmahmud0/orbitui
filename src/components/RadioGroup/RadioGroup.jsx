import { forwardRef, useMemo, useRef } from 'react';
import { useRadio, useRadioGroup } from 'react-aria';
import { useRadioGroupState } from '@react-stately/radio';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';
import { createSafeContext } from '../../utils/createContext';
import { useId } from '../../hooks/useId';

const radioGroupVariants = {
  vertical: 'flex-col',
  horizontal: 'flex-row flex-wrap items-start gap-x-6 gap-y-3',
};

const radioSizes = {
  sm: {
    control: 'size-4',
    dot: 'size-2',
    gap: 'gap-2.5',
    label: 'text-sm',
    helper: 'text-xs',
  },
  md: {
    control: 'size-5',
    dot: 'size-2.5',
    gap: 'gap-3',
    label: 'text-sm',
    helper: 'text-sm',
  },
};

const [RadioGroupProvider, useRadioGroupContext] = createSafeContext('RadioGroup');

/**
 * Compound radio group with orientation control, validation, and helper text.
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorMessage]
 * @param {boolean} [props.isInvalid]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isReadOnly]
 * @param {'vertical' | 'horizontal'} [props.orientation='vertical']
 * @param {'sm' | 'md'} [props.size='md']
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const RadioGroupRoot = forwardRef(function RadioGroup(
  {
    label,
    helperText,
    errorMessage,
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    orientation = 'vertical',
    size = 'md',
    className,
    children,
    ...restProps
  },
  forwardedRef,
) {
  const state = useRadioGroupState({
    ...restProps,
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    orientation,
  });
  const {
    radioGroupProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
    isInvalid: groupIsInvalid,
    validationErrors,
  } = useRadioGroup(
    {
      ...restProps,
      label,
      errorMessage,
      isDisabled,
      isInvalid,
      isReadOnly,
      isRequired,
      orientation,
    },
    state,
  );

  const resolvedSize = radioSizes[size] ?? radioSizes.md;
  const resolvedErrorMessage =
    errorMessage ||
    (Array.isArray(validationErrors) && validationErrors.length > 0
      ? validationErrors.join(', ')
      : null);
  const contextValue = useMemo(
    () => ({
      state,
      size: resolvedSize,
      isInvalid: groupIsInvalid,
    }),
    [groupIsInvalid, resolvedSize, state],
  );

  return (
    <RadioGroupProvider value={contextValue}>
      <div className={cn('flex w-full flex-col gap-3', className)}>
        {label ? (
          <span
            {...labelProps}
            className="text-sm font-medium tracking-[0.01em] text-[var(--color-foreground-primary)]"
          >
            {label}
            {isRequired ? <span className="ml-1 text-[var(--color-status-danger)]">*</span> : null}
          </span>
        ) : null}

        <div
          {...radioGroupProps}
          ref={forwardedRef}
          className={cn(
            'flex gap-3',
            radioGroupVariants[orientation] ?? radioGroupVariants.vertical,
          )}
        >
          {children}
        </div>

        {groupIsInvalid && resolvedErrorMessage ? (
          <p {...errorMessageProps} className="text-sm leading-6 text-[var(--color-status-danger)]">
            {resolvedErrorMessage}
          </p>
        ) : null}

        {!groupIsInvalid && helperText ? (
          <p
            {...descriptionProps}
            className="text-sm leading-6 text-[var(--color-foreground-muted)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    </RadioGroupProvider>
  );
});

/**
 * Single radio option for use inside `RadioGroup`.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {string} [props.description]
 * @param {boolean} [props.isDisabled]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
const RadioGroupItem = forwardRef(function RadioGroupItem(
  { value, description, isDisabled, className, children, ...restProps },
  forwardedRef,
) {
  const { state, size, isInvalid } = useRadioGroupContext();
  const inputRef = useRef(null);
  const descriptionId = useId(description ? `radio-description-${value}` : undefined);
  const {
    inputProps,
    labelProps,
    isSelected,
    isPressed,
    isDisabled: itemIsDisabled,
  } = useRadio(
    {
      ...restProps,
      value,
      children,
      isDisabled,
      'aria-describedby': description ? descriptionId : restProps['aria-describedby'],
    },
    state,
    inputRef,
  );

  return (
    <label
      {...labelProps}
      className={cn(
        'group inline-flex max-w-full items-start rounded-[var(--radius-sm)] text-[var(--color-foreground-primary)]',
        size.gap,
        itemIsDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input {...inputProps} ref={composeRefs(forwardedRef, inputRef)} className="sr-only" />

      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full border shadow-sm transition duration-150 ease-out',
          'group-focus-within:ring-2 group-focus-within:ring-[var(--color-focus-ring)] group-focus-within:ring-offset-2 group-focus-within:ring-offset-[var(--color-background-page)]',
          size.control,
          isInvalid ? 'border-[var(--color-status-danger)]' : 'border-[var(--color-border-strong)]',
          isSelected
            ? 'border-[var(--color-action-primary)] bg-[var(--color-background-surface)]'
            : 'bg-[var(--color-background-surface)]',
          !itemIsDisabled && !isSelected ? 'group-hover:border-[var(--color-action-primary)]' : '',
          isPressed && !itemIsDisabled ? 'scale-[0.98]' : '',
        )}
      >
        <span
          className={cn(
            'rounded-full bg-[var(--color-action-primary)] transition duration-150 ease-out',
            size.dot,
            isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        />
      </span>

      <span className="min-w-0 space-y-1">
        <span className={cn('block font-medium leading-6', size.label)}>{children}</span>
        {description ? (
          <span
            id={descriptionId}
            className={cn('block leading-6 text-[var(--color-foreground-muted)]', size.helper)}
          >
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
});

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});

export { RadioGroupItem };
export default RadioGroup;
