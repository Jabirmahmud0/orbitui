import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FocusScope } from '@react-aria/focus';
import { useDialog } from '@react-aria/dialog';
import { DismissButton, OverlayContainer, useModalOverlay } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { useOverlayTriggerState } from '@react-stately/overlays';

import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';
import { createSafeContext } from '../../utils/createContext';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-none',
};

const [ModalProvider, useModalContext] = createSafeContext('Modal');

function useModalRegistration(setter) {
  useEffect(() => {
    setter(true);

    return () => setter(false);
  }, [setter]);
}

const ModalRoot = forwardRef(function Modal(
  {
    isOpen,
    defaultOpen = false,
    onOpenChange,
    isDismissable = true,
    isKeyboardDismissDisabled = false,
    role = 'dialog',
    size = 'md',
    children,
  },
  forwardedRef,
) {
  const state = useOverlayTriggerState({ isOpen, defaultOpen, onOpenChange });
  const triggerRef = useRef(null);
  const dialogId = useId('orbit-modal');
  const titleId = useId('orbit-modal-title');
  const descriptionId = useId('orbit-modal-description');
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const contextValue = useMemo(
    () => ({
      descriptionId,
      dialogId,
      forwardedRef,
      hasDescription,
      hasTitle,
      isDismissable,
      isKeyboardDismissDisabled,
      role,
      setHasDescription,
      setHasTitle,
      size,
      state,
      titleId,
      triggerRef,
    }),
    [
      descriptionId,
      dialogId,
      forwardedRef,
      hasDescription,
      hasTitle,
      isDismissable,
      isKeyboardDismissDisabled,
      role,
      size,
      state,
      titleId,
    ],
  );

  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
});

const ModalTrigger = forwardRef(function ModalTrigger(
  { asChild = false, className, children, onClick, ...restProps },
  forwardedRef,
) {
  const { dialogId, state, triggerRef } = useModalContext();

  const handleClick = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      state.open();
    }
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...children.props,
      ...restProps,
      'aria-controls': state.isOpen ? dialogId : undefined,
      'aria-expanded': state.isOpen,
      'aria-haspopup': 'dialog',
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
      aria-controls={state.isOpen ? dialogId : undefined}
      aria-expanded={state.isOpen}
      aria-haspopup="dialog"
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-background-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground-primary)] shadow-sm transition duration-150 ease-out hover:bg-[var(--color-background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-page)]',
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

const ModalContent = forwardRef(function ModalContent(
  { className, children, overlayClassName, ...restProps },
  forwardedRef,
) {
  const {
    descriptionId,
    dialogId,
    forwardedRef: rootRef,
    hasDescription,
    hasTitle,
    isDismissable,
    isKeyboardDismissDisabled,
    role,
    size,
    state,
    titleId,
  } = useModalContext();
  const dialogRef = useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    {
      isDismissable,
      isKeyboardDismissDisabled,
    },
    state,
    dialogRef,
  );
  const { dialogProps } = useDialog(
    {
      role,
      'aria-describedby': hasDescription ? descriptionId : undefined,
      'aria-labelledby': hasTitle ? titleId : undefined,
    },
    dialogRef,
  );

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  if (!state.isOpen || typeof document === 'undefined') {
    return null;
  }

  const dialogSizeClass = sizeClasses[size] ?? sizeClasses.md;
  const alignmentClass = size === 'full' ? 'items-stretch p-0' : 'items-end p-4 sm:items-center';

  return (
    <OverlayContainer>
      <div
        {...underlayProps}
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto bg-[color:rgb(15_23_42_/_0.58)] backdrop-blur-[2px]',
          overlayClassName,
        )}
      >
        {isDismissable ? (
          <button
            aria-label="Dismiss modal backdrop"
            className="absolute inset-0"
            data-orbit-modal-overlay=""
            tabIndex={-1}
            type="button"
            onClick={() => state.close()}
          />
        ) : null}
        <div className={cn('relative z-10 flex min-h-full justify-center', alignmentClass)}>
          <FocusScope contain restoreFocus>
            <div
              {...mergeProps(dialogProps, modalProps, restProps)}
              ref={composeRefs(forwardedRef, rootRef, dialogRef)}
              id={dialogId}
              data-orbit-modal-content=""
              tabIndex={-1}
              className={cn(
                'relative flex w-full flex-col overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)] shadow-2xl outline-none',
                size === 'full'
                  ? 'min-h-[100dvh] rounded-none'
                  : 'my-auto max-h-[calc(100dvh-2rem)] rounded-[var(--radius-xl)]',
                dialogSizeClass,
                className,
              )}
            >
              <DismissButton onDismiss={state.close} />
              {children}
              <DismissButton onDismiss={state.close} />
            </div>
          </FocusScope>
        </div>
      </div>
    </OverlayContainer>
  );
});

const ModalHeader = forwardRef(function ModalHeader(
  { className, children, ...restProps },
  forwardedRef,
) {
  return (
    <div
      {...restProps}
      ref={forwardedRef}
      className={cn(
        'flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] px-6 py-5',
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
});

const ModalBody = forwardRef(function ModalBody(
  { className, children, ...restProps },
  forwardedRef,
) {
  return (
    <div
      {...restProps}
      ref={forwardedRef}
      className={cn('flex-1 overflow-y-auto px-6 py-5 text-sm leading-7', className)}
    >
      {children}
    </div>
  );
});

const ModalFooter = forwardRef(function ModalFooter(
  { className, children, ...restProps },
  forwardedRef,
) {
  return (
    <div
      {...restProps}
      ref={forwardedRef}
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-[var(--color-border-subtle)] px-6 py-5 sm:flex-row sm:justify-end',
        className,
      )}
    >
      {children}
    </div>
  );
});

const ModalTitle = forwardRef(function ModalTitle(
  { className, children, ...restProps },
  forwardedRef,
) {
  const { setHasTitle, titleId } = useModalContext();

  useModalRegistration(setHasTitle);

  return (
    <h2
      {...restProps}
      id={titleId}
      ref={forwardedRef}
      className={cn(
        'text-lg font-semibold tracking-tight text-[var(--color-foreground-primary)]',
        className,
      )}
    >
      {children}
    </h2>
  );
});

const ModalDescription = forwardRef(function ModalDescription(
  { className, children, ...restProps },
  forwardedRef,
) {
  const { descriptionId, setHasDescription } = useModalContext();

  useModalRegistration(setHasDescription);

  return (
    <p
      {...restProps}
      id={descriptionId}
      ref={forwardedRef}
      className={cn('mt-2 text-sm leading-6 text-[var(--color-foreground-secondary)]', className)}
    >
      {children}
    </p>
  );
});

const ModalClose = forwardRef(function ModalClose(
  { className, children = 'Close', onClick, ...restProps },
  forwardedRef,
) {
  const { state } = useModalContext();

  return (
    <button
      {...restProps}
      ref={forwardedRef}
      type="button"
      aria-label={typeof children === 'string' ? children : 'Close modal'}
      className={cn(
        'inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-transparent px-3 text-sm font-medium text-[var(--color-foreground-secondary)] transition duration-150 ease-out hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-surface)]',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          state.close();
        }
      }}
    >
      {children}
    </button>
  );
});

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
});

export const Dialog = Modal;
export {
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
export default Modal;
