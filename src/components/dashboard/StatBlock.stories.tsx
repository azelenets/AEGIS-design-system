import type { Meta, StoryObj } from '@storybook/react-vite';
import StatBlock from './StatBlock';

const meta: Meta<typeof StatBlock> = {
  title: 'Dashboard/StatBlock',
  component: StatBlock,
};

export default meta;
type Story = StoryObj<typeof StatBlock>;

export const Default: Story = {
  args: {
    label: 'Ops Completed',
    value: '200+',
    barColor: 'bg-primary',
    width: '75%',
  },
};

export const HeroRow: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <StatBlock label="Years Experience" value="8+ YRS" barColor="bg-primary" width="80%" />
      <StatBlock label="Projects Shipped" value="200+" barColor="bg-hazard" width="70%" />
      <StatBlock label="Uptime SLA" value="99.9%" barColor="bg-primary" width="99%" />
    </div>
  ),
};
