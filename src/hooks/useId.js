import { useId as useReactId } from 'react';

/**
 * Return a stable id for accessibility relationships, with an optional custom prefix.
 *
 * @param {string} [prefix='orbit']
 * @returns {string}
 */
export function useId(prefix = 'orbit') {
  const reactId = useReactId();

  return `${prefix}-${reactId.replace(/:/g, '')}`;
}

export default useId;
