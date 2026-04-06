import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email address',
    placeholder: 'you@orbitui.dev',
    helperText: 'We will use this for release notifications.',
    isInvalid: false,
    isRequired: false,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Input provides labeled text field behavior with helper messaging, validation state, and optional leading or trailing addons.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for the standard text input API.',
      },
      source: { state: 'open' },
    },
  },
};

export const WithAddons = {
  parameters: {
    docs: {
      description: {
        story:
          'Leading and trailing addons help communicate URL prefixes, shortcuts, or inline actions.',
      },
    },
  },
  render: () => (
    <div className="grid max-w-md gap-4">
      <Input
        label="Workspace URL"
        leftAddon={<span aria-hidden="true">https://</span>}
        placeholder="orbitui.app"
        helperText="Choose a unique subdomain."
      />
      <Input
        label="Search"
        placeholder="Find components"
        rightAddon={<span aria-hidden="true">?K</span>}
      />
    </div>
  ),
};

export const Invalid = {
  parameters: {
    docs: {
      description: {
        story:
          'Validation errors are surfaced through error messaging while preserving label and input relationships.',
      },
    },
  },
  args: {
    label: 'Password',
    type: 'password',
    value: 'short',
    isInvalid: true,
    errorMessage: 'Password must be at least 12 characters.',
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled fields stay readable but non-editable for locked workspace state.',
      },
    },
  },
  args: {
    label: 'Organization',
    value: 'OrbitUI',
    isDisabled: true,
  },
};
