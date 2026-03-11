import { memo, type ReactNode, type HTMLAttributes } from 'react';

export type ProgressCircleVariant = 'primary' | 'hazard' | 'alert' | 'success';
export type ProgressCircleSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;           // 0–100; omit for indeterminate
  variant?: ProgressCircleVariant;
  size?: ProgressCircleSize;
  label?: ReactNode;        // center content (value shown automatically if omitted)
  showValue?: boolean;
  thickness?: number;       // stroke width in SVG units (default per size)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_PX: Record<ProgressCircleSize, number> = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 128,
};

const DEFAULT_THICKNESS: Record<ProgressCircleSize, number> = {
  sm: 4,
  md: 5,
  lg: 6,
  xl: 7,
};

const VALUE_SIZE: Record<ProgressCircleSize, string> = {
  sm: 'text-[9px]',
  md: 'text-[11px]',
  lg: 'text-sm',
  xl: 'text-base',
};

const STROKE_COLOR: Record<ProgressCircleVariant, string> = {
  primary: '#00f3ff',
  hazard:  '#facc15',
  alert:   '#ff003c',
  success: '#34d399',
};

const TRACK_OPACITY = 0.1;

// ─── Component ────────────────────────────────────────────────────────────────

const ProgressCircle = ({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = true,
  thickness,
  className = '',
  style,
  ...rest
}: ProgressCircleProps) => {
  const indeterminate = value === undefined;
  const clamped = Math.min(100, Math.max(0, value ?? 0));

  const px = SIZE_PX[size];
  const sw = thickness ?? DEFAULT_THICKNESS[size];
  const viewBox = px;
  const radius = (viewBox - sw) / 2;
  const center = viewBox / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = STROKE_COLOR[variant];

  const centerContent = label ?? (showValue && !indeterminate
    ? <span className={`font-bold font-mono tabular-nums [color:rgb(var(--text-base))] ${VALUE_SIZE[size]}`}>{clamped}</span>
    : null);

  return (
    <div
      {...rest}
      className={['relative inline-flex items-center justify-center shrink-0', className].filter(Boolean).join(' ')}
      style={{ width: px, height: px, ...style }}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        fill="none"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
        style={indeterminate ? { animation: 'aegis-spin-progress 1.4s linear infinite' } : undefined}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={sw}
          strokeOpacity={TRACK_OPACITY}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: indeterminate ? undefined : 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>

      {centerContent && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {centerContent}
        </span>
      )}
    </div>
  );
};

const MemoProgressCircle = memo(ProgressCircle);
MemoProgressCircle.displayName = 'ProgressCircle';

export default MemoProgressCircle;
