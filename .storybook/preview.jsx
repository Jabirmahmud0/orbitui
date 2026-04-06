import '../src/index.css';

import { OrbitProvider } from '../src/providers/OrbitProvider';

export const decorators = [
  (Story) => (
    <OrbitProvider>
      <div
        style={{ minHeight: '100vh', padding: '24px', background: 'var(--color-background-page)' }}
      >
        <Story />
      </div>
    </OrbitProvider>
  ),
];

export const parameters = {
  a11y: {
    test: 'todo',
  },
  controls: {
    expanded: true,
  },
  layout: 'centered',
};
