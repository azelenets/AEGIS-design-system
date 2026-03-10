import {
  memo,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
  cloneElement,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
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
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const getPosition = useCallback(() => {
    if (!triggerRef.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();
    const left = align === 'right' ? rect.right - parseFloat(width) : rect.left;
    return { top: rect.bottom + window.scrollY + 4, left: left + window.scrollX };
  }, [align, width]);

  const updatePosition = useCallback(() => {
    const next = getPosition();
    if (!next) return;
    setPos(next);
  }, [getPosition]);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => {
    setOpen((value) => {
      if (value) return false;
      const next = getPosition();
      if (next) setPos(next);
      return true;
    });
  }, [getPosition]);

  const getMenuItems = useCallback((): HTMLButtonElement[] => {
    if (!menuRef.current) return [];
    return Array.from(menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
      .filter((item) => !item.disabled);
  }, []);

  const focusMenuItem = useCallback((index: number) => {
    const items = getMenuItems();
    if (items.length === 0) return;
    const nextIndex = (index + items.length) % items.length;
    setActiveIndex(nextIndex);
    items[nextIndex]?.focus();
  }, [getMenuItems]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      focusMenuItem(0);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, focusMenuItem]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        triggerRef.current?.focus();
      }
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

  const handleTriggerKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        updatePosition();
        setOpen(true);
      } else {
        focusMenuItem(activeIndex + 1);
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        updatePosition();
        setOpen(true);
      } else {
        focusMenuItem(activeIndex - 1);
      }
    }
  }, [activeIndex, focusMenuItem, open, updatePosition]);

  const handleMenuKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusMenuItem(activeIndex + 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusMenuItem(activeIndex - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      focusMenuItem(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      const items = getMenuItems();
      focusMenuItem(items.length - 1);
    }
  }, [activeIndex, focusMenuItem, getMenuItems]);

  const triggerProps = {
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': `${baseId}-menu`,
    onClick: (e: ReactMouseEvent<HTMLElement>) => {
      e.preventDefault();
      toggleMenu();
    },
    onKeyDown: handleTriggerKeyDown,
  };

  const renderedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, triggerProps)
    : (
      <div
        role="button"
        tabIndex={0}
        {...triggerProps}
      >
        {trigger}
      </div>
    );

  return (
    <>
      <div
        {...rest}
        ref={triggerRef}
        className={['inline-flex', className].filter(Boolean).join(' ')}
      >
        {renderedTrigger}
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          id={`${baseId}-menu`}
          role="menu"
          className="fixed z-50 py-1 bg-panel-dark border border-border-dark shadow-xl"
          style={{ top: pos.top, left: pos.left, width }}
          onClick={closeMenu}
          onKeyDown={handleMenuKeyDown}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export default memo(Dropdown);
