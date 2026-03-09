import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'Enable telemetry' },
};

export const Checked: Story = {
  args: { label: 'Enable telemetry', defaultChecked: true },
};

export const WithHint: Story = {
  args: {
    label: 'Stealth mode',
    hint: 'Suppresses all outbound signals during operation.',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: { label: 'Select all operators', indeterminate: true },
};

export const Disabled: Story = {
  args: { label: 'Classified access', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Classified access', disabled: true, defaultChecked: true },
};

export const Controlled: Story = {
  decorators: [
    () => {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label={checked ? 'Shield active' : 'Shield inactive'}
          hint="Click to toggle shield status."
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    },
  ],
};

export const CheckboxGroup: Story = {
  decorators: [
    () => {
      const options = [
        { id: 'alpha', label: 'Alpha sector', hint: 'Northern perimeter' },
        { id: 'beta', label: 'Beta sector', hint: 'Eastern perimeter' },
        { id: 'gamma', label: 'Gamma sector', hint: 'Currently offline', disabled: true },
        { id: 'delta', label: 'Delta sector', hint: 'Southern perimeter' },
      ];
      const [selected, setSelected] = useState<string[]>(['alpha']);

      const toggle = (id: string) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

      return (
        <fieldset className="border-0 m-0 p-0">
          <legend className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-3">
            Active Sectors
          </legend>
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <Checkbox
                key={opt.id}
                label={opt.label}
                hint={opt.hint}
                checked={selected.includes(opt.id)}
                disabled={opt.disabled}
                onChange={() => toggle(opt.id)}
              />
            ))}
          </div>
        </fieldset>
      );
    },
  ],
};
