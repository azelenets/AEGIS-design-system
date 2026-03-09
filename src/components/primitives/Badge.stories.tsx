import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const PrimaryVariant: Story = {
  args: { label: 'Active', variant: 'primary' },
};

export const HazardVariant: Story = {
  args: { label: 'Warning', variant: 'hazard' },
};

export const AlertVariant: Story = {
  args: { label: 'Critical', variant: 'alert' },
};

export const SuccessVariant: Story = {
  args: { label: 'Verified', variant: 'success' },
};

export const GhostVariant: Story = {
  args: { label: 'Inactive', variant: 'ghost' },
};

export const WithDot: Story = {
  args: { label: 'Online', variant: 'primary', dot: true },
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex flex-wrap gap-2 items-center">
        <Badge label="Primary" variant="primary" dot />
        <Badge label="Hazard" variant="hazard" dot />
        <Badge label="Alert" variant="alert" dot />
        <Badge label="Success" variant="success" dot />
        <Badge label="Ghost" variant="ghost" />
      </div>
    ),
  ],
};
