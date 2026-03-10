import {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';
import Divider from '@/components/atoms/Divider';

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

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export const DropdownItem = memo(({ label, icon, hint, variant = 'default', disabled, onClick }: DropdownItemProps) => (
  <Button
    role="menuitem"
    disabled={disabled}
    onClick={onClick}
    variant="ghost"
    size="sm"
    className={[
      'w-full justify-start gap-2.5 border-0 px-3 py-2 text-left normal-case tracking-normal transition-colors',
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
  </Button>
));

DropdownItem.displayName = 'DropdownItem';

// ─── DropdownSeparator ────────────────────────────────────────────────────────

export const DropdownSeparator = memo(() => (
  <div className="my-1 px-3">
    <Divider />
  </div>
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

const Dropdown = ({ trigger, children, align = 'left', width = '200px', className, ...rest }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const left = align === 'right' ? rect.right - parseFloat(width) : rect.left;
    setPos({ top: rect.bottom + window.scrollY + 4, left: left + window.scrollX });
  }, [align, width]);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => {
    updatePosition();
    setOpen((value) => !value);
  }, [updatePosition]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleOutside = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    const handleViewportChange = () => updatePosition();
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [open, closeMenu, updatePosition]);

  return (
    <>
      <div {...rest} ref={triggerRef} onClick={toggleMenu} className={['inline-flex', className].filter(Boolean).join(' ')}>
        {trigger}
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 py-1 bg-panel-dark border border-border-dark shadow-xl"
          style={{ top: pos.top, left: pos.left, width }}
          onClick={closeMenu}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export default memo(Dropdown);
