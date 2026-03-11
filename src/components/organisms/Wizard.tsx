import { memo, useState, useCallback, type ReactNode, type HTMLAttributes } from 'react';
import Stepper, { type StepData, type StepperOrientation } from './Stepper';
import Button from '@/components/atoms/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  /** Return false (or rejected promise) to prevent advancing */
  onNext?: () => boolean | Promise<boolean>;
}

export interface WizardProps extends HTMLAttributes<HTMLDivElement> {
  steps: WizardStep[];
  /** Controlled active index */
  activeStep?: number;
  onStepChange?: (index: number) => void;
  onComplete?: () => void;
  orientation?: StepperOrientation;
  /** Label on the final action button */
  completeLabel?: string;
  /** Hide built-in nav buttons (bring your own) */
  hideNav?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildStepData(steps: WizardStep[], activeIndex: number): StepData[] {
  return steps.map((s, i) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    status:
      i < activeIndex  ? 'complete' :
      i === activeIndex ? 'active'  :
      'pending',
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

const Wizard = ({
  steps,
  activeStep: controlledStep,
  onStepChange,
  onComplete,
  orientation = 'horizontal',
  completeLabel = 'Complete',
  hideNav = false,
  className = '',
  ...rest
}: WizardProps) => {
  const [internalStep, setInternalStep] = useState(0);
  const [validating, setValidating] = useState(false);

  const isControlled = controlledStep !== undefined;
  const activeIndex  = isControlled ? controlledStep : internalStep;

  const setStep = useCallback((next: number) => {
    if (!isControlled) setInternalStep(next);
    onStepChange?.(next);
  }, [isControlled, onStepChange]);

  const isFirst = activeIndex === 0;
  const isLast  = activeIndex === steps.length - 1;

  const handleNext = useCallback(async () => {
    const current = steps[activeIndex];
    if (current?.onNext) {
      setValidating(true);
      try {
        const ok = await current.onNext();
        if (!ok) return;
      } finally {
        setValidating(false);
      }
    }
    if (isLast) {
      onComplete?.();
    } else {
      setStep(activeIndex + 1);
    }
  }, [activeIndex, isLast, onComplete, setStep, steps]);

  const handleBack = useCallback(() => {
    if (!isFirst) setStep(activeIndex - 1);
  }, [activeIndex, isFirst, setStep]);

  const stepData = buildStepData(steps, activeIndex);
  const activeContent = steps[activeIndex]?.content;
  const isVertical = orientation === 'vertical';

  // ── Content panel + nav (shared between layouts) ──────────────────────────
  const contentPanel = (
    <div className="bg-surface-terminal border border-border-dark relative overflow-hidden flex-1">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-primary/30" />
      {/* Step label */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border-dark">
        <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">
          Step {activeIndex + 1} / {steps.length}
        </span>
        <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">
          — {steps[activeIndex]?.title}
        </span>
      </div>
      {/* Content */}
      <div className="p-4">{activeContent}</div>
    </div>
  );

  const navBar = !hideNav && (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        icon="arrow_back"
        onClick={handleBack}
        disabled={isFirst}
      >
        Back
      </Button>

      {/* Step dots */}
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={[
              'w-1.5 h-1.5 transition-all',
              i < activeIndex  ? 'bg-primary/50' :
              i === activeIndex ? 'bg-primary w-3' :
              'bg-border-dark',
            ].join(' ')}
          />
        ))}
      </div>

      <Button
        variant={isLast ? 'primary' : 'secondary'}
        size="sm"
        icon={isLast ? 'check' : 'arrow_forward'}
        onClick={handleNext}
        loading={validating}
      >
        {isLast ? completeLabel : 'Next'}
      </Button>
    </div>
  );

  if (isVertical) {
    return (
      <div {...rest} className={['flex flex-row gap-0', className].filter(Boolean).join(' ')}>
        {/* Left: vertical stepper */}
        <div className="shrink-0 border-r border-border-dark pr-6 pt-2">
          <Stepper
            steps={stepData}
            orientation="vertical"
            activeStep={activeIndex}
            onStepClick={isControlled ? setStep : undefined}
          />
        </div>

        {/* Right: content + nav */}
        <div className="flex flex-col gap-6 flex-1 pl-6">
          {contentPanel}
          {navBar}
        </div>
      </div>
    );
  }

  return (
    <div {...rest} className={['flex flex-col gap-6', className].filter(Boolean).join(' ')}>
      {/* Stepper header */}
      <Stepper
        steps={stepData}
        orientation="horizontal"
        activeStep={activeIndex}
        onStepClick={isControlled ? setStep : undefined}
      />
      {contentPanel}
      {navBar}
    </div>
  );
};

const MemoWizard = memo(Wizard);
MemoWizard.displayName = 'Wizard';

export default MemoWizard;
