import { createElement } from 'react';

import { createSafeContext } from '../utils/createContext';

const [OrbitProviderContext, useOrbitContext] = createSafeContext('OrbitProvider');

function toKebabCase(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function normalizeTheme(theme) {
  if (theme === 'dark') {
    return { themeName: 'dark', cssVariables: {} };
  }

  if (theme === 'light' || theme == null) {
    return { themeName: 'light', cssVariables: {} };
  }

  if (typeof theme === 'object') {
    const cssVariables = Object.entries(theme).reduce((accumulator, [key, value]) => {
      const variableName = key.startsWith('--') ? key : `--${toKebabCase(key)}`;
      accumulator[variableName] = value;
      return accumulator;
    }, {});

    return { themeName: null, cssVariables };
  }

  return { themeName: 'light', cssVariables: {} };
}

/**
 * Provide OrbitUI theme and brand configuration to the component tree.
 *
 * @param {object} props
 * @param {'light' | 'dark' | Record<string, string>} [props.theme='light']
 * @param {'brand-a' | 'brand-b' | null} [props.brand=null]
 * @param {string} [props.as='div']
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
export function OrbitProvider({
  theme = 'light',
  brand = null,
  as = 'div',
  children,
  ...restProps
}) {
  const { themeName, cssVariables } = normalizeTheme(theme);
  const contextValue = {
    theme,
    themeName: themeName ?? 'custom',
    brand,
    cssVariables,
  };

  return (
    <OrbitProviderContext value={contextValue}>
      {createElement(
        as,
        {
          'data-orbit-provider': '',
          'data-theme': themeName === 'dark' ? 'dark' : undefined,
          'data-brand': brand || undefined,
          style: Object.keys(cssVariables).length > 0 ? cssVariables : undefined,
          ...restProps,
        },
        children,
      )}
    </OrbitProviderContext>
  );
}

export { useOrbitContext };

export default OrbitProvider;
