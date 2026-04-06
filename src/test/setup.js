import '@testing-library/jest-dom/vitest';

import { cleanup, render } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

HTMLCanvasElement.prototype.getContext = () => ({
  measureText: () => ({ width: 0 }),
});

afterEach(() => {
  cleanup();
});

export function renderWithProviders(ui, options = {}) {
  return render(ui, options);
}
