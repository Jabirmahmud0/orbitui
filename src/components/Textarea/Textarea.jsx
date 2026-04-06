import { forwardRef, useEffect, useRef } from 'react';
import { useTextField } from 'react-aria';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

/**
 * OrbitUI textarea with optional auto-resize and character count support.
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.errorMessage]
 * @param {boolean} [props.isInvalid]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.autoResize=false]
 * @param {boolean} [props.showCharacterCount=false]
 * @param {number} [props.maxLength]
 * @param {string} [props.className]
 * @param {string} [props.textareaClassName]
 * @returns {import('react').ReactElement}
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    helperText,
    errorMessage,
    isInvalid,
    isRequired,
    isDisabled,
    autoResize = false,
    showCharacterCount = false,
    maxLength,
    className,
    textareaClassName,
    ...restProps
  },
  forwardedRef,
) {
  const textareaRef = useRef(null);
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
      maxLength,
      inputElementType: 'textarea',
    },
    textareaRef,
  );

  const resolvedErrorMessage =
    errorMessage ||
    (Array.isArray(validationErrors) && validationErrors.length > 0
      ? validationErrors.join(', ')
      : null);

  const currentLength = String(inputProps.value || '').length;

  useEffect(() => {
    if (!autoResize || !textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [autoResize, inputProps.value]);

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
          'rounded-[var(--radius-md)] border bg-[var(--color-background-surface)] px-3 py-3 shadow-sm transition duration-150 ease-out',
          fieldIsInvalid
            ? 'border-[var(--color-status-danger)] focus-within:ring-[var(--color-status-danger)]'
            : 'border-[var(--color-border-default)] focus-within:border-[var(--color-action-primary)] focus-within:ring-[var(--color-focus-ring)]',
          'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background-page)]',
          isDisabled ? 'cursor-not-allowed opacity-60' : '',
        )}
      >
        <textarea
          {...inputProps}
          {...restProps}
          ref={composeRefs(forwardedRef, textareaRef)}
          rows={restProps.rows ?? 4}
          maxLength={maxLength}
          className={cn(
            'min-h-28 w-full resize-none border-none bg-transparent text-sm leading-7 text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted)] disabled:cursor-not-allowed',
            !autoResize && 'resize-y',
            textareaClassName,
          )}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {fieldIsInvalid && resolvedErrorMessage ? (
            <p
              {...errorMessageProps}
              className="text-sm leading-6 text-[var(--color-status-danger)]"
            >
              {resolvedErrorMessage}
            </p>
          ) : null}

          {!fieldIsInvalid && helperText ? (
            <p
              {...descriptionProps}
              className="text-sm leading-6 text-[var(--color-foreground-muted)]"
            >
              {helperText}
            </p>
          ) : null}
        </div>

        {showCharacterCount ? (
          <p className="shrink-0 text-sm leading-6 text-[var(--color-foreground-muted)]">
            {currentLength}
            {typeof maxLength === 'number' ? ` / ${maxLength}` : ''}
          </p>
        ) : null}
      </div>
    </div>
  );
});

export default Textarea;
