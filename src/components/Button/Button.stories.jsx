import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
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
};

export const Default = {};

export const Variants = {
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
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading = {
  args: {
    isLoading: true,
    children: 'Saving',
  },
};

export const WithIcons = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button leftIcon={<span aria-hidden="true">+</span>}>Create</Button>
      <Button rightIcon={<span aria-hidden="true">?</span>} variant="secondary">
        Continue
      </Button>
    </div>
  ),
};
