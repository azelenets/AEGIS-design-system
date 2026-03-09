import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Toggle from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Primitives/Toggle',
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

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

export const LabelLeft: Story = {
  args: { label: 'Auto-sync', hint: 'Sync on interval', labelPosition: 'left', defaultChecked: true },
};

export const HazardVariant: Story = {
  args: { label: 'Override lockout', variant: 'hazard', defaultChecked: true },
};

export const AlertVariant: Story = {
  args: { label: 'Emergency broadcast', variant: 'alert', defaultChecked: true },
};

export const SmallSize: Story = {
  args: { label: 'Verbose logging', size: 'sm' },
};

export const LargeSize: Story = {
  args: { label: 'Shield active', size: 'lg', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'Classified toggle', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Classified toggle', disabled: true, defaultChecked: true },
};

export const Controlled: Story = {
  decorators: [
    () => {
      const [on, setOn] = useState(false);
      return (
        <Toggle
          label={on ? 'System armed' : 'System disarmed'}
          hint="Click to toggle armed state."
          variant={on ? 'alert' : 'primary'}
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
        />
      );
    },
  ],
};

export const AllSizes: Story = {
  decorators: [
    () => (
      <div className="flex flex-col gap-4">
        <Toggle size="sm" label="Small" defaultChecked />
        <Toggle size="md" label="Medium" defaultChecked />
        <Toggle size="lg" label="Large" defaultChecked />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex flex-col gap-4">
        <Toggle variant="primary" label="Primary" defaultChecked />
        <Toggle variant="hazard"  label="Hazard"  defaultChecked />
        <Toggle variant="alert"   label="Alert"   defaultChecked />
      </div>
    ),
  ],
};

export const ToggleGroup: Story = {
  decorators: [
    () => {
      type Setting = { id: string; label: string; hint: string; variant?: 'primary' | 'hazard' | 'alert' };
      const settings: Setting[] = [
        { id: 'telemetry',  label: 'Telemetry',       hint: 'Send usage data to command' },
        { id: 'stealth',    label: 'Stealth mode',    hint: 'Suppress all outbound signals' },
        { id: 'override',   label: 'Force override',  hint: 'Bypass safety interlocks', variant: 'hazard' },
        { id: 'broadcast',  label: 'Emergency broadcast', hint: 'Activate public beacon', variant: 'alert' },
      ];
      const [active, setActive] = useState<Record<string, boolean>>({ telemetry: true });
      const toggle = (id: string) => setActive((p) => ({ ...p, [id]: !p[id] }));

      return (
        <div className="flex flex-col gap-3 border border-border-dark bg-surface-terminal p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 font-mono mb-1">
            System Settings
          </p>
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-6 py-2 border-b border-border-dark last:border-0">
              <div>
                <p className="text-xs text-slate-300 font-mono">{s.label}</p>
                <p className="text-[10px] text-slate-600 font-mono">{s.hint}</p>
              </div>
              <Toggle
                variant={s.variant ?? 'primary'}
                checked={!!active[s.id]}
                onChange={() => toggle(s.id)}
              />
            </div>
          ))}
        </div>
      );
    },
  ],
};
