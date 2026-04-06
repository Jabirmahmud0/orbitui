# OrbitUI

[![CI](https://github.com/Jabirmahmud0/orbitui/actions/workflows/ci.yml/badge.svg)](https://github.com/Jabirmahmud0/orbitui/actions/workflows/ci.yml)
[![Release](https://github.com/Jabirmahmud0/orbitui/actions/workflows/release.yml/badge.svg)](https://github.com/Jabirmahmud0/orbitui/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/%40orbitui%2Freact)](https://www.npmjs.com/package/@orbitui/react)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

OrbitUI is an enterprise-ready React component library and design system focused on accessible primitives, multi-brand theming, and predictable packaging for modern app teams.

## Highlights

- Accessible React primitives backed by keyboard and axe-core coverage
- CSS variable token system with light, dark, and brand-aware theming
- Storybook documentation with component docs, token reference, and guides
- ESM and CJS package output with subpath exports and preserved modules
- CI, bundle budget checks, conventional commits, and semantic-release automation

## Install

```bash
npm install @orbitui/react react react-dom
```

Peer requirements:

- `react >= 18.2.0`
- `react-dom >= 18.2.0`

## Quick Start

```jsx
import React from 'react';
import { Button, Input, OrbitProvider } from '@orbitui/react';

export function App() {
  return (
    <OrbitProvider theme="light">
      <div style={{ display: 'grid', gap: '1rem', maxWidth: 320 }}>
        <Input label="Email" placeholder="you@example.com" />
        <Button variant="primary">Create account</Button>
      </div>
    </OrbitProvider>
  );
}
```

## Available Components

Current root exports include:

- `Breadcrumbs`
- `Button`
- `Checkbox`
- `Input`
- `Pagination`
- `RadioGroup`
- `Tabs`
- `Textarea`
- `Tooltip`
- `OrbitProvider`
- `orbitTokens`

Utility and hook subpath exports are also available:

- `@orbitui/react/hooks/useControllableState`
- `@orbitui/react/hooks/useId`
- `@orbitui/react/hooks/useMediaQuery`
- `@orbitui/react/utils/cn`
- `@orbitui/react/utils/composeRefs`
- `@orbitui/react/utils/createContext`
- `@orbitui/react/utils/polymorphic`
- `@orbitui/react/providers/OrbitProvider`

## Theming

OrbitUI ships with generated design tokens and runtime CSS variables. `OrbitProvider` controls active theme and brand context for the library.

```jsx
import { OrbitProvider } from '@orbitui/react';

export function Root() {
  return (
    <OrbitProvider theme="dark" brand="brand-a">
      {/* app */}
    </OrbitProvider>
  );
}
```

Supported theming concepts in the current build:

- `light` and `dark` semantic themes
- multi-brand overrides for `brand-a` and `brand-b`
- generated token payload exposed as `orbitTokens`

## Architecture

The package is organized around a few stable layers:

- `src/tokens`: source tokens and generated CSS/JS outputs
- `src/utils`: composition helpers such as `cn`, `composeRefs`, and safe context utilities
- `src/hooks`: shared state and environment hooks
- `src/providers`: top-level runtime providers like `OrbitProvider`
- `src/components`: accessible UI primitives and compound components
- `.storybook`: docs site, MDX guides, and autodocs configuration

## Development

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run build` builds the library with preserved ESM and CJS modules
- `npm run test` runs the Vitest suite with coverage
- `npm run lint` runs ESLint across the workspace
- `npm run storybook` starts the docs site locally
- `npm run storybook:build` builds the static docs site
- `npm run check:bundle` enforces bundle size budgets

## Quality Gates

OrbitUI includes automated checks for:

- component tests with Testing Library and Vitest
- accessibility audits with axe-core
- keyboard navigation regression coverage
- Storybook documentation builds
- semantic-release automation for versioning and npm publishing

## Package Output

The published package is set up for application and library consumers:

- dual ESM and CJS entry points
- subpath exports for components, hooks, providers, and utilities
- CSS files marked as side effects so styles are not tree-shaken away
- public scoped npm publishing through `@orbitui/react`

## Documentation

Storybook content in this repo includes:

- introduction, installation, and getting started guides
- design token reference with visual swatches
- theming and accessibility guides
- autodocs-backed component reference pages

## Roadmap Status

The current release branch includes the foundational system and first component wave. More overlay and complex components remain tracked in [`task.md`](./task.md).

## License

OrbitUI is released under the [MIT License](./LICENSE).
