import { memo, type InputHTMLAttributes, useId } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'primary' | 'hazard' | 'alert';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  hint?: string;
  size?: ToggleSize;
  variant?: ToggleVariant;
  labelPosition?: 'right' | 'left';
}

const SIZE: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: { track: 'w-7 h-4',   thumb: 'w-2.5 h-2.5 top-[3px] left-[3px]', translate: 'translate-x-3' },
  md: { track: 'w-9 h-5',   thumb: 'w-3 h-3 top-[4px] left-[4px]',     translate: 'translate-x-4' },
  lg: { track: 'w-11 h-6',  thumb: 'w-4 h-4 top-[4px] left-[4px]',     translate: 'translate-x-5' },
};

const VARIANT_TRACK: Record<ToggleVariant, string> = {
  primary: 'group-has-[input:checked]/box:bg-primary/20 group-has-[input:checked]/box:border-primary',
  hazard:  'group-has-[input:checked]/box:bg-hazard/20  group-has-[input:checked]/box:border-hazard',
  alert:   'group-has-[input:checked]/box:bg-alert/20   group-has-[input:checked]/box:border-alert',
};

const VARIANT_THUMB: Record<ToggleVariant, string> = {
  primary: 'group-has-[input:checked]/box:bg-primary',
  hazard:  'group-has-[input:checked]/box:bg-hazard',
  alert:   'group-has-[input:checked]/box:bg-alert',
};

const Toggle = ({
  label,
  hint,
  size = 'md',
  variant = 'primary',
  labelPosition = 'right',
  id,
  className = '',
  ...rest
}: ToggleProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const s = SIZE[size];

  const track = (
    <span className="relative flex-shrink-0 group/box">
      <input id={inputId} type="checkbox" className="sr-only" {...rest} />
      {/* Track */}
      <span
        className={[
          'block rounded-full border transition-colors',
          'bg-surface-terminal border-slate-600',
          'group-hover/toggle:border-primary/40',
          VARIANT_TRACK[variant],
          s.track,
        ].join(' ')}
      />
      {/* Thumb */}
      <span
        className={[
          'absolute rounded-full bg-slate-500 transition-all',
          `group-has-[input:checked]/box:${s.translate}`,
          VARIANT_THUMB[variant],
          s.thumb,
        ].join(' ')}
      />
    </span>
  );

  const text = (label || hint) && (
    <span className="flex flex-col gap-0.5 select-none">
      {label && (
        <span className="text-xs text-slate-300 font-mono leading-tight group-hover/toggle:text-slate-100 transition-colors">
          {label}
        </span>
      )}
      {hint && <span className="text-[10px] text-slate-600 font-mono">{hint}</span>}
    </span>
  );

  return (
    <label
      htmlFor={inputId}
      className={[
        'inline-flex items-center gap-2.5 cursor-pointer group/toggle',
        rest.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {labelPosition === 'left' && text}
      {track}
      {labelPosition === 'right' && text}
    </label>
  );
};

export default memo(Toggle);
