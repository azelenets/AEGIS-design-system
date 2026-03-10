import { memo, type HTMLAttributes } from 'react';

export type DividerVariant = 'primary' | 'ghost' | 'hazard';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: DividerVariant;
  vertical?: boolean;
}

const BORDER_CLASSES: Record<DividerVariant, string> = {
  primary: 'border-primary/20',
  ghost: 'border-border-dark',
  hazard: 'border-hazard/20',
};

const LABEL_CLASSES: Record<DividerVariant, string> = {
  primary: 'text-primary/60',
  ghost: 'text-slate-600',
  hazard: 'text-hazard/60',
};

const Divider = ({ label, variant = 'ghost', vertical = false, className = '', ...rest }: DividerProps) => {
  if (vertical) {
    return <div {...rest} className={['self-stretch border-l', BORDER_CLASSES[variant], className].filter(Boolean).join(' ')} />;
  }

  if (label) {
    return (
      <div {...rest} className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
        <div className={`flex-1 border-t ${BORDER_CLASSES[variant]}`} />
        <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${LABEL_CLASSES[variant]}`}>
          {label}
        </span>
        <div className={`flex-1 border-t ${BORDER_CLASSES[variant]}`} />
      </div>
    );
  }

  return <div {...rest} className={['w-full border-t', BORDER_CLASSES[variant], className].filter(Boolean).join(' ')} />;
};

export default memo(Divider);
