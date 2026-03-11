import { memo, type InputHTMLAttributes, type ReactNode, useId } from 'react';

// ─── RadioOption ──────────────────────────────────────────────────────────────

export interface RadioOptionProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
}

export const RadioOption = memo(({ label, hint, id, className = '', ...rest }: RadioOptionProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={[
        'inline-flex items-start gap-2.5 cursor-pointer group/radio',
        rest.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="relative flex-shrink-0 mt-px group/box">
        <input
          id={inputId}
          type="radio"
          className="sr-only"
          {...rest}
        />
        {/* Outer ring */}
        <span
          className={[
            'flex items-center justify-center w-4 h-4 rounded-full border transition-colors',
            'bg-surface-terminal border-border-dark',
            'group-has-[input:checked]/box:border-primary',
            'group-hover/radio:border-primary/50',
          ].join(' ')}
        >
          {/* Inner dot */}
          <span
            className={[
              'w-1.5 h-1.5 rounded-full bg-primary transition-transform scale-0',
              'group-has-[input:checked]/box:scale-100',
            ].join(' ')}
          />
        </span>
      </span>

      {(label || hint) && (
        <span className="flex flex-col gap-0.5 select-none">
          {label && (
            <span className="text-xs text-slate-300 font-mono leading-tight group-hover/radio:text-slate-100 transition-colors">
              {label}
            </span>
          )}
          {hint && <span className="text-[10px] text-slate-400 font-mono">{hint}</span>}
        </span>
      )}
    </label>
  );
});

RadioOption.displayName = 'RadioOption';

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps {
  name: string;
  label?: string;
  hint?: string;
  orientation?: RadioGroupOrientation;
  children: ReactNode;
}

const ORIENTATION_CLASSES: Record<RadioGroupOrientation, string> = {
  vertical: 'flex-col gap-3',
  horizontal: 'flex-row flex-wrap gap-x-6 gap-y-3',
};

const RadioGroup = ({ name: _name, label, hint, orientation = 'vertical', children }: RadioGroupProps) => (
  <fieldset className="border-0 m-0 p-0">
    {label && (
      <legend className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-3">
        {label}
      </legend>
    )}
    <div className={`flex ${ORIENTATION_CLASSES[orientation]}`}>{children}</div>
    {hint && <p className="text-[10px] text-slate-400 font-mono mt-2">{hint}</p>}
  </fieldset>
);

const MemoRadioGroup = memo(RadioGroup);
MemoRadioGroup.displayName = 'RadioGroup';

export default MemoRadioGroup;
