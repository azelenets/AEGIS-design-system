import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterButton from './FilterButton';

const meta: Meta<typeof FilterButton> = {
  title: 'Atoms/FilterButton',
  component: FilterButton,
};

export default meta;
type Story = StoryObj<typeof FilterButton>;

export const Active: Story = {
  args: {
    active: true,
    label: 'Backend',
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    label: 'Data',
  },
};
