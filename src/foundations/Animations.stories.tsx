import type { Meta } from '@storybook/react-vite';

const meta: Meta = { title: 'Foundations/Animations' };
export default meta;

const Demo = ({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-6 border-b border-border-dark pb-5 last:border-0">
    <div className="w-24 h-12 flex items-center justify-center">{children}</div>
    <div>
      <p className="text-xs font-bold font-mono text-white">{label}</p>
      <p className="text-[10px] font-mono text-slate-600">{hint}</p>
    </div>
  </div>
);

export const AllAnimations = {
  render: () => (
    <div className="flex flex-col gap-5 p-6 max-w-lg">
      <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 font-mono">AEGIS // Motion Tokens</p>

      <Demo label="animate-spin" hint="Tailwind built-in — 1s">
        <span className="material-symbols-outlined text-primary text-[24px] animate-spin">refresh</span>
      </Demo>

      <Demo label="animate-spin-slow" hint="Custom — 20s linear infinite">
        <span className="material-symbols-outlined text-primary/60 text-[24px] animate-spin-slow">radar</span>
      </Demo>

      <Demo label="animate-pulse" hint="Tailwind built-in — 2s">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      </Demo>

      <Demo label="animate-pulse-fast" hint="Custom — 1s">
        <span className="w-3 h-3 rounded-full bg-hazard animate-pulse-fast" />
      </Demo>

      <Demo label="aegis-scan" hint="globals.css — indeterminate bar sweep">
        <span className="relative w-full h-1.5 bg-primary/10 overflow-hidden">
          <span className="absolute inset-y-0 w-1/3 bg-primary opacity-80" style={{ animation: 'aegis-scan 1.4s ease-in-out infinite' }} />
        </span>
      </Demo>

      <Demo label="aegis-spin-progress" hint="globals.css — circular spinner">
        <span className="material-symbols-outlined text-primary text-[24px]" style={{ animation: 'aegis-spin-progress 1.4s linear infinite' }}>
          progress_activity
        </span>
      </Demo>

      <Demo label="aegis-shimmer" hint="globals.css — skeleton shimmer">
        <span className="block w-full h-6 bg-surface-terminal aegis-shimmer" />
      </Demo>

      <Demo label="transition-colors" hint="Tailwind — 150ms default">
        <button type="button" className="px-3 py-1.5 border border-border-dark text-slate-500 font-mono text-[10px] hover:border-primary hover:text-primary transition-colors">
          Hover me
        </button>
      </Demo>
    </div>
  ),
};
