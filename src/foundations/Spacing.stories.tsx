import type { Meta } from '@storybook/react-vite';

const meta: Meta = { title: 'Foundations/Spacing' };
export default meta;

const steps = [
  { token: '0',   px: '0px'   },
  { token: '0.5', px: '2px'   },
  { token: '1',   px: '4px'   },
  { token: '1.5', px: '6px'   },
  { token: '2',   px: '8px'   },
  { token: '3',   px: '12px'  },
  { token: '4',   px: '16px'  },
  { token: '5',   px: '20px'  },
  { token: '6',   px: '24px'  },
  { token: '8',   px: '32px'  },
  { token: '10',  px: '40px'  },
  { token: '12',  px: '48px'  },
  { token: '16',  px: '64px'  },
  { token: '20',  px: '80px'  },
  { token: '24',  px: '96px'  },
];

export const SpacingScale = {
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono mb-2">AEGIS // Spacing Scale (Tailwind)</p>
      {steps.map(({ token, px }) => (
        <div key={token} className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 w-8 text-right shrink-0">{token}</span>
          <div className="h-4 bg-primary/40" style={{ width: px, minWidth: '2px' }} />
          <span className="text-[10px] font-mono text-slate-600">{px}</span>
        </div>
      ))}
    </div>
  ),
};

export const BorderRadius = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-6 items-end">
      <p className="w-full text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">Border Radii — AEGIS uses square corners by default (radius: 0)</p>
      {[
        { label: 'none (0)',  cls: 'rounded-none' },
        { label: 'sm',        cls: 'rounded-sm'   },
        { label: 'md',        cls: 'rounded-md'   },
        { label: 'lg',        cls: 'rounded-lg'   },
        { label: 'full',      cls: 'rounded-full' },
      ].map(({ label, cls }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 bg-primary/20 border border-primary/40 ${cls}`} />
          <span className="text-[9px] font-mono text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Shadows = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-10 items-start">
      <p className="w-full text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">Shadows</p>
      {[
        { label: 'shadow-sm',  cls: 'shadow-sm'  },
        { label: 'shadow',     cls: 'shadow'     },
        { label: 'shadow-md',  cls: 'shadow-md'  },
        { label: 'shadow-lg',  cls: 'shadow-lg'  },
        { label: 'shadow-xl',  cls: 'shadow-xl'  },
      ].map(({ label, cls }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 bg-panel-dark border border-border-dark ${cls}`} />
          <span className="text-[9px] font-mono text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  ),
};
