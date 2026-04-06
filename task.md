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
      *Commit: `chore: initialize project with React, Vite, and barebones structure`*
- [x] **Task 1.2**: Configure Tailwind CSS v4, PostCSS, and base styles  
      *Commit: `build: configure Tailwind CSS v4 and base layer`*
- [ ] **Task 1.3**: Configure ESLint, Prettier, and editor config  
      *Commit: `chore: configure ESLint and Prettier for code quality`*
- [ ] **Task 1.4**: Configure Vitest, Testing Library, and axe-core test setup  
      *Commit: `test: set up Vitest and Testing Library with axe-core`*

---

## Phase 2 — Design Token Architecture

- [ ] **Task 2.1**: Create base token files (colors, spacing, typography, radii, shadows)  
      *Commit: `feat: define core design tokens (colors, spacing, typography)`*
- [ ] **Task 2.2**: Create semantic theme tokens (default light + dark)  
      *Commit: `feat: generate light and dark semantic themes`*
- [ ] **Task 2.3**: Create brand override tokens (brand-a + brand-b)  
      *Commit: `feat: implement multi-brand token overrides`*
- [ ] **Task 2.4**: Configure Style Dictionary — build pipeline + generated outputs  
      *Commit: `build: setup Style Dictionary for token transformation`*
- [ ] **Task 2.5**: Wire generated CSS variables into Tailwind v4 config  
      *Commit: `feat: integrate JS and CSS tokens into Tailwind config`*

---

## Phase 3 — Core Infrastructure & Patterns

- [ ] **Task 3.1**: Build utility functions — `cn()`, `composeRefs()`, `polymorphic.js`  
      *Commit: `feat: add core utility functions (cn, composeRefs, polymorphic)`*
- [ ] **Task 3.2**: Build `createSafeContext()` for compound component pattern  
      *Commit: `feat: create safe context provider for compound components`*
- [ ] **Task 3.3**: Build core hooks — `useControllableState`, `useId`, `useMediaQuery`  
      *Commit: `feat: implement core custom React hooks`*
- [ ] **Task 3.4**: Build `OrbitProvider` — theme/brand context + CSS var injection  
      *Commit: `feat: create OrbitProvider for theme and brand context injection`*

---

## Phase 4 — Component Library

### Tier 1 — Primitives (no dependencies on other components)

- [ ] **Task 4.1**: Button — polymorphic, variants, loading, icons  
      *Commit: `feat: implement Button component with polymorphic support`*
- [ ] **Task 4.2**: Button — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Button`*
- [ ] **Task 4.3**: Input — controlled/uncontrolled, validation, addons  
      *Commit: `feat: implement accessible Input component`*
- [ ] **Task 4.4**: Input — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Input`*
- [ ] **Task 4.5**: Textarea — auto-resize, character count  
      *Commit: `feat: implement auto-resizing Textarea component`*
- [ ] **Task 4.6**: Textarea — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Textarea`*
- [ ] **Task 4.7**: Checkbox — indeterminate, custom icons  
      *Commit: `feat: implement custom accessible Checkbox`*
- [ ] **Task 4.8**: Checkbox — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Checkbox`*

### Tier 2 — Compound Primitives

- [ ] **Task 4.9**: RadioGroup — compound pattern, orientation  
      *Commit: `feat: implement RadioGroup with compound architecture`*
- [ ] **Task 4.10**: RadioGroup — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for RadioGroup`*
- [ ] **Task 4.11**: Tooltip — placement, delay, arrow  
      *Commit: `feat: implement accessible Tooltip component`*
- [ ] **Task 4.12**: Tooltip — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Tooltip`*
- [ ] **Task 4.13**: Tabs — compound pattern, orientations, controlled/uncontrolled  
      *Commit: `feat: implement Tabs component with compound architecture`*
- [ ] **Task 4.14**: Tabs — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for Tabs`*
- [ ] **Task 4.15**: Breadcrumbs — compound, separator, collapse  
      *Commit: `feat: implement semantic Breadcrumbs component`*
- [ ] **Task 4.16**: Breadcrumbs — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Breadcrumbs`*
- [ ] **Task 4.17**: Pagination — controlled/uncontrolled, ellipsis  
      *Commit: `feat: implement accessible Pagination component`*
- [ ] **Task 4.18**: Pagination — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for Pagination`*

### Tier 3 — Overlay Components

- [ ] **Task 4.19**: Modal/Dialog — compound, focus trap, scroll lock, sizes  
      *Commit: `feat: implement Modal/Dialog with focus trapping`*
- [ ] **Task 4.20**: Modal/Dialog — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Modal`*
- [ ] **Task 4.21**: Dropdown — compound, sections, keyboard nav  
      *Commit: `feat: implement accessible Dropdown menu component`*
- [ ] **Task 4.22**: Dropdown — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for Dropdown`*
- [ ] **Task 4.23**: Select — searchable, grouped, multi-select  
      *Commit: `feat: implement advanced Select component`*
- [ ] **Task 4.24**: Select — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for Select`*
- [ ] **Task 4.25**: Toast/Notification — provider, imperative API, stacking  
      *Commit: `feat: implement Toast notifications system`*
