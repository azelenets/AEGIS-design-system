import { memo, type ReactNode } from 'react';
import Button from '@/components/atoms/Button';

export type AlertVariant = 'info' | 'warning' | 'danger' | 'success';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
}

const VARIANT_CONFIG: Record<
  AlertVariant,
  { border: string; icon: string; iconColor: string; titleColor: string; bg: string }
> = {
  info: {
    border: 'border-primary/30',
    bg: 'bg-primary/5',
    icon: 'info',
    iconColor: 'text-primary',
    titleColor: 'text-primary',
  },
  warning: {
    border: 'border-hazard/30',
    bg: 'bg-hazard/5',
    icon: 'warning',
    iconColor: 'text-hazard',
    titleColor: 'text-hazard',
  },
  danger: {
    border: 'border-alert/30',
    bg: 'bg-alert/5',
    icon: 'error',
    iconColor: 'text-alert',
    titleColor: 'text-alert',
  },
  success: {
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/5',
    icon: 'check_circle',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-400',
  },
};

const Alert = ({ variant = 'info', title, children, onDismiss }: AlertProps) => {
  const config = VARIANT_CONFIG[variant];

  return (
    <div className={`border ${config.border} ${config.bg} p-4 flex gap-3`}>
      <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${config.iconColor}`}>
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-[10px] font-bold uppercase tracking-widest font-mono mb-1 ${config.titleColor}`}>
            {title}
          </p>
        )}
        <div className="text-xs text-slate-400 font-mono leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <Button
          onClick={onDismiss}
          variant="ghost"
          size="sm"
          className="shrink-0 min-w-0 border-0 px-1 py-1 text-slate-600 hover:text-slate-300"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </Button>
      )}
    </div>
  );
};

export default memo(Alert);
