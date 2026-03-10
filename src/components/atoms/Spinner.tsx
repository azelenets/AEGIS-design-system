import { memo, type HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'hazard' | 'alert' | 'ghost';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'text-[16px]',
  md: 'text-[24px]',
  lg: 'text-[36px]',
};

const VARIANT_CLASSES: Record<SpinnerVariant, string> = {
  primary: 'text-primary',
  hazard: 'text-hazard',
  alert: 'text-alert',
  ghost: 'text-slate-400',
};

const LABEL_SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'text-[9px]',
  md: 'text-[10px]',
  lg: 'text-xs',
};

const Spinner = ({ size = 'md', variant = 'primary', label, className = '', ...rest }: SpinnerProps) => (
  <div {...rest} className={['inline-flex flex-col items-center gap-2', className].filter(Boolean).join(' ')}>
    <span
      className={`material-symbols-outlined animate-spin ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}
    >
      progress_activity
    </span>
    {label && (
      <span className={`font-mono font-bold uppercase tracking-widest ${LABEL_SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}>
        {label}
      </span>
    )}
  </div>
);

export default memo(Spinner);
