import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Rating from './Rating';

const meta: Meta<typeof Rating> = { title: 'Atoms/Rating', component: Rating };
export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: { defaultValue: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');
    const checked = radios.filter((radio) => radio.getAttribute('aria-checked') === 'true');

    await expect(canvas.getByRole('radiogroup')).toBeInTheDocument();
    await expect(radios).toHaveLength(5);
    await expect(checked).toHaveLength(1);
    await expect(canvas.getByRole('radio', { name: '3 of 5' })).toHaveAttribute('aria-checked', 'true');
  },
};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
  play: async ({ canvasElement }) => {
    const buttons = Array.from(canvasElement.querySelectorAll('button'));

    await expect(within(canvasElement).queryByRole('radiogroup')).not.toBeInTheDocument();
    await expect(buttons).toHaveLength(5);
    await expect(buttons.every((button) => button.hasAttribute('disabled'))).toBe(true);
  },
};

export const Hazard: Story = {
  args: { defaultValue: 5, variant: 'hazard' },
  play: async ({ canvasElement }) => {
    const buttons = Array.from(canvasElement.querySelectorAll('button'));

    await expect(buttons).toHaveLength(5);
    await expect(buttons.every((button) => button.className.includes('text-hazard'))).toBe(true);
  },
};

export const WithLabel: Story = {
  args: { defaultValue: 3, label: 'Threat Level' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Threat Level')).toBeVisible();
    await expect(canvas.getByRole('radiogroup', { name: 'Threat Level' })).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { defaultValue: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checked = canvas.getAllByRole('radio').filter((radio) => radio.getAttribute('aria-checked') === 'true');

    await expect(checked).toHaveLength(0);
  },
};

const ControlledRatingStory = () => {
  const [val, setVal] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <Rating value={val} onChange={setVal} label="Mission Rating" />
      <p className="text-[10px] font-mono text-slate-400">Selected: {val} / 5</p>
    </div>
  );
};

export const Controlled = {
  render: () => <ControlledRatingStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByRole('radio', { name: '4 of 5' });

    await expect(canvas.getByText('Selected: 0 / 5')).toBeVisible();
    await userEvent.click(target);
    await expect(canvas.getByText('Selected: 4 / 5')).toBeVisible();
    await expect(target).toHaveAttribute('aria-checked', 'true');
  },
};
