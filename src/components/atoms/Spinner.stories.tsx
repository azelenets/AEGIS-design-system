import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 'md', variant: 'primary' },
};

export const WithLabel: Story = {
  args: { size: 'md', variant: 'primary', label: 'Syncing...' },
};

export const Small: Story = {
  args: { size: 'sm', variant: 'primary' },
};

export const Large: Story = {
  args: { size: 'lg', variant: 'primary', label: 'Initializing' },
};

export const HazardVariant: Story = {
  args: { size: 'md', variant: 'hazard', label: 'Scanning' },
};

export const AlertVariant: Story = {
  args: { size: 'md', variant: 'alert', label: 'Critical' },
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex gap-8 items-end">
        <Spinner size="sm" variant="primary" label="Sm" />
        <Spinner size="md" variant="primary" label="Md" />
        <Spinner size="lg" variant="primary" label="Lg" />
      </div>
    ),
  ],
};
