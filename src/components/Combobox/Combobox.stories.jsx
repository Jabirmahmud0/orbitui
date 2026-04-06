import { useState } from 'react';

import { Combobox } from './Combobox';

const people = Array.from({ length: 18 }, (_, index) => ({
  label: `Person ${index + 1}`,
  value: `person-${index + 1}`,
}));

function AsyncStory() {
  const [query, setQuery] = useState('');

  return (
    <Combobox
      label="Remote search"
      inputValue={query}
      onInputValueChange={setQuery}
      loadOptions={async (nextQuery) =>
        people.filter((person) => person.label.toLowerCase().includes(nextQuery.toLowerCase())).slice(0, 8)
      }
      helperText="Simulated async search that narrows a remote dataset."
    />
  );
}

export default {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Assignee',
    options: people,
    placeholder: 'Search people',
    visibleCount: 5,
    itemHeight: 44,
  },
  argTypes: {
    visibleCount: { control: { type: 'number', min: 3, max: 8, step: 1 } },
    itemHeight: { control: { type: 'number', min: 36, max: 56, step: 4 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Combobox combines freeform type-ahead input with listbox navigation, optional remote loading, and windowed rendering for longer result sets.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive local combobox with inline filtering and option selection.',
      },
      source: { state: 'open' },
    },
  },
};

export const AsyncSearch = {
  render: () => <AsyncStory />,
  parameters: {
    docs: {
      description: {
        story: 'Async mode swaps local filtering for a remote loader while keeping the same field and listbox semantics.',
      },
    },
  },
};

export const ValidationState = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Combobox label="Reviewer" options={people.slice(0, 6)} helperText="Assign the person who will approve the rollout." />
      <Combobox
        label="Owner"
        options={people.slice(0, 6)}
        isInvalid
        errorMessage="Select an owner before publishing this change."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Helper and error states align the combobox with the rest of the form-field primitives.',
      },
    },
  },
};
