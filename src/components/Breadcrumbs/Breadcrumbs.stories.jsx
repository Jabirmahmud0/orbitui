import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    separator: '/',
    maxItems: undefined,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  },
};

export const Default = {
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
  render: () => (
    <Breadcrumbs
      aria-label="Chevron breadcrumb trail"
      separator={<span aria-hidden="true">�</span>}
    >
      <Breadcrumbs.Item href="/workspace">Workspace</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/workspace/analytics">Analytics</Breadcrumbs.Item>
      <Breadcrumbs.Item>Funnels</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const DisabledItem = {
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
