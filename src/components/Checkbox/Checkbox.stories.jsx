import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
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
};

export const Default = {};

export const States = {
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
  args: {
    label: 'Place label before the checkbox',
    labelPlacement: 'start',
    helperText: 'Useful in dense preference lists.',
  },
};
