import { memo, type ReactNode } from 'react';

export type CardVariant = 'default' | 'primary' | 'hazard' | 'alert';

export interface CardProps {
  variant?: CardVariant;
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
}

export interface CardHeaderProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  variant?: CardVariant;
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  align?: 'left' | 'right' | 'between';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_BORDER: Record<CardVariant, string> = {
  default: 'border-border-dark',
  primary: 'border-primary/20',
  hazard:  'border-hazard/20',
  alert:   'border-alert/20',
};

const VARIANT_HOVER: Record<CardVariant, string> = {
  default: 'hover:border-primary/30',
  primary: 'hover:border-primary/40',
  hazard:  'hover:border-hazard/40',
  alert:   'hover:border-alert/40',
};

const VARIANT_EYEBROW: Record<CardVariant, string> = {
  default: 'text-slate-500',
  primary: 'text-primary/60',
  hazard:  'text-hazard/60',
  alert:   'text-alert/60',
};

const FOOTER_ALIGN: Record<'left' | 'right' | 'between', string> = {
  left:    'justify-start',
  right:   'justify-end',
  between: 'justify-between',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export const CardHeader = memo(({ title, eyebrow, action, variant = 'default' }: CardHeaderProps) => (
  <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-border-dark">
    <div className="flex flex-col gap-0.5 min-w-0">
      {eyebrow && (
        <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${VARIANT_EYEBROW[variant]}`}>
          {eyebrow}
        </span>
      )}
      <h3 className="text-sm font-bold text-white font-mono truncate">{title}</h3>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardBody = memo(({ children, className = '' }: CardBodyProps) => (
  <div className={`px-5 py-4 flex-1 ${className}`}>{children}</div>
));

CardBody.displayName = 'CardBody';

export const CardFooter = memo(({ children, align = 'right' }: CardFooterProps) => (
  <div className={`flex flex-wrap items-center gap-3 px-5 py-3 border-t border-border-dark ${FOOTER_ALIGN[align]}`}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({ variant = 'default', hoverable = false, className = '', children }: CardProps) => (
  <div
    className={[
      'flex flex-col bg-panel-dark border',
      VARIANT_BORDER[variant],
      hoverable ? `transition-colors cursor-pointer ${VARIANT_HOVER[variant]}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

export default memo(Card);
