import { useCallback, useState } from 'react';

/**
 * Manage a value that can be either controlled by props or uncontrolled via internal state.
 *
 * @template T
 * @param {object} options
 * @param {T} [options.value]
 * @param {T} [options.defaultValue]
 * @param {(nextValue: T) => void} [options.onChange]
 * @returns {[T | undefined, (nextValue: T | ((previousValue: T | undefined) => T)) => void]}
 */
export function useControllableState({ value, defaultValue, onChange } = {}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (nextValue) => {
      const resolvedValue = typeof nextValue === 'function' ? nextValue(currentValue) : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue];
}

export default useControllableState;
