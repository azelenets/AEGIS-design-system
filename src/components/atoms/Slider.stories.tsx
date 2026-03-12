import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';
import Slider from './Slider';

const meta: Meta<typeof Slider> = { title: 'Atoms/Slider', component: Slider, decorators: [(S) => <div className="max-w-xs"><S /></div>] };
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = { args: { label: 'Volume', defaultValue: 60 } };
export const Hazard: Story = { args: { label: 'Threat Threshold', defaultValue: 80, variant: 'hazard' } };
export const Alert: Story = { args: { label: 'Critical Level', defaultValue: 95, variant: 'alert' } };
export const WithFormat: Story = { args: { label: 'Gain', defaultValue: 75, formatValue: (v) => `${v} dB` } };
export const WithHint: Story = { args: { label: 'Signal Strength', defaultValue: 55, hint: 'Adjust the incoming signal amplification level' } };
export const Disabled: Story = { args: { label: 'Locked', defaultValue: 40, disabled: true } };
export const Vertical: Story = {
  args: {
    label: 'Output',
    defaultValue: 65,
    orientation: 'vertical',
    hint: 'Vertical transport control for compact popovers',
  },
  decorators: [(S) => <div className="flex min-h-56 items-center justify-center"><S /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Output')).toBeVisible();
    await expect(canvas.getByText('65')).toBeVisible();
    await expect(canvas.getByText('Vertical transport control for compact popovers')).toBeVisible();
    await expect(canvas.getByRole('slider')).toBeVisible();
  },
};

export const Controlled = {
  render: () => {
    const [v, setV] = useState(50);
    return <Slider label="Sensitivity" value={v} onChange={(e) => setV(Number(e.target.value))} showValue />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');

    fireEvent.change(slider, { target: { value: '72' } });

    await expect(canvas.getByText('72')).toBeVisible();
  },
};

export const VerticalSpec: Story = {
  tags: ['!dev'],
  render: () => {
    const [value, setValue] = useState(40);

    return (
      <div className="flex min-h-56 items-center justify-center">
        <Slider
          label="Volume"
          value={value}
          min={0}
          max={100}
          orientation="vertical"
          hint="Popover volume control"
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: 'Volume' });

    fireEvent.change(slider, { target: { value: '18' } });

    await expect(canvas.getByText('18')).toBeVisible();
    await expect(canvas.getByText('Popover volume control')).toBeVisible();
  },
};
