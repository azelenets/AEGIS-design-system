import { memo, type ReactNode } from 'react';

export interface KbdProps {
  children: ReactNode;
}

/** Renders a single keyboard key in terminal-style. Compose multiple for shortcuts. */
const Kbd = ({ children }: KbdProps) => (
  <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[1.4rem] text-[10px] font-bold font-mono text-slate-300 bg-surface-terminal border border-border-dark shadow-[0_2px_0_#1a1a1a]">
    {children}
  </kbd>
);

export default memo(Kbd);
