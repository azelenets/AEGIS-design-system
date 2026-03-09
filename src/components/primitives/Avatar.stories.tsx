import type { Meta, StoryObj } from '@storybook/react-vite';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithInitials: Story = {
  args: { initials: 'AZ', variant: 'primary', size: 'md' },
};

export const WithIcon: Story = {
  args: { icon: 'person', variant: 'ghost', size: 'md' },
};

export const HazardVariant: Story = {
  args: { initials: 'RX', variant: 'hazard', size: 'md' },
};

export const AlertVariant: Story = {
  args: { initials: 'XX', variant: 'alert', size: 'md' },
};

export const WithOnlineStatus: Story = {
  args: { initials: 'OP', variant: 'primary', size: 'md', status: 'online' },
};

export const WithBusyStatus: Story = {
  args: { initials: 'B1', variant: 'primary', size: 'md', status: 'busy' },
};

export const WithOfflineStatus: Story = {
  args: { initials: 'G0', variant: 'ghost', size: 'md', status: 'offline' },
};

export const AllSizes: Story = {
  decorators: [
    () => (
      <div className="flex gap-4 items-end">
        <Avatar initials="AZ" variant="primary" size="sm" />
        <Avatar initials="AZ" variant="primary" size="md" />
        <Avatar initials="AZ" variant="primary" size="lg" />
        <Avatar initials="AZ" variant="primary" size="xl" />
      </div>
    ),
  ],
};
