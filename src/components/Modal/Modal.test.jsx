import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { renderWithProviders } from '../../test/setup';
import { Button } from '../Button';
import { Dialog, Modal } from './Modal';

function renderModal(props = {}) {
  return renderWithProviders(
    <Modal {...props}>
      <Modal.Trigger>Open modal</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Modal.Close>Dismiss</Modal.Close>
        </Modal.Header>
        <Modal.Body>
          <Modal.Description>Modal description</Modal.Description>
          <p>Body copy</p>
        </Modal.Body>
        <Modal.Footer>
          <button type="button">Cancel</button>
          <button type="button">Save</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>,
  );
}

describe('Modal', () => {
  it('opens from the trigger and closes from the close button', async () => {
    const user = userEvent.setup();

    renderModal();

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    const dialog = screen.getByRole('dialog', { name: 'Modal title' });

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Body copy')).toBeInTheDocument();

    await user.click(screen.getByText('Dismiss'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled state and overlay dismissal', async () => {
    const user = userEvent.setup();

    function ControlledModalExample() {
      const [isOpen, setIsOpen] = useState(true);

      return (
        <>
          <span>{isOpen ? 'open' : 'closed'}</span>
          <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger>Launch</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Controlled modal</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>Managed externally</Dialog.Body>
            </Dialog.Content>
          </Dialog>
        </>
      );
    }

    renderWithProviders(<ControlledModalExample />);

    expect(screen.getByText('open')).toBeInTheDocument();

    await user.click(document.querySelector('[data-orbit-modal-overlay]'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('can use an existing child element as the trigger', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Modal>
        <Modal.Trigger asChild>
          <button type="button">Open custom trigger</button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Custom trigger modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal.Content>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Open custom trigger' }));

    expect(screen.getByRole('dialog', { name: 'Custom trigger modal' })).toBeInTheDocument();
  });

  it('respects keyboard dismissal settings and size variants', () => {
    renderWithProviders(
      <Modal defaultOpen isKeyboardDismissDisabled size="full">
        <Modal.Trigger>Ignored</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Fullscreen modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>Locked open</Modal.Body>
        </Modal.Content>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Fullscreen modal' });

    expect(dialog).toHaveClass('min-h-[100dvh]');

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(screen.getByRole('dialog', { name: 'Fullscreen modal' })).toBeInTheDocument();
  });

  it('closes with Escape by default and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    renderModal();

    const trigger = screen.getByRole('button', { name: 'Open modal' });

    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Modal title' });

    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports alertdialog semantics', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Dialog defaultOpen role="alertdialog">
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete workspace</Dialog.Title>
            <Dialog.Description>This action cannot be undone.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
            <Button variant="danger">Delete</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>,
    );

    expect(screen.getByRole('alertdialog', { name: 'Delete workspace' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    const { container } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
