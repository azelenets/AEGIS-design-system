import { memo, type InputHTMLAttributes, useId, useState } from 'react';

export type SliderVariant = 'primary' | 'hazard' | 'alert';
export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  showValue?: boolean;
  variant?: SliderVariant;
  orientation?: SliderOrientation;
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
  orientation = 'horizontal',
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
  const isVertical = orientation === 'vertical';

  const fill = FILL_COLOR[variant];
  const track = 'rgb(var(--color-surface-terminal))';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(Number(e.target.value));
    onChange?.(e);
  };

  const sliderInput = (
    <input
      id={inputId}
      type="range"
      min={min}
      max={max}
      style={{
        background: `linear-gradient(to right, ${fill} ${pct}%, ${track} ${pct}%)`,
      }}
      className={[
        'h-1.5 w-full appearance-none cursor-pointer',
        '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3',
        '[&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:-mt-[3px]',
        '[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0',
        THUMB_COLOR[variant],
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      onChange={handleChange}
      {...rest}
    />
  );

  return (
    <div className={['flex gap-1.5', isVertical ? 'w-fit flex-col items-center' : 'w-full flex-col'].join(' ')}>
      {(label || showValue) && (
        <div className={['flex items-center gap-2', isVertical ? 'w-full flex-col' : 'justify-between'].join(' ')}>
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
      {isVertical ? (
        <div className="flex h-24 w-4 items-center justify-center overflow-visible">
          <div className="w-24 shrink-0 -rotate-90">
            {sliderInput}
          </div>
        </div>
      ) : (
        sliderInput
      )}
      {hint && <p className="text-[10px] text-slate-400 font-mono">{hint}</p>}
    </div>
  );
};

const MemoSlider = memo(Slider);
MemoSlider.displayName = 'Slider';

export default MemoSlider;
