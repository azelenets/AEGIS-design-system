import { memo, type ReactNode } from 'react';

export type StepStatus = 'pending' | 'active' | 'complete' | 'error';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepData {
  id: string;
  title: string;
  description?: string;
  status: StepStatus;
}

export interface StepperProps {
  steps: StepData[];
  orientation?: StepperOrientation;
  children?: ReactNode;   // active step content
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON: Record<StepStatus, string> = {
  pending:  'radio_button_unchecked',
  active:   'adjust',
  complete: 'check_circle',
  error:    'cancel',
};

const ICON_COLOR: Record<StepStatus, string> = {
  pending:  'text-slate-400',
  active:   'text-primary',
  complete: 'text-primary',
  error:    'text-alert',
};

const TITLE_COLOR: Record<StepStatus, string> = {
  pending:  'text-slate-400',
  active:   'text-white',
  complete: 'text-slate-400',
  error:    'text-alert',
};

const LINE_COLOR: Record<StepStatus, string> = {
  pending:  'bg-border-dark',
  active:   'bg-border-dark',
  complete: 'bg-primary/40',
  error:    'bg-alert/30',
};

// ─── Component ────────────────────────────────────────────────────────────────

const Stepper = ({ steps, orientation = 'horizontal', children }: StepperProps) => {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <span className={`material-symbols-outlined text-[22px] shrink-0 ${ICON_COLOR[step.status]}`}>
                  {ICON[step.status]}
                </span>
                {!isLast && (
                  <div className={`w-px flex-1 min-h-[1.5rem] mt-1 mb-1 ${LINE_COLOR[step.status]}`} />
                )}
              </div>
              {/* Content */}
              <div className={`pb-6 ${isLast ? '' : ''}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest font-mono leading-tight ${TITLE_COLOR[step.status]}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{step.description}</p>
                )}
                {step.status === 'active' && children && (
                  <div className="mt-3">{children}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line — drawn before icon, hidden for first */}
              {i > 0 && (
                <div className={`absolute left-0 top-[11px] w-1/2 h-px ${LINE_COLOR[steps[i - 1].status]}`} />
              )}
              {/* Connector to next */}
              {!isLast && (
                <div className={`absolute right-0 top-[11px] w-1/2 h-px ${LINE_COLOR[step.status]}`} />
              )}
              {/* Icon */}
              <span className={`material-symbols-outlined text-[22px] z-10 bg-bg-dark ${ICON_COLOR[step.status]}`}>
                {ICON[step.status]}
              </span>
              {/* Label */}
              <p className={`text-[9px] font-bold uppercase tracking-widest font-mono text-center mt-1.5 px-1 ${TITLE_COLOR[step.status]}`}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-[9px] text-slate-400 font-mono text-center mt-0.5 px-1">{step.description}</p>
              )}
            </div>
          );
        })}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default memo(Stepper);
