import { memo, type ReactNode, type HTMLAttributes } from 'react';

export type StepStatus = 'pending' | 'active' | 'complete' | 'error';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepData {
  id: string;
  title: string;
  description?: string;
  status: StepStatus;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepData[];
  orientation?: StepperOrientation;
  children?: ReactNode;   // active step content
  activeStep?: number;
  onStepClick?: (index: number) => void;
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

const Stepper = ({
  steps,
  orientation = 'horizontal',
  children,
  activeStep,
  onStepClick,
  className = '',
  ...rest
}: StepperProps) => {
  const isInteractive = Boolean(onStepClick);

  if (orientation === 'vertical') {
    return (
      <div {...rest} className={['flex flex-col', className].filter(Boolean).join(' ')}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isCurrent = activeStep === i;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                {isInteractive ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(i)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Go to step ${i + 1}: ${step.title}`}
                    className={`shrink-0 transition-colors hover:text-white focus:outline-none focus-visible:text-white ${ICON_COLOR[step.status]}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{ICON[step.status]}</span>
                  </button>
                ) : (
                  <span className={`material-symbols-outlined text-[22px] shrink-0 ${ICON_COLOR[step.status]}`}>
                    {ICON[step.status]}
                  </span>
                )}
                {!isLast && (
                  <div className={`w-px flex-1 min-h-[1.5rem] mt-1 mb-1 ${LINE_COLOR[step.status]}`} />
                )}
              </div>
              {/* Content */}
              <div className={`pb-6 ${isLast ? '' : ''}`}>
                {isInteractive ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(i)}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`text-left transition-colors hover:text-white focus:outline-none focus-visible:text-white ${TITLE_COLOR[step.status]}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest font-mono leading-tight">
                      {step.title}
                    </p>
                  </button>
                ) : (
                  <p className={`text-[10px] font-bold uppercase tracking-widest font-mono leading-tight ${TITLE_COLOR[step.status]}`}>
                    {step.title}
                  </p>
                )}
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
    <div {...rest} className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      <div className="flex items-start">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isCurrent = activeStep === i;
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
              {isInteractive ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(i)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Go to step ${i + 1}: ${step.title}`}
                  className={`z-10 flex flex-col items-center bg-bg-dark px-1 transition-colors hover:text-white focus:outline-none focus-visible:text-white ${ICON_COLOR[step.status]}`}
                >
                  <span className="material-symbols-outlined text-[22px]">{ICON[step.status]}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest font-mono text-center mt-1.5 ${TITLE_COLOR[step.status]}`}>
                    {step.title}
                  </span>
                </button>
              ) : (
                <>
                  <span className={`material-symbols-outlined text-[22px] z-10 bg-bg-dark ${ICON_COLOR[step.status]}`}>
                    {ICON[step.status]}
                  </span>
                  <p className={`text-[9px] font-bold uppercase tracking-widest font-mono text-center mt-1.5 px-1 ${TITLE_COLOR[step.status]}`}>
                    {step.title}
                  </p>
                </>
              )}
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

const MemoStepper = memo(Stepper);
MemoStepper.displayName = 'Stepper';

export default MemoStepper;
