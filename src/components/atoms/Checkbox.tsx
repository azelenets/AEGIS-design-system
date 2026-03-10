import { memo, type InputHTMLAttributes, useId } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  indeterminate?: boolean;
}

const Checkbox = ({ label, hint, indeterminate, id, className = '', ...rest }: CheckboxProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={[
        'inline-flex items-start gap-2.5 cursor-pointer group/cb',
        rest.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Box wrapper — group/box lets children react to :checked inside */}
      <span className="relative flex-shrink-0 mt-px group/box">
        <input
          id={inputId}
          type="checkbox"
          className="sr-only"
          ref={(el) => {
            if (el) el.indeterminate = !!indeterminate;
          }}
          {...rest}
        />
        <span
          className={[
            'flex items-center justify-center w-4 h-4 border transition-colors',
            'bg-surface-terminal border-slate-600',
            'group-has-[input:checked]/box:border-primary group-has-[input:checked]/box:bg-primary/10',
            'group-has-[input:indeterminate]/box:border-primary group-has-[input:indeterminate]/box:bg-primary/10',
            'group-hover/cb:border-primary/50',
          ].join(' ')}
        >
          {/* Check mark — visible when checked and not indeterminate */}
          <span
            className={[
              'material-symbols-outlined text-primary text-[12px] transition-opacity',
              indeterminate
                ? 'hidden'
                : 'opacity-0 group-has-[input:checked]/box:opacity-100',
            ].join(' ')}
          >
            check
          </span>
          {/* Dash — visible when indeterminate */}
          {indeterminate && (
            <span className="block w-2 h-px bg-primary" />
          )}
        </span>
      </span>

      {(label || hint) && (
        <span className="flex flex-col gap-0.5 select-none">
          {label && (
            <span className="text-xs text-slate-300 font-mono leading-tight group-hover/cb:text-slate-100 transition-colors">
              {label}
            </span>
          )}
          {hint && <span className="text-[10px] text-slate-400 font-mono">{hint}</span>}
        </span>
      )}
    </label>
  );
};

export default memo(Checkbox);
