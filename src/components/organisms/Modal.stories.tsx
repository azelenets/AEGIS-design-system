import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, within } from 'storybook/test';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Alert from '@/components/molecules/Alert';
import Toggle from '@/components/atoms/Toggle';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ─── Trigger wrapper ──────────────────────────────────────────────────────────

const Trigger = ({ label = 'Open Modal', children }: { label?: string; children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button variant="secondary" icon="open_in_new" onClick={() => setOpen(true)}>{label}</Button>
      {children(open, setOpen)}
    </div>
  );
};

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  decorators: [
    () => (
      <Trigger label="Open Default">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalHeader title="System Notice" eyebrow="AEGIS // NOTIFICATION" onClose={() => setOpen(false)} />
            <ModalBody>
              Scheduled maintenance window begins at 02:00 UTC. All non-critical processes will be suspended.
              Operators should save state and stand by for system restart.
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Dismiss</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Acknowledge</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Open Default/ }));
    const dialog = within(document.body).getByRole('dialog', { name: 'System Notice' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-describedby');
    await expect(within(document.body).getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    await userEvent.click(within(document.body).getByRole('button', { name: /Acknowledge/ }));
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const SmallSize: Story = {
  decorators: [
    () => (
      <Trigger label="Open Small">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="sm">
            <ModalHeader title="Confirm Action" onClose={() => setOpen(false)} />
            <ModalBody>Are you sure you want to terminate this session?</ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Terminate</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const LargeSize: Story = {
  decorators: [
    () => (
      <Trigger label="Open Large">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="lg">
            <ModalHeader title="Operator Registry" eyebrow="AEGIS // CREDENTIALS" onClose={() => setOpen(false)} />
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Alert variant="info" title="Read-only mode">
                  Operator records are currently locked. Contact command to request edit access.
                </Alert>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  {[
                    ['Call Sign', 'GHOST'],
                    ['Unit ID', 'UNIT-007'],
                    ['Clearance', 'Omega'],
                    ['Sector', 'Alpha-7'],
                    ['Last Seen', '02:14 UTC'],
                    ['Status', 'Active'],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-border-dark pb-2">
                      <p className="text-[9px] uppercase tracking-widest text-slate-600 mb-0.5">{k}</p>
                      <p className="text-slate-200">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const HazardVariant: Story = {
  decorators: [
    () => (
      <Trigger label="Open Hazard">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} variant="hazard" size="sm">
            <ModalHeader title="Override Lockout?" eyebrow="AEGIS // WARNING" onClose={() => setOpen(false)} variant="hazard" />
            <ModalBody>
              <Alert variant="warning" title="Safety interlock">
                Bypassing the safety interlock may cause irreversible system damage. Proceed only with command authorisation.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Abort</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>Confirm Override</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const AlertVariant: Story = {
  decorators: [
    () => (
      <Trigger label="Open Alert">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} variant="alert" size="sm">
            <ModalHeader title="Breach Detected" eyebrow="AEGIS // CRITICAL" onClose={() => setOpen(false)} variant="alert" />
            <ModalBody>
              <Alert variant="danger" title="Sector 7 compromised">
                Unauthorised access detected on subnet 10.0.7.x. Immediate containment required.
              </Alert>
            </ModalBody>
            <ModalFooter align="center">
              <Button variant="danger" icon="emergency_home" onClick={() => setOpen(false)}>Initiate Lockdown</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const FormModal: Story = {
  decorators: [
    () => (
      <Trigger label="Open Form">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="md">
            <ModalHeader title="New Deployment" eyebrow="AEGIS // LABORATORY" onClose={() => setOpen(false)} />
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input label="Project Name" placeholder="e.g. Signal Trace" />
                <Input label="Repository URL" placeholder="https://github.com/..." icon="link" />
                <Textarea label="Description" placeholder="Describe the project objective..." />
                <Toggle label="Auto-deploy on merge" hint="Triggers pipeline on main branch push." defaultChecked />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" icon="rocket_launch" onClick={() => setOpen(false)}>Deploy</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const ScrollableContent: Story = {
  decorators: [
    () => (
      <Trigger label="Open Scrollable">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="md">
            <ModalHeader title="Mission Archive" eyebrow="AEGIS // MISSION LOG" onClose={() => setOpen(false)} />
            <ModalBody>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="border-b border-border-dark pb-3 last:border-0">
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">OPS-{String(i + 1).padStart(3, '0')}</p>
                    <p className="text-xs text-slate-300">Operation Phantom Wave — Sector {String.fromCharCode(65 + i)}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Objective met. No casualties reported.</p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const Draggable: Story = {
  decorators: [
    () => (
      <Trigger label="Open Draggable">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="md" draggable>
            <ModalHeader title="Moveable Console" eyebrow="AEGIS // DRAG ENABLED" onClose={() => setOpen(false)} />
            <ModalBody>
              Drag the header to reposition this dialog without closing it.
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};

export const BackdropDismissSpec: Story = {
  tags: ['!dev'],
  decorators: [
    () => (
      <Trigger label="Open Backdrop Dismiss">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalHeader title="Backdrop Dismiss" onClose={() => setOpen(false)} />
            <ModalBody>Clicking the backdrop should close this dialog.</ModalBody>
          </Modal>
        )}
      </Trigger>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Open Backdrop Dismiss/ }));
    await expect(within(document.body).getByRole('dialog')).toBeVisible();

    const backdrop = document.body.querySelector('button.absolute.inset-0');
    await userEvent.click(backdrop as HTMLButtonElement);
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const EscapeAndBackdropDisabledSpec: Story = {
  tags: ['!dev'],
  decorators: [
    () => (
      <Trigger label="Open Locked Modal">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} closeOnBackdrop={false} closeOnEscape={false}>
            <ModalHeader title="Locked Modal" onClose={() => setOpen(false)} />
            <ModalBody>Backdrop clicks and Escape should not close this dialog.</ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close Manually</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Open Locked Modal/ }));
    const dialog = within(document.body).getByRole('dialog');
    await expect(dialog).toBeVisible();

    const backdrop = document.body.querySelector('button.absolute.inset-0');
    await userEvent.click(backdrop as HTMLButtonElement);
    await expect(dialog).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeVisible();

    await userEvent.click(within(document.body).getByRole('button', { name: 'Close Manually' }));
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const DraggableSpec: Story = {
  tags: ['!dev'],
  decorators: [
    () => (
      <Trigger label="Open Draggable Spec">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} size="md" draggable>
            <ModalHeader title="Draggable Modal" eyebrow="AEGIS // MOVE" onClose={() => setOpen(false)} />
            <ModalBody>Drag this modal by the header.</ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Open Draggable Spec/ }));
    const dialog = within(document.body).getByRole('dialog', { name: 'Draggable Modal' }) as HTMLDivElement;
    const header = within(document.body).getByText('Draggable Modal').closest('header') as HTMLElement;

    await expect(dialog).toHaveAttribute('data-draggable', 'true');
    await expect(header).toHaveAttribute('data-modal-drag-handle', 'true');
    await expect(dialog.style.transform).toBe('translate(0px, 0px)');

    fireEvent.pointerDown(header, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(document, { pointerId: 1, clientX: 160, clientY: 145 });
    fireEvent.pointerUp(document, { pointerId: 1, clientX: 160, clientY: 145 });

    await expect(dialog.style.transform).toBe('translate(60px, 45px)');
  },
};

export const NoBackdropClose: Story = {
  decorators: [
    () => (
      <Trigger label="Open (No Backdrop Close)">
        {(open, setOpen) => (
          <Modal open={open} onClose={() => setOpen(false)} closeOnBackdrop={false}>
            <ModalHeader title="Mandatory Acknowledgement" eyebrow="AEGIS // REQUIRED" />
            <ModalBody>
              You must read and accept the terms before continuing. This dialog cannot be dismissed by clicking outside.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={() => setOpen(false)}>I Acknowledge</Button>
            </ModalFooter>
          </Modal>
        )}
      </Trigger>
    ),
  ],
};
