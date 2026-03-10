import { memo } from 'react';

export type ProgressBarVariant = 'primary' | 'hazard' | 'alert' | 'success';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value?: number;           // 0–100; omit for indeterminate
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  label?: string;
  showValue?: boolean;
  segmented?: boolean;      // divides fill into discrete blocks
  striped?: boolean;        // animated diagonal stripes on fill
  segments?: number;        // number of segments (default: 10)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACK_SIZE: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const FILL_COLOR: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary',
  hazard:  'bg-hazard',
  alert:   'bg-alert',
  success: 'bg-emerald-400',
};

const TRACK_COLOR: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary/10',
  hazard:  'bg-hazard/10',
  alert:   'bg-alert/10',
  success: 'bg-emerald-400/10',
};

const LABEL_COLOR: Record<ProgressBarVariant, string> = {
  primary: 'text-primary',
  hazard:  'text-hazard',
  alert:   'text-alert',
  success: 'text-emerald-400',
};

const STRIPE_COLOR: Record<ProgressBarVariant, string> = {
  primary: 'rgba(0,0,0,0.25)',
  hazard:  'rgba(0,0,0,0.25)',
  alert:   'rgba(0,0,0,0.25)',
  success: 'rgba(0,0,0,0.25)',
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProgressBar = ({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  segmented = false,
  striped = false,
  segments = 10,
}: ProgressBarProps) => {
  const indeterminate = value === undefined;
  const clamped = Math.min(100, Math.max(0, value ?? 0));

  const stripeStyle = striped
    ? {
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 4px,
          ${STRIPE_COLOR[variant]} 4px,
          ${STRIPE_COLOR[variant]} 8px
        )`,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label row */}
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className={`text-[10px] font-bold font-mono tabular-nums ${LABEL_COLOR[variant]}`}>
              {clamped}%
            </span>
          )}
          {showValue && indeterminate && (
            <span className="text-[10px] font-bold font-mono text-slate-600">—</span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={`relative w-full overflow-hidden flex gap-px ${TRACK_COLOR[variant]} ${TRACK_SIZE[size]}`}
      >
        {indeterminate ? (
          /* Indeterminate — scanning animation */
          <div
            className={`absolute inset-y-0 w-1/3 ${FILL_COLOR[variant]} opacity-80`}
            style={{ animation: 'aegis-scan 1.4s ease-in-out infinite' }}
          />
        ) : segmented ? (
          /* Segmented — discrete blocks */
          Array.from({ length: segments }, (_, i) => {
            const threshold = ((i + 1) / segments) * 100;
            const filled = clamped >= threshold;
            const partial = !filled && clamped > (i / segments) * 100;
            const partialWidth = partial
              ? ((clamped - (i / segments) * 100) / (100 / segments)) * 100
              : 0;

            return (
              <div key={i} className="flex-1 relative overflow-hidden bg-transparent">
                {(filled || partial) && (
                  <div
                    className={`absolute inset-y-0 left-0 ${FILL_COLOR[variant]}`}
                    style={{
                      width: filled ? '100%' : `${partialWidth}%`,
                      ...(striped ? stripeStyle : {}),
                    }}
                  />
                )}
              </div>
            );
          })
        ) : (
          /* Continuous */
          <div
            className={`h-full ${FILL_COLOR[variant]} transition-all duration-500`}
            style={{ width: `${clamped}%`, ...stripeStyle }}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ProgressBar);
