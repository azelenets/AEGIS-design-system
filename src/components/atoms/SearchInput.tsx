import { memo, useId, useRef, type InputHTMLAttributes } from 'react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onClear?: () => void;
  containerClassName?: string;
}

const SearchInput = ({
  label,
  onClear,
  id,
  className = '',
  containerClassName = '',
  value,
  ...rest
}: SearchInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value !== undefined ? String(value).length > 0 : false;

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={['flex flex-col gap-1.5', containerClassName].filter(Boolean).join(' ')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {/* Search icon */}
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-500 pointer-events-none">
          search
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={value}
          className={[
            'w-full bg-surface-terminal border border-border-dark text-sm text-slate-200 font-mono',
            'pl-9 pr-8 py-2 outline-none transition-all duration-150',
            'placeholder:text-slate-600',
            'focus:border-primary/60 hover:border-primary/20',
            '[&::-webkit-search-cancel-button]:hidden',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...rest}
        />
        {/* Clear button */}
        {hasValue && onClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

const MemoSearchInput = memo(SearchInput);
MemoSearchInput.displayName = 'SearchInput';

export default MemoSearchInput;
