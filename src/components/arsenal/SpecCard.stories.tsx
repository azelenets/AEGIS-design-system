import type { Meta, StoryObj } from '@storybook/react-vite';
import SpecCard from './SpecCard';

const meta: Meta<typeof SpecCard> = {
  title: 'Arsenal/SpecCard',
  component: SpecCard,
};

export default meta;
type Story = StoryObj<typeof SpecCard>;

export const Default: Story = {
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  args: {
    title: 'Distributed Systems',
    subtitle: 'ARCH_CLASS :: EVENT_DRIVEN',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
  },
};
