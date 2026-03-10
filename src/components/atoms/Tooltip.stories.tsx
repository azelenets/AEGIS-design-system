import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Hover me');

    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.hover(trigger);
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toHaveTextContent('System status nominal');
    await expect(tooltip).toHaveClass('bottom-full', 'left-1/2');
    await userEvent.unhover(trigger);
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const Bottom: Story = {
  args: {
    content: 'Last sync: 02:14 UTC',
    placement: 'bottom',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Hover me');

    await userEvent.hover(trigger);
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Last sync: 02:14 UTC');
    await expect(tooltip).toHaveClass('top-full', 'left-1/2');
  },
};

export const Left: Story = {
  args: {
    content: 'Auth level: OMEGA',
    placement: 'left',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Hover me');

    await userEvent.hover(trigger);
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Auth level: OMEGA');
    await expect(tooltip).toHaveClass('right-full', 'top-1/2');
  },
};

export const Right: Story = {
  args: {
    content: 'Zone: Restricted',
    placement: 'right',
    children: <span className="text-primary/60 text-xs font-mono underline cursor-default">Hover me</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Hover me');

    await userEvent.hover(trigger);
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Zone: Restricted');
    await expect(tooltip).toHaveClass('left-full', 'top-1/2');
  },
};

export const FocusableTrigger: Story = {
  args: {
    content: 'Keyboard-accessible details',
    placement: 'top',
    children: <button type="button" className="text-primary/60 text-xs font-mono underline">Focus me</button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Focus me' });

    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Keyboard-accessible details');
    await userEvent.tab();
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
