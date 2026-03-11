import { memo, type TextareaHTMLAttributes, useId } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = ({ label, error, hint, id, className = '', ...rest }: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={[
          'w-full bg-surface-terminal border text-sm text-slate-200 font-mono',
          'px-3 py-2 outline-none transition-all duration-150 resize-y min-h-[80px]',
          'placeholder:text-slate-600',
          error
            ? 'border-alert/50 focus:border-alert'
            : 'border-border-dark focus:border-primary/60 hover:border-primary/20',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {(error || hint) && (
        <p className={`text-[10px] font-mono ${error ? 'text-alert' : 'text-slate-400'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};

const MemoTextarea = memo(Textarea);
MemoTextarea.displayName = 'Textarea';

export default MemoTextarea;
