import { RadioGroup } from './RadioGroup';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
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
};

export const Default = {
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
