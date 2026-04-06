import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Breadcrumbs, BreadcrumbsItem } from './Breadcrumbs';

function renderBreadcrumbTrail(props = {}) {
  return renderWithProviders(
    <Breadcrumbs aria-label="Project breadcrumb trail" {...props}>
      <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/projects">Projects</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/projects/orbitui">OrbitUI</Breadcrumbs.Item>
      <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
    </Breadcrumbs>,
  );
}

describe('Breadcrumbs', () => {
  it('renders a navigation landmark with breadcrumb items', () => {
    renderBreadcrumbTrail();

    expect(
      screen.getByRole('navigation', { name: 'Project breadcrumb trail' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
  });

  it('marks the final visible item as the current page', () => {
    renderBreadcrumbTrail();

    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });

  it('renders a custom separator', () => {
    renderBreadcrumbTrail({ separator: <span aria-hidden="true">�</span> });

    expect(screen.getAllByText('�')).toHaveLength(3);
  });

  it('collapses middle items when maxItems is exceeded', () => {
    renderWithProviders(
      <Breadcrumbs
        aria-label="Collapsed breadcrumb trail"
        maxItems={4}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
      >
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/workspace">Workspace</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/workspace/apps">Apps</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/workspace/apps/orbitui">OrbitUI</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/workspace/apps/orbitui/docs">Docs</Breadcrumbs.Item>
        <Breadcrumbs.Item>Accessibility</Breadcrumbs.Item>
      </Breadcrumbs>,
    );

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Workspace' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('applies disabled state to disabled items', () => {
    renderWithProviders(
      <Breadcrumbs aria-label="Disabled breadcrumb trail">
        <Breadcrumbs.Item href="/account">Account</Breadcrumbs.Item>
        <Breadcrumbs.Item isDisabled href="/account/team">
          Team
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Billing</Breadcrumbs.Item>
      </Breadcrumbs>,
    );

    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('throws when an item is rendered outside Breadcrumbs', () => {
    expect(() =>
      renderWithProviders(<BreadcrumbsItem href="/orphan">Orphan</BreadcrumbsItem>),
    ).toThrow('Breadcrumbs context must be used within Breadcrumbs.Provider');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderBreadcrumbTrail();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
