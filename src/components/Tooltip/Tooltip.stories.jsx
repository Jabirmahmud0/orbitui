import { Button } from '../Button';
import { Tooltip } from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Copy deployment URL',
    placement: 'top',
    delay: 0,
    closeDelay: 0,
    isDisabled: false,
    trigger: 'hover',
    showArrow: true,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    trigger: {
      control: 'select',
      options: ['hover', 'focus'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip reveals contextual helper content on hover or focus with directional placement and optional arrow support.',
      },
    },
  },
  render: (args) => (
    <div className="flex min-h-32 items-center justify-center p-10">
      <Tooltip {...args}>
        <Button variant="secondary">Trigger tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive tooltip playground anchored to a standard button trigger.',
      },
      source: { state: 'open' },
    },
  },
};

export const Placements = {
  parameters: {
    docs: {
      description: {
        story: 'Placement options let the tooltip adapt to surrounding layout constraints.',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-10">
      <Tooltip content="Above trigger" placement="top" delay={0} closeDelay={0}>
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Right side" placement="right" delay={0} closeDelay={0}>
        <Button variant="secondary">Right</Button>
      </Tooltip>
      <Tooltip content="Below trigger" placement="bottom" delay={0} closeDelay={0}>
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left side" placement="left" delay={0} closeDelay={0}>
        <Button variant="secondary">Left</Button>
      </Tooltip>
    </div>
  ),
};

export const FocusTrigger = {
  parameters: {
    docs: {
      description: {
        story: 'Keyboard users can reveal help text on focus without relying on hover.',
      },
    },
  },
  args: {
    content: 'Visible only on keyboard focus',
    trigger: 'focus',
  },
};

export const WithoutArrow = {
  parameters: {
    docs: {
      description: {
        story: 'Arrow rendering can be disabled for simpler overlay treatments.',
      },
    },
  },
  args: {
    content: 'Arrow hidden for compact layouts',
    showArrow: false,
  },
};
