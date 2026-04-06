import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Email me about product updates',
    helperText: 'You can change this preference later.',
    isDisabled: false,
    isInvalid: false,
    isIndeterminate: false,
    size: 'md',
    labelPlacement: 'end',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    labelPlacement: {
      control: 'select',
      options: ['start', 'end'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox handles binary and indeterminate selection with helper text, error state, and custom icon overrides.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive checkbox playground with label and validation controls.',
      },
      source: { state: 'open' },
    },
  },
};

export const States = {
  parameters: {
    docs: {
      description: {
        story: 'Common checked, indeterminate, invalid, and disabled states in one view.',
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <Checkbox label="Default" helperText="Unchecked by default." />
      <Checkbox label="Selected" defaultSelected helperText="Enabled for your workspace." />
      <Checkbox
        label="Indeterminate"
        isIndeterminate
        helperText="Some nested items are selected."
      />
      <Checkbox label="Invalid" isInvalid errorMessage="You must accept the terms to continue." />
      <Checkbox label="Disabled" isDisabled defaultSelected helperText="Managed by your admin." />
    </div>
  ),
};

export const CustomIcons = {
  parameters: {
    docs: {
      description: {
        story:
          'Checked and indeterminate icons can be replaced while retaining the same keyboard and screen reader contract.',
      },
    },
  },
  render: () => (
    <div className="grid gap-4">
      <Checkbox
        label="Custom checkmark"
        defaultSelected
        checkedIcon={
          <span aria-hidden="true" className="text-[10px] font-bold">
            OK
          </span>
        }
      />
      <Checkbox
        label="Custom indeterminate marker"
        isIndeterminate
        indeterminateIcon={
          <span aria-hidden="true" className="text-[10px] font-bold">
            -
          </span>
        }
      />
    </div>
  ),
};

export const LeadingLabel = {
  parameters: {
    docs: {
      description: {
        story: 'Label placement can be moved ahead of the control for tighter preference layouts.',
      },
    },
  },
  args: {
    label: 'Place label before the checkbox',
    labelPlacement: 'start',
    helperText: 'Useful in dense preference lists.',
  },
};
