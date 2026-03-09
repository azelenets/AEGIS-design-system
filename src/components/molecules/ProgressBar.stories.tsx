import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Molecules/ProgressBar',
  component: ProgressBar,
  decorators: [(Story) => <div className="max-w-sm w-full"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 68 },
};

export const WithLabel: Story = {
  args: { value: 68, label: 'Upload progress', showValue: true },
};

export const HazardVariant: Story = {
  args: { value: 85, variant: 'hazard', label: 'CPU load', showValue: true },
};

export const AlertVariant: Story = {
  args: { value: 96, variant: 'alert', label: 'Memory pressure', showValue: true },
};

export const SuccessVariant: Story = {
  args: { value: 100, variant: 'success', label: 'Deployment', showValue: true },
};

export const SizeSm: Story = {
  args: { value: 55, size: 'sm', label: 'Small', showValue: true },
};

export const SizeLg: Story = {
  args: { value: 55, size: 'lg', label: 'Large', showValue: true },
};

export const Segmented: Story = {
  args: { value: 60, segmented: true, label: 'Sectors cleared', showValue: true },
};

export const SegmentedFew: Story = {
  args: { value: 75, segmented: true, segments: 5, variant: 'hazard', label: 'Override progress', showValue: true },
};

export const Striped: Story = {
  args: { value: 72, striped: true, label: 'Transfer rate', showValue: true },
};

export const StripedSegmented: Story = {
  args: { value: 50, segmented: true, striped: true, segments: 8, variant: 'alert', label: 'Threat level', showValue: true },
};

export const Indeterminate: Story = {
  args: { label: 'Scanning network...' },
};

export const AllVariants: Story = {
  decorators: [
    () => (
      <div className="flex flex-col gap-4 max-w-sm">
        <ProgressBar value={72} variant="primary" label="Primary"  showValue />
        <ProgressBar value={85} variant="hazard"  label="Hazard"   showValue />
        <ProgressBar value={96} variant="alert"   label="Alert"    showValue />
        <ProgressBar value={100} variant="success" label="Success" showValue />
      </div>
    ),
  ],
};

export const SystemMonitor: Story = {
  decorators: [
    () => (
      <div className="bg-surface-terminal border border-border-dark p-5 flex flex-col gap-5 max-w-sm">
        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">System Monitor</p>
        <ProgressBar value={43}  variant="primary" label="CPU"     showValue size="sm" />
        <ProgressBar value={78}  variant="hazard"  label="Memory"  showValue size="sm" />
        <ProgressBar value={21}  variant="primary" label="Disk I/O" showValue size="sm" />
        <ProgressBar value={95}  variant="alert"   label="Network" showValue size="sm" />
        <ProgressBar              variant="primary" label="Syncing..." size="sm" />
      </div>
    ),
  ],
};
