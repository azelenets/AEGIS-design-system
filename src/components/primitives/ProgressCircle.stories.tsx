import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressCircle from './ProgressCircle';

const meta: Meta<typeof ProgressCircle> = {
  title: 'Primitives/ProgressCircle',
  component: ProgressCircle,
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  args: { value: 68 },
};

export const HazardVariant: Story = {
  args: { value: 85, variant: 'hazard' },
};

export const AlertVariant: Story = {
  args: { value: 96, variant: 'alert' },
};

export const SuccessVariant: Story = {
  args: { value: 100, variant: 'success' },
};

export const Indeterminate: Story = {
  args: { variant: 'primary', showValue: false },
};

export const CustomLabel: Story = {
  args: {
    value: 72,
    size: 'xl',
    label: (
      <span className="flex flex-col items-center">
        <span className="text-lg font-bold font-mono text-white">72</span>
        <span className="text-[8px] text-primary/60 font-mono uppercase tracking-widest">Health</span>
      </span>
    ),
  },
};

export const NoLabel: Story = {
  args: { value: 55, showValue: false },
};

export const AllSizes: Story = {
  decorators: [
    () => (
      <div className="flex items-end gap-6">
        <ProgressCircle value={68} size="sm" />
        <ProgressCircle value={68} size="md" />
        <ProgressCircle value={68} size="lg" />
        <ProgressCircle value={68} size="xl" />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex items-center gap-6">
        <ProgressCircle value={72} variant="primary" size="lg" />
        <ProgressCircle value={85} variant="hazard"  size="lg" />
        <ProgressCircle value={96} variant="alert"   size="lg" />
        <ProgressCircle value={100} variant="success" size="lg" />
      </div>
    ),
  ],
};

export const StatCluster: Story = {
  decorators: [
    () => (
      <div className="bg-surface-terminal border border-border-dark p-6">
        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono mb-6">Node Health</p>
        <div className="flex gap-8 items-center">
          {[
            { label: 'CPU',  value: 43, variant: 'primary' as const },
            { label: 'MEM',  value: 78, variant: 'hazard' as const },
            { label: 'NET',  value: 95, variant: 'alert' as const },
            { label: 'DISK', value: 31, variant: 'success' as const },
          ].map(({ label, value, variant }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <ProgressCircle value={value} variant={variant} size="lg" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  ],
};