- [ ] **Task 4.26**: Toast/Notification — stories + unit tests + a11y tests  
      *Commit: `test: add stories and unit tests for Toast`*

### Tier 4 — Complex Components

- [ ] **Task 4.27**: Combobox — type-ahead, async, virtualization  
      *Commit: `feat: implement virtualized Combobox component`*
- [ ] **Task 4.28**: Combobox — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for Combobox`*
- [ ] **Task 4.29**: DataTable — sorting, filtering, selection, virtualization  
      *Commit: `feat: implement high-performance DataTable component`*
- [ ] **Task 4.30**: DataTable — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for DataTable`*
- [ ] **Task 4.31**: CommandPalette — Cmd+K, grouped actions, search  
      *Commit: `feat: implement CommandPalette interface`*
- [ ] **Task 4.32**: CommandPalette — stories + unit tests + a11y tests  
      *Commit: `test: add stories and tests for CommandPalette`*

---

## Phase 5 — Accessibility Audit & Hardening

- [ ] **Task 5.1**: Full axe-core audit pass across all components — fix any violations  
      *Commit: `fix: global accessibility improvements from axe-core audit`*
- [ ] **Task 5.2**: Keyboard navigation audit — verify every component works keyboard-only  
      *Commit: `fix: refine keyboard navigation across library components`*
- [ ] **Task 5.3**: Add Storybook a11y addon + configure global panel  
      *Commit: `chore: integrate Storybook a11y addon`*

---

## Phase 6 — Storybook Documentation Site

- [ ] **Task 6.1**: Configure Storybook 8 — main.js, preview.js, theme switcher  
      *Commit: `docs: initialize Storybook and setup global previews`*
- [ ] **Task 6.2**: Write MDX docs — Introduction, Installation, Getting Started  
      *Commit: `docs: write core documentation pages (Intro, Install)`*
- [ ] **Task 6.3**: Write MDX docs — Design Tokens reference with visual swatches  
      *Commit: `docs: create design token reference page`*
- [ ] **Task 6.4**: Write MDX docs — Theming guide + Accessibility guide  
      *Commit: `docs: compose theming and accessibility guides`*
- [ ] **Task 6.5**: Enable autodocs + polish all component doc pages  
      *Commit: `docs: refine component auto-documentation output`*

---

## Phase 7 — Build, Packaging & Bundle

- [ ] **Task 7.1**: Configure Vite library mode — ESM + CJS dual output, preserveModules  
      *Commit: `build: setup Vite for robust library module output`*
- [ ] **Task 7.2**: Configure `package.json` exports map, peerDependencies, sideEffects  
      *Commit: `chore: finalize package.json exports mapping and dependencies`*
- [ ] **Task 7.3**: Build `src/index.js` barrel export — public API surface  
      *Commit: `feat: expose library API via root barrel file`*
- [ ] **Task 7.4**: Bundle size check script + budget enforcement  
      *Commit: `build: implement automated bundle size budgeting scripts`*

---

## Phase 8 — CI/CD Pipeline

- [ ] **Task 8.1**: GitHub Actions CI workflow — lint, test, build, a11y, bundle size  
      *Commit: `ci: construct comprehensive quality gate workflow`*
- [ ] **Task 8.2**: Commit linting — commitlint + husky + lint-staged pre-commit hooks  
      *Commit: `ci: enforce conventional commits and staged linting checks`*
- [ ] **Task 8.3**: GitHub Actions release workflow — automated NPM publish + changelog  
      *Commit: `ci: implement automated semantic release pipeline`*

---

## Phase 9 — Public Release

- [ ] **Task 9.1**: Write README.md — badges, quick start, architecture, examples  
      *Commit: `docs: write comprehensive public README`*
- [ ] **Task 9.2**: Write CONTRIBUTING.md + CHANGELOG.md  
      *Commit: `docs: add code of conduct, contributing, and changelog stubs`*
- [ ] **Task 9.3**: Deploy Storybook to Vercel  
      *Commit: `ci: setup Vercel deployment for Storybook instance`*
- [ ] **Task 9.4**: Publish v1.0.0 to NPM  
      *Commit: `release: publish orbitui@1.0.0 to NPM registry`*
- [ ] **Task 9.5**: Final smoke test — install in clean project + verify tree-shaking  
      *Commit: `test: verify final module output tree-shaking efficacy`*

---

## Progress Summary

| Phase | Tasks | Done |
|---|---|---|
| 1. Scaffolding | 4 | 2 |
| 2. Design Tokens | 5 | 0 |
| 3. Core Infra | 4 | 0 |
| 4. Components | 32 | 0 |
| 5. A11y Audit | 3 | 0 |
| 6. Storybook Docs | 5 | 0 |
| 7. Build & Package | 4 | 0 |
| 8. CI/CD | 3 | 0 |
| 9. Release | 5 | 0 |
| **Total** | **65** | **2** |

