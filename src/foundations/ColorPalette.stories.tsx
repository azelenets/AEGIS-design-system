import type { Meta } from '@storybook/react-vite';
import { aegisTokens } from './aegisTheme';

const meta: Meta = { title: 'Foundations/Colors' };
export default meta;

const Swatch = ({ name, value, role }: { name: string; value: string; role: string }) => (
  <div className="flex items-center gap-4">
    <span className="w-12 h-12 border border-border-dark shrink-0" style={{ backgroundColor: value }} />
    <div>
      <p className="text-xs font-bold font-mono text-white">{name}</p>
      <p className="text-[10px] font-mono text-slate-500">{value}</p>
      <p className="text-[10px] font-mono text-slate-600">{role}</p>
    </div>
  </div>
);

const palette = [
  { name: 'primary',          value: aegisTokens.colors.primary,  role: 'Main accent — cyan' },
  { name: 'hazard',           value: aegisTokens.colors.hazard,   role: 'Warning — yellow' },
  { name: 'alert',            value: aegisTokens.colors.alert,    role: 'Critical / danger — red' },
  { name: 'background',       value: aegisTokens.colors.background, role: 'Page background' },
  { name: 'panel',            value: aegisTokens.colors.panel,    role: 'Card / panel surface' },
  { name: 'terminal',         value: aegisTokens.colors.terminal, role: 'Input / terminal surface' },
  { name: 'border',           value: aegisTokens.colors.border,   role: 'Default border' },
  { name: 'text',             value: aegisTokens.colors.text,     role: 'Body text' },
  { name: 'emerald (success)',value: '#34d399',                   role: 'Success state' },
  { name: 'slate-400',        value: '#94a3b8',                   role: 'Secondary text' },
  { name: 'slate-600',        value: '#475569',                   role: 'Muted / hint text' },
];

export const AllColors = {
  render: () => (
    <div className="flex flex-col gap-5 p-6 max-w-lg">
      <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">AEGIS // Color Tokens</p>
      {palette.map((s) => <Swatch key={s.name} {...s} />)}
    </div>
  ),
};
