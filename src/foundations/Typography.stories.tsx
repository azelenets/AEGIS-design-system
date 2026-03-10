import type { Meta } from '@storybook/react-vite';

const meta: Meta = { title: 'Foundations/Typography' };
export default meta;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">
    <p className="text-[9px] font-bold uppercase tracking-widest text-primary font-mono border-b border-border-dark pb-2">{title}</p>
    {children}
  </div>
);

const Row = ({ label, className, sample }: { label: string; className: string; sample?: string }) => (
  <div className="flex items-baseline gap-6">
    <span className="text-[9px] text-slate-400 font-mono w-32 shrink-0">{label}</span>
    <span className={className}>{sample ?? 'AEGIS Tactical UI'}</span>
  </div>
);

export const FontFamilies = {
  render: () => (
    <div className="flex flex-col gap-10 p-6">
      <Section title="Families">
        <Row label="font-display"  className="font-display text-2xl text-white"   sample="Orbitron — Display" />
        <Row label="font-mono"     className="font-mono   text-base text-white"   sample="JetBrains Mono — Mono" />
        <Row label="font-grotesk"  className="font-grotesk text-base text-white"  sample="Space Grotesk — Body" />
      </Section>
    </div>
  ),
};

export const TypeScale = {
  render: () => (
    <div className="flex flex-col gap-10 p-6">
      <Section title="Display scale (font-display)">
        {(['text-4xl','text-3xl','text-2xl','text-xl','text-lg'] as const).map((s) => (
          <Row key={s} label={s} className={`font-display font-bold text-white ${s}`} />
        ))}
      </Section>
      <Section title="Mono scale (font-mono)">
        {(['text-base','text-sm','text-xs','text-[11px]','text-[10px]','text-[9px]'] as const).map((s) => (
          <Row key={s} label={s} className={`font-mono text-white ${s}`} sample="Operator GHOST // Alpha-7" />
        ))}
      </Section>
    </div>
  ),
};

export const FontWeights = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <Section title="Weights (font-mono)">
        <Row label="font-normal (400)" className="font-mono font-normal text-white" />
        <Row label="font-bold (700)"   className="font-mono font-bold   text-white" />
        <Row label="font-extrabold (800)" className="font-mono font-extrabold text-white" />
      </Section>
    </div>
  ),
};

export const TextColors = {
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <Section title="Color tokens on text">
        {[
          ['text-white',       'Primary text'],
          ['text-slate-300',   'Body text'],
          ['text-slate-400',   'Secondary text'],
          ['text-slate-500',   'Tertiary / label'],
          ['text-slate-600',   'Muted / hint'],
          ['text-primary',     'Accent — primary'],
          ['text-hazard',      'Accent — hazard'],
          ['text-alert',       'Accent — alert'],
          ['text-emerald-400', 'Accent — success'],
        ].map(([cls, label]) => (
          <Row key={cls} label={label} className={`font-mono text-sm ${cls}`} sample={`${cls} — ${label}`} />
        ))}
      </Section>
    </div>
  ),
};
