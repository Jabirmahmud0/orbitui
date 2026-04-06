import '@testing-library/jest-dom/vitest';

import { createElement } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

import { OrbitProvider } from '../providers/OrbitProvider';

expect.extend(matchers);

HTMLCanvasElement.prototype.getContext = () => ({
  measureText: () => ({ width: 0 }),
});

const originalGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element, pseudoElt) => {
  if (pseudoElt) {
    return originalGetComputedStyle(element);
  }

  return originalGetComputedStyle(element, pseudoElt);
};

afterEach(() => {
  cleanup();
});

export function renderWithProviders(ui, options = {}) {
  return render(createElement(OrbitProvider, null, ui), options);
}
