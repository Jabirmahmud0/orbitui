import { Button } from '../Button';
import { Tooltip } from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
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
  render: (args) => (
    <div className="flex min-h-32 items-center justify-center p-10">
      <Tooltip {...args}>
        <Button variant="secondary">Trigger tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const Default = {};

export const Placements = {
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
  args: {
    content: 'Visible only on keyboard focus',
    trigger: 'focus',
  },
};

export const WithoutArrow = {
  args: {
    content: 'Arrow hidden for compact layouts',
    showArrow: false,
  },
};
