import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  decorators: [(Story) => <div className="w-64"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Ghost: Story = {
  args: { variant: 'ghost' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.border-t');

    await expect(divider).toBeInTheDocument();
    await expect(divider).toHaveClass('w-full', 'border-border-dark');
  },
};

export const Primary: Story = {
  args: { variant: 'primary' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.border-t');

    await expect(divider).toBeInTheDocument();
    await expect(divider).toHaveClass('border-primary/20');
  },
};

export const Hazard: Story = {
  args: { variant: 'hazard' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.border-t');

    await expect(divider).toBeInTheDocument();
    await expect(divider).toHaveClass('border-hazard/20');
  },
};

export const WithLabel: Story = {
  args: { label: 'Section Alpha', variant: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Section Alpha');
    const segments = canvasElement.querySelectorAll('.border-t');

    await expect(label).toBeVisible();
    await expect(label).toHaveClass('text-primary');
    await expect(segments).toHaveLength(2);
  },
};

export const HazardWithLabel: Story = {
  args: { label: 'Restricted Zone', variant: 'hazard' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Restricted Zone');
    const segments = canvasElement.querySelectorAll('.border-t');

    await expect(label).toBeVisible();
    await expect(label).toHaveClass('text-hazard');
    await expect(segments).toHaveLength(2);
  },
};

export const Vertical: Story = {
  decorators: [(Story) => <div className="flex h-24"><Story /></div>],
  args: { vertical: true, variant: 'ghost' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.border-l');

    await expect(divider).toBeInTheDocument();
    await expect(divider).toHaveClass('self-stretch', 'border-border-dark');
    await expect(canvasElement.querySelector('.border-t')).not.toBeInTheDocument();
  },
};
