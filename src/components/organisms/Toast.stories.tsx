import type { Meta } from '@storybook/react-vite';
import { ToastProvider, Toaster, useToast } from './Toast';
import Button from '@/components/atoms/Button';

const meta: Meta = { title: 'Organisms/Toast', parameters: { layout: 'centered' } };
export default meta;

const Trigger = ({ position = 'bottom-right' }: { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' }) => {
  const { toast } = useToast();
  return (
    <div className="flex flex-col gap-3 items-start">
      <Toaster position={position} />
      <Button variant="primary"    onClick={() => toast({ title: 'Sync complete',      message: 'All 14 endpoints confirmed nominal.', variant: 'success' })}>Success</Button>
      <Button variant="secondary"  onClick={() => toast({ title: 'System notice',      message: 'Maintenance window starts at 02:00 UTC.', variant: 'info' })}>Info</Button>
      <Button variant="ghost"      onClick={() => toast({ title: 'Threat detected',    message: 'Anomalous traffic on subnet 10.0.4.x.', variant: 'warning' })}>Warning</Button>
      <Button variant="danger"     onClick={() => toast({ title: 'Breach detected',    message: 'Sector 7 firewall compromised.', variant: 'danger' })}>Danger</Button>
      <Button variant="ghost"      onClick={() => toast({ message: 'Operator GHOST authenticated.', variant: 'info', duration: 0 })}>Sticky</Button>
    </div>
  );
};

export const Default = {
  render: () => (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  ),
};

export const TopRight = {
  render: () => (
    <ToastProvider>
      <Trigger position="top-right" />
    </ToastProvider>
  ),
};

export const TopCenter = {
  render: () => (
    <ToastProvider>
      <Trigger position="top-center" />
    </ToastProvider>
  ),
};
