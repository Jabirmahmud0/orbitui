import { useState } from 'react';

import { Button } from '../Button';
import { Dropdown } from './Dropdown';

function DefaultDropdownStory(args) {
  return (
    <div className="flex min-h-56 items-start justify-start p-6">
      <Dropdown {...args}>
        <Dropdown.Trigger>Open menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Workspace menu</Dropdown.Label>
          <Dropdown.Section title="Account">
            <Dropdown.Item shortcut="G P">Profile</Dropdown.Item>
            <Dropdown.Item shortcut="G B">Billing</Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Separator />
          <Dropdown.Section title="Preferences">
            <Dropdown.Item>Notifications</Dropdown.Item>
            <Dropdown.Item>Keyboard shortcuts</Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}

function ControlledDropdownStory() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-56 flex-col items-start gap-4 p-6">
      <p className="text-sm text-[var(--color-foreground-secondary)]">
        Dropdown state: {open ? 'open' : 'closed'}
      </p>
      <Dropdown open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>Workspace actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Section title="Session">
            <Dropdown.Item onSelect={() => setOpen(false)}>Switch workspace</Dropdown.Item>
            <Dropdown.Item closeOnSelect={false}>Keep menu open</Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}

function DestructiveDropdownStory() {
  return (
    <div className="flex min-h-56 items-start justify-start p-6">
      <Dropdown defaultOpen>
        <Dropdown.Trigger asChild>
          <Button variant="outline">Danger zone</Button>
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          <Dropdown.Label>Project controls</Dropdown.Label>
          <Dropdown.Item>Archive project</Dropdown.Item>
          <Dropdown.Item tone="danger">Delete project</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}

function PlacementStory() {
  return (
    <div className="grid min-h-80 gap-6 p-6 sm:grid-cols-2">
      <Dropdown>
        <Dropdown.Trigger>Bottom start</Dropdown.Trigger>
        <Dropdown.Content side="bottom" align="start">
          <Dropdown.Item>New file</Dropdown.Item>
          <Dropdown.Item>Import</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger>Bottom end</Dropdown.Trigger>
        <Dropdown.Content side="bottom" align="end">
          <Dropdown.Item>Share</Dropdown.Item>
          <Dropdown.Item>Export</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown defaultOpen>
        <Dropdown.Trigger>Top start</Dropdown.Trigger>
        <Dropdown.Content side="top" align="start">
          <Dropdown.Item>Reopen</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger>Centered</Dropdown.Trigger>
        <Dropdown.Content align="center">
          <Dropdown.Item>Preferences</Dropdown.Item>
          <Dropdown.Item>Support</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    closeOnSelect: true,
  },
  argTypes: {
    closeOnSelect: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown provides a compound menu API with grouped sections, keyboard navigation, dismissable overlays, destructive action styling, and controllable open state.',
      },
    },
  },
};

export const Default = {
  render: (args) => <DefaultDropdownStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive dropdown playground showing labels, sections, shortcuts, and standard actions.',
      },
      source: { state: 'open' },
    },
  },
};

export const Controlled = {
  render: () => <ControlledDropdownStory />,
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode keeps menu visibility in parent state for advanced coordination.',
      },
    },
  },
};

export const DestructiveActions = {
  render: () => <DestructiveDropdownStory />,
  parameters: {
    docs: {
      description: {
        story: 'Destructive items get visual emphasis while preserving the same menuitem semantics.',
      },
    },
  },
};

export const PlacementVariants = {
  render: () => <PlacementStory />,
  parameters: {
    docs: {
      description: {
        story: 'Alignment and side variants help menus anchor cleanly to different trigger layouts.',
      },
    },
  },
};
