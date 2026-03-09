import type { Meta, StoryObj } from '@storybook/react-vite';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  decorators: [(Story) => <div className="w-64"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Hazard: Story = {
  args: { variant: 'hazard' },
};

export const WithLabel: Story = {
  args: { label: 'Section Alpha', variant: 'primary' },
};

export const HazardWithLabel: Story = {
  args: { label: 'Restricted Zone', variant: 'hazard' },
};
