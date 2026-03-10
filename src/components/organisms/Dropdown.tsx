import {
  memo,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownItemProps {
  label: string;
  icon?: string;
  hint?: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownGroupProps {
  label?: string;
  children: ReactNode;
}

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export const DropdownItem = memo(({ label, icon, hint, variant = 'default', disabled, onClick }: DropdownItemProps) => (
  <button
    type="button"
    role="menuitem"
    disabled={disabled}
    onClick={onClick}
    className={[
      'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variant === 'danger'
        ? 'text-alert hover:bg-alert/10'
        : 'text-slate-300 hover:bg-primary/5 hover:text-slate-100',
    ].join(' ')}
  >
    {icon && <span className="material-symbols-outlined text-[16px] shrink-0 opacity-70">{icon}</span>}
    <span className="flex-1 min-w-0">
      <span className="block text-[11px] font-mono font-bold uppercase tracking-wider">{label}</span>
      {hint && <span className="block text-[10px] text-slate-600 font-mono normal-case tracking-normal mt-0.5">{hint}</span>}
    </span>
  </button>
));

DropdownItem.displayName = 'DropdownItem';

// ─── DropdownSeparator ────────────────────────────────────────────────────────

export const DropdownSeparator = memo(() => (
  <div className="my-1 border-t border-border-dark" />
));

DropdownSeparator.displayName = 'DropdownSeparator';

// ─── DropdownGroup ────────────────────────────────────────────────────────────

export const DropdownGroup = memo(({ label, children }: DropdownGroupProps) => (
  <div role="group" aria-label={label}>
    {label && (
      <p className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-600 font-mono" aria-hidden="true">
        {label}
      </p>
    )}
    {children}
  </div>
));

DropdownGroup.displayName = 'DropdownGroup';

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const Dropdown = ({ trigger, children, align = 'left', width = '200px' }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const left = align === 'right' ? rect.right - parseFloat(width) : rect.left;
    setPos({ top: rect.bottom + window.scrollY + 4, left: left + window.scrollX });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleOutside = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <>
      <div ref={triggerRef} onClick={() => { updatePosition(); setOpen((v) => !v); }} className="inline-flex">
        {trigger}
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 py-1 bg-panel-dark border border-border-dark shadow-xl"
          style={{ top: pos.top, left: pos.left, width }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export default memo(Dropdown);
