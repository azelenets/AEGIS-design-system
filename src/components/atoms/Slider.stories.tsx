import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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

export const Controlled = {
  render: () => {
    const [v, setV] = useState(50);
    return <Slider label="Sensitivity" value={v} onChange={(e) => setV(Number(e.target.value))} showValue />;
  },
};
