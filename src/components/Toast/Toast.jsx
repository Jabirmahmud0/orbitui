import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useId } from '../../hooks/useId';
import { cn } from '../../utils/cn';
import { createSafeContext } from '../../utils/createContext';

const toneClasses = {
  info: 'border-[var(--color-border-default)] bg-[var(--color-background-surface)] text-[var(--color-foreground-primary)]',
  success:
    'border-[color:rgb(187_247_208)] bg-[color:rgb(240_253_244)] text-[color:rgb(22_101_52)]',
  warning:
    'border-[color:rgb(253_230_138)] bg-[color:rgb(254_252_232)] text-[color:rgb(161_98_7)]',
  error:
    'border-[color:rgb(254_202_202)] bg-[color:rgb(254_242_242)] text-[color:rgb(153_27_27)]',
};

const [ToastProviderContext, useToastContext] = createSafeContext('Toast');

let activeToastApi = null;

function createToastRecord(input, defaults = {}) {
  if (typeof input === 'string') {
    return {
      title: input,
      description: undefined,
      tone: defaults.tone ?? 'info',
      duration: defaults.duration ?? 4000,
    };
  }

  return {
    title: input.title,
    description: input.description,
    actionLabel: input.actionLabel,
    onAction: input.onAction,
    tone: input.tone ?? defaults.tone ?? 'info',
    duration: input.duration ?? defaults.duration ?? 4000,
  };
}

export const toast = {
  show(input) {
    return activeToastApi?.show(createToastRecord(input));
  },
  success(input) {
    return activeToastApi?.show(createToastRecord(input, { tone: 'success' }));
  },
  warning(input) {
    return activeToastApi?.show(createToastRecord(input, { tone: 'warning' }));
  },
  error(input) {
    return activeToastApi?.show(createToastRecord(input, { tone: 'error' }));
  },
  dismiss(id) {
    activeToastApi?.dismiss(id);
  },
  dismissAll() {
    activeToastApi?.dismissAll();
  },
};

export const ToastProvider = forwardRef(function ToastProvider(
  { children, placement = 'top-right', maxVisible = 5 },
  forwardedRef,
) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const idBase = useId('orbit-toast');
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const show = useCallback(
    (input) => {
      const id = `${idBase}-${counterRef.current++}`;
      const record = { id, ...createToastRecord(input) };

      setToasts((currentToasts) => [record, ...currentToasts].slice(0, maxVisible));

      if (record.duration > 0) {
        const timeout = setTimeout(() => dismiss(id), record.duration);
        timersRef.current.set(id, timeout);
      }

      return id;
    },
    [dismiss, idBase, maxVisible],
  );

  useEffect(() => {
    activeToastApi = { show, dismiss, dismissAll };
    const timers = timersRef.current;

    return () => {
      if (activeToastApi?.show === show) {
        activeToastApi = null;
      }

      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [dismiss, dismissAll, show]);

  const contextValue = useMemo(
    () => ({ dismiss, dismissAll, show, toasts }),
    [dismiss, dismissAll, show, toasts],
  );

  return (
    <ToastProviderContext value={contextValue}>
      <div ref={forwardedRef} className="contents">
        {children}
        <ToastViewport placement={placement} toasts={toasts} onDismiss={dismiss} />
      </div>
    </ToastProviderContext>
  );
});

export function useToast() {
  return useToastContext();
}

export const ToastViewport = forwardRef(function ToastViewport(
  { placement = 'top-right', toasts, onDismiss },
  forwardedRef,
) {
  const placementClass =
    placement === 'bottom-right'
      ? 'bottom-4 right-4 items-end'
      : placement === 'bottom-left'
        ? 'bottom-4 left-4 items-start'
        : placement === 'top-left'
          ? 'left-4 top-4 items-start'
          : 'right-4 top-4 items-end';

  return (
    <div
      ref={forwardedRef}
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed z-[60] flex w-full max-w-sm flex-col gap-3',
        placementClass,
      )}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
});

const ToastCard = forwardRef(function ToastCard({ toast: item, onDismiss }, forwardedRef) {
  return (
    <div
      ref={forwardedRef}
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto rounded-[var(--radius-xl)] border px-4 py-3 shadow-xl',
        toneClasses[item.tone] ?? toneClasses.info,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description ? (
            <p className="mt-1 text-sm leading-6 opacity-90">{item.description}</p>
          ) : null}
          {item.actionLabel ? (
            <button
              type="button"
              className="mt-3 text-sm font-medium underline underline-offset-4"
              onClick={() => {
                item.onAction?.();
                onDismiss(item.id);
              }}
            >
              {item.actionLabel}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="shrink-0 rounded-[var(--radius-md)] px-2 py-1 text-xs font-medium opacity-80 transition hover:opacity-100"
          onClick={() => onDismiss(item.id)}
        >
          Close
        </button>
      </div>
    </div>
  );
});

export default ToastProvider;
