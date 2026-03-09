import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  decorators: [(Story) => <div className="flex items-center justify-center h-24"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: 'System status nominal',
    placement: 'top',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Last sync: 02:14 UTC',
    placement: 'bottom',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
};

export const Left: Story = {
  args: {
    content: 'Auth level: OMEGA',
    placement: 'left',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
};

export const Right: Story = {
  args: {
    content: 'Zone: Restricted',
    placement: 'right',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
};
