import { useState } from 'react';

import { Tabs } from './Tabs';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export const Default = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <Tabs.List aria-label="Project sections">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">Overview content</Tabs.Content>
      <Tabs.Content value="activity">Activity content</Tabs.Content>
      <Tabs.Content value="settings">Settings content</Tabs.Content>
    </Tabs>
  ),
};

export const Vertical = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Tabs {...args} defaultValue="design" className="max-w-xl">
      <Tabs.List aria-label="Workspace areas">
        <Tabs.Trigger value="design">Design</Tabs.Trigger>
        <Tabs.Trigger value="content">Content</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="design">Design tools and previews.</Tabs.Content>
      <Tabs.Content value="content">Content editing surface.</Tabs.Content>
      <Tabs.Content value="analytics">Analytics dashboards.</Tabs.Content>
    </Tabs>
  ),
};

export const Controlled = {
  render: () => {
    function ControlledTabsExample() {
      const [value, setValue] = useState('deployments');

      return (
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Runtime views">
            <Tabs.Trigger value="deployments">Deployments</Tabs.Trigger>
            <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
            <Tabs.Trigger value="alerts">Alerts</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="deployments">Selected: {value}</Tabs.Content>
          <Tabs.Content value="logs">Selected: {value}</Tabs.Content>
          <Tabs.Content value="alerts">Selected: {value}</Tabs.Content>
        </Tabs>
      );
    }

    return <ControlledTabsExample />;
  },
};

export const DisabledTab = {
  render: () => (
    <Tabs defaultValue="general">
      <Tabs.List aria-label="Billing tabs">
        <Tabs.Trigger value="general">General</Tabs.Trigger>
        <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
        <Tabs.Trigger value="enterprise" isDisabled>
          Enterprise
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="general">General billing details.</Tabs.Content>
      <Tabs.Content value="usage">Usage-based billing details.</Tabs.Content>
      <Tabs.Content value="enterprise">Enterprise billing details.</Tabs.Content>
    </Tabs>
  ),
};
