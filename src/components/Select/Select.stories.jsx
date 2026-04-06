import { Select } from './Select';

const groupedTeams = [
  {
    label: 'Product',
    options: [
      { label: 'Design', value: 'design' },
      { label: 'Research', value: 'research' },
    ],
  },
  {
    label: 'Engineering',
    options: [
      { label: 'Platform', value: 'platform' },
      { label: 'Frontend', value: 'frontend' },
      { label: 'Infrastructure', value: 'infrastructure', disabled: true },
    ],
  },
];

export default {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Team',
    placeholder: 'Choose a team',
    searchable: false,
    multiple: false,
    groups: groupedTeams,
  },
  argTypes: {
    searchable: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Select provides grouped options, client-side search, keyboard navigation, and single or multi-select behavior through one field primitive.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive single-select field for standard option picking flows.',
      },
      source: { state: 'open' },
    },
  },
};

export const Searchable = {
  args: {
    label: 'Department',
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search mode filters grouped options in-place for longer datasets.',
      },
    },
  },
};

export const MultiSelect = {
  args: {
    label: 'Skills',
    multiple: true,
    searchable: true,
    placeholder: 'Choose multiple skills',
    groups: [
      {
        label: 'Core',
        options: [
          { label: 'Accessibility', value: 'a11y' },
          { label: 'Design systems', value: 'design-systems' },
        ],
      },
      {
        label: 'Delivery',
        options: [
          { label: 'Performance', value: 'performance' },
          { label: 'Testing', value: 'testing' },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select keeps the listbox open so users can build a set without repeated reopen cycles.',
      },
    },
  },
};

export const ValidationStates = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Select
        label="Environment"
        helperText="Choose where this rollout should start."
        groups={groupedTeams}
        placeholder="Select environment"
      />
      <Select
        label="Owner"
        errorMessage="You need to assign an owner before continuing."
        groups={groupedTeams}
        isInvalid
        placeholder="Select owner"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Helper and error messaging align the field with the rest of the form primitives.',
      },
    },
  },
};
