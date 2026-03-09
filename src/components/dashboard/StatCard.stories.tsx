import type { Meta, StoryObj } from '@storybook/react-vite';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Dashboard/StatCard',
  component: StatCard,
  parameters: {
    docs: {
      description: {
        component: 'Displays a labeled metric with a value, progress bar, and optional segmented mode.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    id: '01',
    label: 'Years Experience',
    value: '8+ YRS',
    progress: 80,
  },
};

export const Segmented: Story = {
  args: {
    id: '04',
    label: 'Clearance Level',
    value: 'ALPHA-2',
    progress: 0,
    segmented: true,
  },
};
