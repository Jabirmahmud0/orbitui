import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    separator: '/',
    maxItems: undefined,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumbs renders hierarchical navigation trails with support for custom separators, disabled items, and overflow collapse.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Standard breadcrumb trail for product and settings navigation.',
      },
      source: { state: 'open' },
    },
  },
  render: (args) => (
    <Breadcrumbs {...args} aria-label="Project breadcrumb trail">
      <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/projects">Projects</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orbitui">OrbitUI</Breadcrumbs.Item>
      <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const Collapsed = {
  parameters: {
    docs: {
      description: {
        story: 'Collapses middle items for long paths while keeping the beginning and end visible.',
      },
    },
  },
  render: () => (
    <Breadcrumbs
      aria-label="Collapsed breadcrumb trail"
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    >
      <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/ui">UI Kits</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/ui/orbit">OrbitUI</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/ui/orbit/docs">Docs</Breadcrumbs.Item>
      <Breadcrumbs.Item>Accessibility</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const CustomSeparator = {
  parameters: {
    docs: {
      description: {
        story: 'Accepts a custom separator node for stronger visual direction.',
      },
    },
  },
  render: () => (
    <Breadcrumbs
      aria-label="Chevron breadcrumb trail"
      separator={<span aria-hidden="true">&gt;</span>}
    >
      <Breadcrumbs.Item href="/workspace">Workspace</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/workspace/analytics">Analytics</Breadcrumbs.Item>
      <Breadcrumbs.Item>Funnels</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const DisabledItem = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled items stay visible in the trail without being keyboard actionable.',
      },
    },
  },
  render: () => (
    <Breadcrumbs aria-label="Disabled breadcrumb trail">
      <Breadcrumbs.Item href="/account">Account</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/account/team">Team</Breadcrumbs.Item>
      <Breadcrumbs.Item isDisabled href="/account/team/enterprise">
        Enterprise
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>Billing</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};
