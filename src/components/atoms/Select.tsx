import { memo, useId, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectSingleProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
  values?: never;
  onChangeMultiple?: never;
}

interface SelectMultipleProps {
  multiple: true;
  values?: string[];
  onChangeMultiple?: (values: string[]) => void;
  value?: never;
  onChange?: never;
}

type SelectModeProps = SelectSingleProps | SelectMultipleProps;

export type SelectProps = SelectModeProps & {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

const Select = ({
  label, error, hint, options, placeholder,
  id, className = '', disabled,
  multiple, value, onChange, values, onChangeMultiple,
}: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;

  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState({ top: 0, left: 0, width: 0 });

  // Single mode internal state
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  // Multi mode internal state
  const [internalValues, setInternalValues] = useState<string[]>(values ?? []);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const openDropdown = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropdownRect({ top: r.bottom, left: r.left, width: r.width });
    }
    setOpen(true);
  }, []);

  const currentValue = (value !== undefined && onChange !== undefined) ? value : internalValue;
  const currentValues = (values !== undefined && onChangeMultiple !== undefined) ? values : internalValues;

  const isSelected = (val: string) => multiple ? currentValues.includes(val) : val === currentValue;

  const selectedOption = !multiple ? options.find((o) => o.value === currentValue) : null;
  const selectedOptions = multiple ? options.filter((o) => currentValues.includes(o.value)) : [];

  const hasSelection = multiple ? currentValues.length > 0 : !!selectedOption;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !listboxRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selectOption = useCallback((val: string) => {
    if (multiple) {
      const next = currentValues.includes(val)
        ? currentValues.filter((v) => v !== val)
        : [...currentValues, val];
      setInternalValues(next);
      onChangeMultiple?.(next);
    } else {
      setInternalValue(val);
      onChange?.(val);
      setOpen(false);
      triggerRef.current?.focus();
    }
  }, [multiple, currentValues, onChange, onChangeMultiple]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && highlighted >= 0) {
            selectOption(options[highlighted].value);
          } else {
            open ? setOpen(false) : openDropdown();
            setHighlighted(options.findIndex((o) => o.value === currentValue));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            openDropdown();
            setHighlighted(Math.max(0, options.findIndex((o) => o.value === currentValue)));
          } else {
            setHighlighted((h) => Math.min(h + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlighted((h) => Math.max(h - 1, 0));
          break;
        case 'Escape':
          setOpen(false);
          triggerRef.current?.focus();
          break;
      }
    },
    [open, highlighted, options, selectOption, disabled, currentValue],
  );

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = currentValues.filter((v) => v !== val);
    setInternalValues(next);
    onChangeMultiple?.(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-multiselectable={multiple}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onClick={() => { if (!disabled) { open ? setOpen(false) : openDropdown(); } }}
          className={[
            'w-full bg-surface-terminal border text-sm text-left font-mono',
            'px-3 py-2 pr-8 outline-none transition-all duration-150 min-h-[38px]',
            hasSelection ? 'text-slate-200' : 'text-slate-500',
            error
              ? 'border-alert/50 focus:border-alert'
              : open
                ? 'border-primary/60'
                : 'border-slate-600 hover:border-primary/30 focus:border-primary/60',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {multiple ? (
            selectedOptions.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                {selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary leading-none"
                  >
                    {opt.label}
                    <span
                      role="button"
                      aria-label={`Remove ${opt.label}`}
                      onMouseDown={(e) => removeValue(opt.value, e)}
                      className="material-symbols-outlined text-[10px] text-primary/60 hover:text-primary cursor-pointer"
                    >
                      close
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-slate-500">{placeholder ?? 'Select options…'}</span>
            )
          ) : (
            selectedOption?.label ?? <span className="text-slate-500">{placeholder ?? 'Select…'}</span>
          )}
        </button>

        <span
          className={`material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none transition-transform duration-150 ${
            open ? 'rotate-180 text-primary/60' : 'text-slate-500'
          }`}
        >
          expand_more
        </span>

        {open && createPortal(
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            onKeyDown={handleKeyDown}
            style={{ top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
            className="fixed z-[9999] mt-px bg-panel-dark border border-primary/20 py-1 max-h-52 overflow-y-auto shadow-lg shadow-black/20"
          >
            {options.map((opt, i) => {
              const selected = isSelected(opt.value);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(opt.value);
                  }}
                  className={[
                    'flex items-center gap-2.5 px-3 py-2 text-sm font-mono cursor-pointer transition-colors duration-100 select-none',
                    selected
                      ? 'text-primary bg-primary/10'
                      : highlighted === i
                        ? 'text-slate-100 bg-primary/5'
                        : 'text-slate-400',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {multiple && (
                    <span
                      className={`flex-shrink-0 w-3.5 h-3.5 border flex items-center justify-center transition-colors ${
                        selected ? 'border-primary bg-primary/20' : 'border-slate-600'
                      }`}
                    >
                      {selected && (
                        <span className="material-symbols-outlined text-primary text-[10px] leading-none">check</span>
                      )}
                    </span>
                  )}
                  {opt.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
      </div>

      {(error || hint) && (
        <p className={`text-[10px] font-mono ${error ? 'text-alert' : 'text-slate-500'}`}>{error ?? hint}</p>
      )}
    </div>
  );
};

export default memo(Select);
