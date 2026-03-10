import type { Meta } from '@storybook/react-vite';
import Badge from '@/components/atoms/Badge';
import Kbd from '@/components/atoms/Kbd';
import { CardBody, CardHeader, default as Card } from '@/components/molecules/Card';

const meta: Meta = { title: 'Foundations/Spacing' };
export default meta;

const steps = [
  { token: '0', px: '0px' },
  { token: '0.5', px: '2px' },
  { token: '1', px: '4px' },
  { token: '1.5', px: '6px' },
  { token: '2', px: '8px' },
  { token: '3', px: '12px' },
  { token: '4', px: '16px' },
  { token: '5', px: '20px' },
  { token: '6', px: '24px' },
  { token: '8', px: '32px' },
  { token: '10', px: '40px' },
  { token: '12', px: '48px' },
  { token: '16', px: '64px' },
  { token: '20', px: '80px' },
  { token: '24', px: '96px' },
];

export const SpacingScale = {
  render: () => (
    <Card className="max-w-3xl">
      <CardHeader title="Spacing Scale" eyebrow="Foundations" variant="primary" />
      <CardBody className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge label="Tailwind" variant="primary" dot />
          <p className="text-[10px] font-mono text-slate-400">Core spacing tokens reused across layout and component primitives.</p>
        </div>
        {steps.map(({ token, px }) => (
          <div key={token} className="flex items-center gap-4">
            <Kbd>{token}</Kbd>
            <div className="h-4 bg-primary/40" style={{ width: px, minWidth: '2px' }} />
            <span className="text-[10px] font-mono text-slate-400">{px}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  ),
};

export const BorderRadius = {
  render: () => (
    <Card className="max-w-4xl">
      <CardHeader title="Border Radius" eyebrow="Foundations" variant="primary" />
      <CardBody className="flex flex-wrap items-end gap-6">
        <Badge label="Square-first system" variant="ghost" />
        {[
          { label: 'none (0)', cls: 'rounded-none' },
          { label: 'sm', cls: 'rounded-sm' },
          { label: 'md', cls: 'rounded-md' },
          { label: 'lg', cls: 'rounded-lg' },
          { label: 'full', cls: 'rounded-full' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 bg-primary/20 border border-primary/40 ${cls}`} />
            <span className="text-[9px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  ),
};

export const Shadows = {
  render: () => (
    <Card className="max-w-4xl">
      <CardHeader title="Shadows" eyebrow="Foundations" variant="primary" />
      <CardBody className="flex flex-wrap items-start gap-8">
        {[
          { label: 'shadow-sm', cls: 'shadow-sm' },
          { label: 'shadow', cls: 'shadow' },
          { label: 'shadow-md', cls: 'shadow-md' },
          { label: 'shadow-lg', cls: 'shadow-lg' },
          { label: 'shadow-xl', cls: 'shadow-xl' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 bg-panel-dark border border-border-dark ${cls}`} />
            <span className="text-[9px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  ),
};
