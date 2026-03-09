import type { Meta, StoryObj } from '@storybook/react-vite';
import Alert from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Molecules/Alert',
  component: Alert,
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'System Notice',
    children: 'Scheduled maintenance window begins at 02:00 UTC. Expect brief downtime.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Threat Detected',
    children: 'Anomalous traffic pattern identified on subnet 10.0.0.x. Monitor advised.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Critical Failure',
    children: 'Sector 7 firewall breach. Immediate response required.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Deployment Complete',
    children: 'All services nominal. Build v2.4.1 deployed successfully.',
  },
};

export const NoTitle: Story = {
  args: {
    variant: 'info',
    children: 'Operator session expires in 15 minutes.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Clearance Expiring',
    children: 'Your level-3 clearance expires in 72 hours. Renew to maintain access.',
    onDismiss: () => {},
  },
};
