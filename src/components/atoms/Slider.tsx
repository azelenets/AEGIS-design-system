import { memo, type InputHTMLAttributes, useId, useState } from 'react';

export type SliderVariant = 'primary' | 'hazard' | 'alert';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  showValue?: boolean;
  variant?: SliderVariant;
  formatValue?: (v: number) => string;
}

const FILL_COLOR: Record<SliderVariant, string> = {
  primary: 'rgb(var(--color-primary))',
  hazard:  'rgb(var(--color-hazard))',
  alert:   'rgb(var(--color-alert))',
};

const THUMB_COLOR: Record<SliderVariant, string> = {
  primary: '[&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary',
  hazard:  '[&::-webkit-slider-thumb]:bg-hazard  [&::-moz-range-thumb]:bg-hazard',
  alert:   '[&::-webkit-slider-thumb]:bg-alert   [&::-moz-range-thumb]:bg-alert',
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
  onChange,
  ...rest
}: SliderProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isControlled = rest.value !== undefined;
  const [internalValue, setInternalValue] = useState(Number(rest.defaultValue ?? min));

  const rawValue = isControlled ? Number(rest.value) : internalValue;
  const formatted = formatValue ? formatValue(rawValue) : String(rawValue);
  const pct = ((rawValue - Number(min)) / (Number(max) - Number(min))) * 100;

  const fill = FILL_COLOR[variant];
  const track = 'rgb(var(--color-surface-terminal))';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(Number(e.target.value));
    onChange?.(e);
  };

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
        style={{
          background: `linear-gradient(to right, ${fill} ${pct}%, ${track} ${pct}%)`,
        }}
        className={[
          'w-full h-1.5 appearance-none cursor-pointer',
          // webkit: track height only — background comes from the element itself
          '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent',
          // webkit thumb
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3',
          '[&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:-mt-[3px]',
          // moz thumb
          '[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0',
          THUMB_COLOR[variant],
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
        onChange={handleChange}
        {...rest}
      />
      {hint && <p className="text-[10px] text-slate-400 font-mono">{hint}</p>}
    </div>
  );
};

export default memo(Slider);
