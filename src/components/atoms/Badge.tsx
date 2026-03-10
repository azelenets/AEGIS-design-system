import { memo, type HTMLAttributes } from 'react';

export type BadgeVariant = 'primary' | 'hazard' | 'alert' | 'ghost' | 'success';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  /** Solid filled background instead of the default tinted background */
  solid?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'text-primary border border-primary/30 bg-primary/5',
  hazard: 'text-hazard border border-hazard/30 bg-hazard/5',
  alert: 'text-alert border border-alert/30 bg-alert/5',
  ghost: 'text-slate-400 border border-border-dark bg-transparent',
  success: 'text-emerald-400 border border-emerald-400/30 bg-emerald-400/5',
};

const VARIANT_SOLID_CLASSES: Record<BadgeVariant, string> = {
  primary: 'text-bg-dark border border-primary bg-primary',
  hazard:  'text-bg-dark border border-hazard bg-hazard',
  alert:   'text-white border border-alert bg-alert',
  ghost:   'text-slate-900 border border-slate-400 bg-slate-400',
  success: 'text-bg-dark border border-emerald-400 bg-emerald-400',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-primary',
  hazard: 'bg-hazard',
  alert: 'bg-alert',
  ghost: 'bg-slate-400',
  success: 'bg-emerald-400',
};

const Badge = ({ label, variant = 'ghost', dot = false, solid = false, className = '', ...rest }: BadgeProps) => (
  <span
    {...rest}
    className={['inline-flex items-center gap-1.5 px-2 py-1.5 text-[9px] leading-none font-bold uppercase tracking-widest font-mono', solid ? VARIANT_SOLID_CLASSES[variant] : VARIANT_CLASSES[variant], className].filter(Boolean).join(' ')}
  >
    {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse-fast ${DOT_CLASSES[variant]}`} />}
    {label}
  </span>
);

export default memo(Badge);
