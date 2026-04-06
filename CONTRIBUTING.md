# Contributing to OrbitUI

Thanks for contributing to OrbitUI.

This repository is a React component library and design-system workspace. Changes should preserve accessibility, package stability, and documentation quality.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Git

## Getting Started

```bash
npm install
npm run dev
```

Useful local commands:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run storybook`
- `npm run storybook:build`
- `npm run check:bundle`

## Branching and Pull Requests

- Create a focused branch per change
- Keep pull requests scoped to one task or concern
- Update docs and stories when component behavior changes
- Do not commit generated `storybook-static`
- Do not commit planning-only local files such as `implementation_plan.md`

## Commit Convention

This repository uses Conventional Commits and commitlint.

Examples:

- `feat: add dialog close button`
- `fix: correct checkbox focus styles`
- `docs: update installation instructions`
- `test: add tooltip keyboard regression coverage`
- `build: tighten bundle budget thresholds`

If your commit message does not match the convention, the `commit-msg` hook will fail.

## Pre-commit Checks

Husky and lint-staged are configured in this repository.

On commit, staged files are automatically checked with:

- ESLint with `--fix` for `js` and `jsx`
- Prettier for staged JavaScript, JSON, Markdown, and CSS files

Before opening a PR, run the full verification set yourself:

```bash
npm run lint
npm run test
npm run build
npm run check:bundle
npm run storybook:build
```

## Component Change Expectations

When adding or changing a component:

- keep keyboard interaction intact
- preserve accessible labels, roles, and focus behavior
- add or update Storybook stories
- add or update unit and accessibility tests
- keep exports aligned with the intended public API

## Design Tokens and Theming

Token and theme work should stay aligned with the existing architecture:

- source token changes should flow through the Style Dictionary build
- semantic themes should keep light and dark support intact
- brand changes should preserve the current multi-brand model
- runtime theming should continue to work through `OrbitProvider`

## Release Process

Releases are automated through GitHub Actions and semantic-release.

Contributors should not manually edit versions for normal feature work. Versioning, changelog updates, GitHub releases, and npm publishing are handled by the release workflow after validated changes land on `main`.

## Reporting Issues

When opening an issue or PR, include:

- a clear description of the problem or change
- reproduction steps when relevant
- expected and actual behavior
- screenshots or Storybook references for UI changes
- accessibility notes when interaction changes are involved
