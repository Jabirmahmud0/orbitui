import { useState } from 'react';

import { CommandPalette } from './CommandPalette';

const actions = [
  {
    id: 'deploy',
    label: 'Deploy preview',
    description: 'Build and share a new preview deployment.',
    group: 'Shipping',
    shortcut: 'D',
    keywords: ['release', 'vercel'],
  },
  {
    id: 'rollback',
    label: 'Rollback release',
    description: 'Restore the previous production build.',
    group: 'Shipping',
    shortcut: 'R',
  },
  {
    id: 'invite',
    label: 'Invite teammate',
    description: 'Grant workspace access to a collaborator.',
    group: 'People',
    shortcut: 'I',
  },
  {
    id: 'billing',
    label: 'Open billing',
    description: 'Review invoices and plan usage.',
    group: 'Workspace',
    shortcut: 'B',
    disabled: true,
  },
];

function ControlledPaletteStory() {
  const [selectedAction, setSelectedAction] = useState('Nothing selected yet');

  return (
    <div className="space-y-4">
      <CommandPalette
        items={actions}
        showTrigger
        triggerLabel="Open workspace search"
        onSelect={(item) => setSelectedAction(`Selected: ${item.label}`)}
      />
      <p className="text-sm text-[var(--color-foreground-secondary)]">{selectedAction}</p>
    </div>
  );
}

export default {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: {
    items: actions,
    showTrigger: true,
    triggerLabel: 'Open command palette',
  },
  parameters: {
    docs: {
      description: {
        component:
          'CommandPalette provides a keyboard-first workspace search surface with grouped actions, hotkeys, and compact command metadata.',
      },
    },
  },
};

export const Default = {
  render: (args) => <CommandPalette {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Standard command search entry point with grouped actions and shortcut metadata.',
      },
      source: { state: 'open' },
    },
  },
};

export const SelectionFeedback = {
  render: () => <ControlledPaletteStory />,
  parameters: {
    docs: {
      description: {
        story: 'Selection callbacks can drive command history, status messaging, or follow-up UI flows.',
      },
    },
  },
};

export const EmptyState = {
  args: {
    items: [],
    defaultOpen: true,
    showTrigger: false,
    emptyMessage: 'No commands have been configured for this workspace.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty states are useful when commands are permission-gated or still loading from a remote source.',
      },
    },
  },
};
