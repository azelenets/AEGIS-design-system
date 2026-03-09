import { memo, type InputHTMLAttributes, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
}

const Input = ({ label, error, hint, icon, id, className = '', ...rest }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full bg-surface-terminal border text-sm text-slate-200 font-mono',
            'px-3 py-2 outline-none transition-all duration-150',
            'placeholder:text-slate-600',
            error
              ? 'border-alert/50 focus:border-alert'
              : 'border-border-dark focus:border-primary/60 hover:border-primary/20',
            icon ? 'pl-9' : '',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
      </div>
      {(error || hint) && (
        <p
          className={`text-[10px] font-mono ${error ? 'text-alert' : 'text-slate-500'}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
};

export default memo(Input);
