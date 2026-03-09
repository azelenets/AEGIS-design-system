import type { Meta, StoryObj } from '@storybook/react-vite';
import LabCard from './LabCard';

const meta: Meta<typeof LabCard> = {
  title: 'Laboratory/LabCard',
  component: LabCard,
};

export default meta;
type Story = StoryObj<typeof LabCard>;

const tags = (
  <div className="flex flex-wrap gap-1.5">
    {['React', 'TypeScript', 'NestJS', 'PostgreSQL'].map((tag) => (
      <span key={tag} className="px-2 py-0.5 bg-primary/5 border border-primary/15 text-primary/60 text-[9px] font-mono tracking-wider">
        {tag}
      </span>
    ))}
  </div>
);

export const Primary: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    id: 'LAB-001',
    codename: 'SIGNAL_TRACE',
    title: 'Signal Trace',
    desc: 'Real-time distributed tracing dashboard for microservice architectures.',
    status: 'ACTIVE',
    statusColor: 'text-primary border border-primary/30',
    color: 'primary',
    stats: '14 ENDPOINTS MONITORED',
    action: 'VIEW_PROJECT',
    icon: 'open_in_new',
    link: '#',
    children: tags,
  },
};
