import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Deploy change',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Button provides the core action primitive with visual variants, sizing, loading state, and optional icon slots.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for the primary action button API.',
      },
      source: { state: 'open' },
    },
  },
};

export const Variants = {
  parameters: {
    docs: {
      description: {
        story: 'Visual variants mapped to common action hierarchies.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes = {
  parameters: {
    docs: {
      description: {
        story: 'Compact through large sizing options for dense panels and roomy layouts.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state preserves layout while indicating in-progress actions.',
      },
    },
  },
  args: {
    isLoading: true,
    children: 'Saving',
  },
};

export const WithIcons = {
  parameters: {
    docs: {
      description: {
        story: 'Supports leading and trailing icons without changing button semantics.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button leftIcon={<span aria-hidden="true">+</span>}>Create</Button>
      <Button rightIcon={<span aria-hidden="true">?</span>} variant="secondary">
        Continue
      </Button>
    </div>
  ),
};
