# OrbitUI — Task Tracker

> **Workflow**: Complete task → get commit command and push to GitHub → say "done" → next task

## Decisions Locked

- ✅ All 16 components (full scope, built in smart dependency order)
- ✅ Tailwind CSS v4
- ✅ NPM scope: `@orbitui/react`
- ✅ Multi-brand theming in v1 (2 brands)
- ✅ Storybook deployed on Vercel

---

## Phase 1 — Project Scaffolding & Toolchain

- [x] **Task 1.1**: Initialize repo — `package.json`, `.gitignore`, `LICENSE`, Vite + React setup  
       _Commit: `chore: initialize project with React, Vite, and barebones structure`_
- [x] **Task 1.2**: Configure Tailwind CSS v4, PostCSS, and base styles  
       _Commit: `build: configure Tailwind CSS v4 and base layer`_
- [x] **Task 1.3**: Configure ESLint, Prettier, and editor config  
       _Commit: `chore: configure ESLint and Prettier for code quality`_
- [x] **Task 1.4**: Configure Vitest, Testing Library, and axe-core test setup  
       _Commit: `test: set up Vitest and Testing Library with axe-core`_

---

## Phase 2 — Design Token Architecture

- [x] **Task 2.1**: Create base token files (colors, spacing, typography, radii, shadows)  
       _Commit: `feat: define core design tokens (colors, spacing, typography)`_
- [x] **Task 2.2**: Create semantic theme tokens (default light + dark)  
       _Commit: `feat: generate light and dark semantic themes`_
- [x] **Task 2.3**: Create brand override tokens (brand-a + brand-b)  
       _Commit: `feat: implement multi-brand token overrides`_
- [x] **Task 2.4**: Configure Style Dictionary — build pipeline + generated outputs  
       _Commit: `build: setup Style Dictionary for token transformation`_
- [x] **Task 2.5**: Wire generated CSS variables into Tailwind v4 config  
       _Commit: `feat: integrate JS and CSS tokens into Tailwind config`_

---

## Phase 3 — Core Infrastructure & Patterns

- [x] **Task 3.1**: Build utility functions — `cn()`, `composeRefs()`, `polymorphic.js`  
       _Commit: `feat: add core utility functions (cn, composeRefs, polymorphic)`_
- [x] **Task 3.2**: Build `createSafeContext()` for compound component pattern  
       _Commit: `feat: create safe context provider for compound components`_
- [x] **Task 3.3**: Build core hooks — `useControllableState`, `useId`, `useMediaQuery`  
       _Commit: `feat: implement core custom React hooks`_
- [x] **Task 3.4**: Build `OrbitProvider` — theme/brand context + CSS var injection  
       _Commit: `feat: create OrbitProvider for theme and brand context injection`_

---

## Phase 4 — Component Library

### Tier 1 — Primitives (no dependencies on other components)

- [x] **Task 4.1**: Button — polymorphic, variants, loading, icons  
       _Commit: `feat: implement Button component with polymorphic support`_
- [x] **Task 4.2**: Button — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Button`_
- [x] **Task 4.3**: Input — controlled/uncontrolled, validation, addons  
       _Commit: `feat: implement accessible Input component`_
- [x] **Task 4.4**: Input — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Input`_
- [x] **Task 4.5**: Textarea — auto-resize, character count  
       _Commit: `feat: implement auto-resizing Textarea component`_
- [x] **Task 4.6**: Textarea — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Textarea`_
- [x] **Task 4.7**: Checkbox — indeterminate, custom icons  
       _Commit: `feat: implement custom accessible Checkbox`_
- [x] **Task 4.8**: Checkbox — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Checkbox`_

### Tier 2 — Compound Primitives

- [x] **Task 4.9**: RadioGroup — compound pattern, orientation  
       _Commit: `feat: implement RadioGroup with compound architecture`_
- [x] **Task 4.10**: RadioGroup — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for RadioGroup`_
- [x] **Task 4.11**: Tooltip — placement, delay, arrow  
       _Commit: `feat: implement accessible Tooltip component`_
- [x] **Task 4.12**: Tooltip — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Tooltip`_
- [x] **Task 4.13**: Tabs — compound pattern, orientations, controlled/uncontrolled  
       _Commit: `feat: implement Tabs component with compound architecture`_
- [x] **Task 4.14**: Tabs — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for Tabs`_
- [x] **Task 4.15**: Breadcrumbs — compound, separator, collapse  
       _Commit: `feat: implement semantic Breadcrumbs component`_
- [x] **Task 4.16**: Breadcrumbs — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Breadcrumbs`_
- [x] **Task 4.17**: Pagination — controlled/uncontrolled, ellipsis  
       _Commit: `feat: implement accessible Pagination component`_
- [x] **Task 4.18**: Pagination — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for Pagination`_

### Tier 3 — Overlay Components

- [x] **Task 4.19**: Modal/Dialog — compound, focus trap, scroll lock, sizes  
       _Commit: `feat: implement Modal/Dialog with focus trapping`_
- [x] **Task 4.20**: Modal/Dialog — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Modal`_
- [x] **Task 4.21**: Dropdown — compound, sections, keyboard nav  
       _Commit: `feat: implement accessible Dropdown menu component`_
