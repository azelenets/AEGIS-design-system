import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Rating from './Rating';

const meta: Meta<typeof Rating> = { title: 'Atoms/Rating', component: Rating };
export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = { args: { defaultValue: 3 } };
export const ReadOnly: Story = { args: { value: 4, readOnly: true } };
export const Hazard: Story = { args: { defaultValue: 5, variant: 'hazard' } };
export const WithLabel: Story = { args: { defaultValue: 3, label: 'Threat Level' } };
export const Empty: Story = { args: { defaultValue: 0 } };

export const Controlled = {
  render: () => {
    const [val, setVal] = useState(0);
    return (
      <div className="flex flex-col gap-2">
        <Rating value={val} onChange={setVal} label="Mission Rating" />
        <p className="text-[10px] font-mono text-slate-600">Selected: {val} / 5</p>
      </div>
    );
  },
};
