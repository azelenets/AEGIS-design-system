import { memo, type SelectHTMLAttributes, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = ({ label, error, hint, options, placeholder, id, className = '', ...rest }: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={[
            'w-full appearance-none bg-surface-terminal border text-sm text-slate-200 font-mono',
            'px-3 py-2 pr-8 outline-none transition-all duration-150',
            error
              ? 'border-alert/50 focus:border-alert'
              : 'border-border-dark focus:border-primary/60 hover:border-primary/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-panel-dark text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-500 pointer-events-none">
          expand_more
        </span>
      </div>
      {(error || hint) && (
        <p className={`text-[10px] font-mono ${error ? 'text-alert' : 'text-slate-500'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};

export default memo(Select);
