import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a media query in an SSR-safe way.
 *
 * @param {string} query
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const subscribe = (notify) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return () => {};
    }

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = () => {
      notify();
    };

    mediaQueryList.addEventListener('change', updateMatches);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatches);
    };
  };

  const getSnapshot = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export default useMediaQuery;
