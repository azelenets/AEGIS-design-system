import type { Meta, StoryObj } from '@storybook/react-vite';
import ProtocolCard from './ProtocolCard';

const meta: Meta<typeof ProtocolCard> = {
  title: 'Protocols/ProtocolCard',
  component: ProtocolCard,
};

export default meta;
type Story = StoryObj<typeof ProtocolCard>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    id: 'P-01',
    icon: 'memory',
    title: 'BACKEND SYSTEMS',
    status: 'ACTIVE_PROTOCOL',
    dots: 5,
    children: 'Design and build high-throughput APIs, event-driven microservices, and data pipelines.',
  },
};
