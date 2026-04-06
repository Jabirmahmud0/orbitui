import { createContext, useContext } from 'react';

/**
 * Create a context/provider pair that throws a descriptive error when consumed outside its provider.
 *
 * @template T
 * @param {string} name
 * @returns {[import('react').Provider<T | undefined>, () => T]}
 */
export function createSafeContext(name) {
  const Context = createContext(undefined);

  function useSafeContext() {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(`${name} context must be used within ${name}.Provider`);
    }

    return context;
  }

  return [Context.Provider, useSafeContext];
}

export default createSafeContext;
