import '../src/index.css';

import { OrbitProvider } from '../src/providers/OrbitProvider';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global OrbitUI theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
  brand: {
    name: 'Brand',
    description: 'Global OrbitUI brand',
    defaultValue: 'default',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'default', title: 'Default' },
        { value: 'brand-a', title: 'Brand A' },
        { value: 'brand-b', title: 'Brand B' },
      ],
      dynamicTitle: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
    const brand = context.globals.brand === 'default' ? null : context.globals.brand;

    return (
      <OrbitProvider theme={theme} brand={brand}>
        <div
          style={{
            padding: '20px',
            width: '100%',
            background: 'var(--color-background-page)',
            color: 'var(--color-foreground-primary)',
          }}
        >
          <Story />
        </div>
      </OrbitProvider>
    );
  },
];

export const parameters = {
  a11y: {
    test: 'todo',
  },
  controls: {
    expanded: true,
    sort: 'requiredFirst',
  },
  docs: {
    source: {
      state: 'hidden',
    },
  },
  layout: 'padded',
  options: {
    storySort: {
      order: [
        'Introduction',
        'Installation',
        'Getting Started',
        'Design Tokens',
        'Theming',
        'Accessibility',
        'Components',
      ],
    },
  },
};


