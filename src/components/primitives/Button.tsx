import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-black border border-primary hover:bg-primary/80 hover:border-primary/80 active:bg-primary/60',
  secondary:
    'bg-transparent text-primary border border-primary/40 hover:bg-primary/10 hover:border-primary active:bg-primary/20',
  ghost:
    'bg-transparent text-slate-400 border border-border-dark hover:text-primary hover:border-primary/40 active:bg-primary/5',
  danger:
    'bg-transparent text-alert border border-alert/40 hover:bg-alert/10 hover:border-alert active:bg-alert/20',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-[10px] gap-1',
  md: 'px-4 py-1.5 text-[11px] gap-1.5',
  lg: 'px-6 py-2.5 text-xs gap-2',
};

const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-[14px]',
  md: 'text-[16px]',
  lg: 'text-[18px]',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-bold uppercase tracking-widest',
        'transition-all duration-150 font-mono',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <span className={`material-symbols-outlined animate-spin ${ICON_SIZE_CLASSES[size]}`}>
          progress_activity
        </span>
      ) : icon ? (
        <span className={`material-symbols-outlined ${ICON_SIZE_CLASSES[size]}`}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default memo(Button);
