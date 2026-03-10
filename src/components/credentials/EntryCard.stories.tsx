import type { Meta, StoryObj } from '@storybook/react-vite';
import EntryCard from './EntryCard';

const meta: Meta<typeof EntryCard> = {
  title: 'Molecules/EntryCard',
  component: EntryCard,
};

export default meta;
type Story = StoryObj<typeof EntryCard>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
  args: {
    id: '01',
    code: 'AWS_CSA_PRO',
    title: 'AWS Solutions Architect Professional',
  },
};

export const Full: Story = {
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  args: {
    id: '02',
    code: 'CKA_2024',
    title: 'Certified Kubernetes Administrator',
    full: true,
  },
};
