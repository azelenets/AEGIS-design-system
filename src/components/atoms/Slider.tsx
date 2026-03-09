import { memo, type InputHTMLAttributes, useId } from 'react';

export type SliderVariant = 'primary' | 'hazard' | 'alert';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  showValue?: boolean;
  variant?: SliderVariant;
  formatValue?: (v: number) => string;
}

const ACCENT: Record<SliderVariant, string> = {
  primary: 'accent-primary',
  hazard:  'accent-hazard',
  alert:   'accent-alert',
};

const VALUE_COLOR: Record<SliderVariant, string> = {
  primary: 'text-primary',
  hazard:  'text-hazard',
  alert:   'text-alert',
};

const Slider = ({
  label,
  hint,
  showValue = true,
  variant = 'primary',
  formatValue,
  id,
  min = 0,
  max = 100,
  className = '',
  ...rest
}: SliderProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const rawValue = Number(rest.value ?? rest.defaultValue ?? 0);
  const formatted = formatValue ? formatValue(rawValue) : String(rawValue);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={inputId}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className={`text-[10px] font-bold font-mono tabular-nums ${VALUE_COLOR[variant]}`}>
              {formatted}
            </span>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        className={[
          'w-full h-1.5 appearance-none cursor-pointer',
          'bg-surface-terminal',
          '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-surface-terminal',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-none',
          ACCENT[variant],
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        {...rest}
      />
      {hint && <p className="text-[10px] text-slate-600 font-mono">{hint}</p>}
    </div>
  );
};

export default memo(Slider);
