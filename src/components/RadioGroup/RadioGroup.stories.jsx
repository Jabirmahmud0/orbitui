import { RadioGroup } from './RadioGroup';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Deployment strategy',
    helperText: 'Choose how updates roll out to your workspace.',
    orientation: 'vertical',
    size: 'md',
    isDisabled: false,
    isInvalid: false,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'RadioGroup manages single-choice selection with compound items, orientation control, descriptions, and validation state.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Vertical single-select group with descriptions for each option.',
      },
      source: { state: 'open' },
    },
  },
  render: (args) => (
    <RadioGroup {...args} defaultValue="staged">
      <RadioGroup.Item value="staged" description="Release gradually over 24 hours.">
        Staged rollout
      </RadioGroup.Item>
      <RadioGroup.Item value="instant" description="Deploy to everyone immediately.">
        Instant release
      </RadioGroup.Item>
      <RadioGroup.Item value="manual" description="Trigger the release manually after approval.">
        Manual approval
      </RadioGroup.Item>
    </RadioGroup>
  ),
};

export const Horizontal = {
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout works well for short option sets and compact settings rows.',
      },
    },
  },
  args: {
    label: 'Density',
    helperText: 'Switch between layout presets.',
    orientation: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args} defaultValue="comfortable">
      <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
      <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
      <RadioGroup.Item value="spacious">Spacious</RadioGroup.Item>
    </RadioGroup>
  ),
};

export const Invalid = {
  parameters: {
    docs: {
      description: {
        story: 'Validation errors can be attached to the group when selection is required.',
      },
    },
  },
  args: {
    label: 'Billing cadence',
    isInvalid: true,
    errorMessage: 'Select a billing cadence to continue.',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
      <RadioGroup.Item value="yearly">Yearly</RadioGroup.Item>
    </RadioGroup>
  ),
};

export const DisabledOption = {
  parameters: {
    docs: {
      description: {
        story: 'Individual options can be disabled while the rest of the group stays interactive.',
      },
    },
  },
  args: {
    label: 'Support tier',
  },
  render: (args) => (
    <RadioGroup {...args} defaultValue="growth">
      <RadioGroup.Item value="starter">Starter</RadioGroup.Item>
      <RadioGroup.Item value="growth">Growth</RadioGroup.Item>
      <RadioGroup.Item value="enterprise" isDisabled description="Contact sales to unlock.">
        Enterprise
      </RadioGroup.Item>
    </RadioGroup>
  ),
};
