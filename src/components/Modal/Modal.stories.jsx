import { useState } from 'react';

import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from './Modal';

function DefaultModalStory(args) {
  return (
    <Modal {...args}>
      <Modal.Trigger>Open modal</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Invite teammate</Modal.Title>
          <Modal.Description>
            Add a teammate to your workspace and assign their starting access level.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <div className="grid gap-4">
            <Input label="Full name" placeholder="Avery Stone" />
            <Input label="Email address" placeholder="avery@orbitui.dev" type="email" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>Cancel</Modal.Close>
          <Button>Send invite</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function ControlledModalStory() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-foreground-muted)]">
        Modal state: {isOpen ? 'open' : 'closed'}
      </p>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Trigger>Launch settings</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Project settings</Modal.Title>
            <Modal.Description>
              Controlled mode lets the parent decide when the dialog opens and closes.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm leading-7 text-[var(--color-foreground-secondary)]">
              This example keeps dialog state in React state outside the modal component.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>Close</Modal.Close>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

function AlertDialogStory() {
  return (
    <Modal defaultOpen role="alertdialog" size="sm">
      <Modal.Trigger>Delete workspace</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Delete workspace?</Modal.Title>
          <Modal.Description>
            This action permanently removes all environments, analytics, and member access.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close>Cancel</Modal.Close>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SizeVariantsStory() {
  return (
    <div className="flex flex-wrap gap-3">
      {['sm', 'md', 'lg', 'xl', 'full'].map((size) => (
        <Modal key={size} size={size}>
          <Modal.Trigger>{size.toUpperCase()}</Modal.Trigger>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>{size.toUpperCase()} modal</Modal.Title>
              <Modal.Description>Preview of the {size} size token.</Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm leading-7 text-[var(--color-foreground-secondary)]">
                Sized dialogs help balance quick confirmations against long-form workflows.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>Close</Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      ))}
    </div>
  );
}

export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    isDismissable: true,
    isKeyboardDismissDisabled: false,
    role: 'dialog',
    size: 'md',
  },
  argTypes: {
    role: {
      control: 'select',
      options: ['dialog', 'alertdialog'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modal provides a compound dialog API with portal rendering, focus containment, backdrop dismissal, keyboard escape handling, and size variants for compact through fullscreen workflows.',
      },
    },
  },
};

export const Default = {
  render: (args) => <DefaultModalStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive modal playground for the standard dialog workflow.',
      },
      source: { state: 'open' },
    },
  },
};

export const Controlled = {
  render: () => <ControlledModalStory />,
  parameters: {
    docs: {
      description: {
        story: 'Controlled usage keeps dialog visibility in parent state.',
      },
    },
  },
};

export const AlertDialog = {
  render: () => <AlertDialogStory />,
  parameters: {
    docs: {
      description: {
        story: 'Alert dialog mode is tuned for destructive or high-attention confirmation flows.',
      },
    },
  },
};

export const SizeVariants = {
  render: () => <SizeVariantsStory />,
  parameters: {
    docs: {
      description: {
        story: 'Dialog sizes scale from compact confirmations to fullscreen task flows.',
      },
    },
  },
};