- [x] **Task 4.22**: Dropdown — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for Dropdown`_
- [x] **Task 4.23**: Select — searchable, grouped, multi-select  
       _Commit: `feat: implement advanced Select component`_
- [x] **Task 4.24**: Select — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for Select`_
- [x] **Task 4.25**: Toast/Notification — provider, imperative API, stacking  
       _Commit: `feat: implement Toast notifications system`_
- [x] **Task 4.26**: Toast/Notification — stories + unit tests + a11y tests  
       _Commit: `test: add stories and unit tests for Toast`_

### Tier 4 — Complex Components

- [x] **Task 4.27**: Combobox — type-ahead, async, virtualization  
       _Commit: `feat: implement virtualized Combobox component`_
- [x] **Task 4.28**: Combobox — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for Combobox`_
- [ ] **Task 4.29**: DataTable — sorting, filtering, selection, virtualization  
       _Commit: `feat: implement high-performance DataTable component`_
- [ ] **Task 4.30**: DataTable — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for DataTable`_
- [ ] **Task 4.31**: CommandPalette — Cmd+K, grouped actions, search  
       _Commit: `feat: implement CommandPalette interface`_
- [ ] **Task 4.32**: CommandPalette — stories + unit tests + a11y tests  
       _Commit: `test: add stories and tests for CommandPalette`_

---

## Phase 5 — Accessibility Audit & Hardening

- [x] **Task 5.1**: Full axe-core audit pass across all components — fix any violations  
       _Commit: `fix: global accessibility improvements from axe-core audit`_
- [x] **Task 5.2**: Keyboard navigation audit — verify every component works keyboard-only  
       _Commit: `fix: refine keyboard navigation across library components`_
- [x] **Task 5.3**: Add Storybook a11y addon + configure global panel  
       _Commit: `chore: integrate Storybook a11y addon`_

---

## Phase 6 — Storybook Documentation Site

- [x] **Task 6.1**: Configure Storybook 8 — main.js, preview.js, theme switcher  
       _Commit: `docs: initialize Storybook and setup global previews`_
- [x] **Task 6.2**: Write MDX docs — Introduction, Installation, Getting Started  
       _Commit: `docs: write core documentation pages (Intro, Install)`_
- [x] **Task 6.3**: Write MDX docs — Design Tokens reference with visual swatches  
       _Commit: `docs: create design token reference page`_
- [x] **Task 6.4**: Write MDX docs — Theming guide + Accessibility guide  
       _Commit: `docs: compose theming and accessibility guides`_
- [x] **Task 6.5**: Enable autodocs + polish all component doc pages  
       _Commit: `docs: refine component auto-documentation output`_

---

## Phase 7 — Build, Packaging & Bundle

- [x] **Task 7.1**: Configure Vite library mode — ESM + CJS dual output, preserveModules  
       _Commit: `build: setup Vite for robust library module output`_
- [x] **Task 7.2**: Configure `package.json` exports map, peerDependencies, sideEffects  
       _Commit: `chore: finalize package.json exports mapping and dependencies`_
- [x] **Task 7.3**: Build `src/index.js` barrel export — public API surface  
       _Commit: `feat: expose library API via root barrel file`_
- [x] **Task 7.4**: Bundle size check script + budget enforcement  
       _Commit: `build: implement automated bundle size budgeting scripts`_

---

## Phase 8 — CI/CD Pipeline

- [x] **Task 8.1**: GitHub Actions CI workflow — lint, test, build, a11y, bundle size  
       _Commit: `ci: construct comprehensive quality gate workflow`_
- [x] **Task 8.2**: Commit linting — commitlint + husky + lint-staged pre-commit hooks  
       _Commit: `ci: enforce conventional commits and staged linting checks`_
- [x] **Task 8.3**: GitHub Actions release workflow — automated NPM publish + changelog  
       _Commit: `ci: implement automated semantic release pipeline`_

---

## Phase 9 — Public Release

- [x] **Task 9.1**: Write README.md — badges, quick start, architecture, examples  
       _Commit: `docs: write comprehensive public README`_
- [x] **Task 9.2**: Write CONTRIBUTING.md + CHANGELOG.md  
       _Commit: `docs: add code of conduct, contributing, and changelog stubs`_
- [x] **Task 9.3**: Deploy Storybook to Vercel  
       _Commit: `ci: setup Vercel deployment for Storybook instance`_
- [ ] **Task 9.4**: Publish v1.0.0 to NPM  
       _Commit: `release: publish orbitui@1.0.0 to NPM registry`_
- [ ] **Task 9.5**: Final smoke test — install in clean project + verify tree-shaking  
       _Commit: `test: verify final module output tree-shaking efficacy`_

---

## Progress Summary

| Phase              | Tasks  | Done   |
| ------------------ | ------ | ------ |
| 1. Scaffolding     | 4      | 4      |
| 2. Design Tokens   | 5      | 5      |
| 3. Core Infra      | 4      | 4      |
| 4. Components      | 32     | 28     |
| 5. A11y Audit      | 3      | 3      |
| 6. Storybook Docs  | 5      | 5      |
| 7. Build & Package | 4      | 4      |
| 8. CI/CD           | 3      | 3      |
| 9. Release         | 5      | 3      |
| **Total**          | **65** | **59** |









