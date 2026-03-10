import type { Meta, StoryObj } from '@storybook/react-vite';
import FeatureCard from './FeatureCard';

const meta: Meta<typeof FeatureCard> = {
  title: 'Molecules/FeatureCard',
  component: FeatureCard,
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    id: 'P-01',
    icon: 'memory',
    title: 'BACKEND SYSTEMS',
    status: 'ACTIVE',
    dots: 5,
    children: 'Design and build high-throughput APIs, event-driven microservices, and data pipelines.',
  },
};

export const CustomTag: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    id: 'P-02',
    icon: 'security',
    title: 'SECURITY POSTURE',
    tag: 'MISSION',
    status: 'IN_PROGRESS',
    dots: 3,
    children: 'Implement zero-trust architecture and continuous threat monitoring across all layers.',
  },
};
