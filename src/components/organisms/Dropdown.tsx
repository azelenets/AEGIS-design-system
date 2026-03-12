import {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';
import Divider from '@/components/atoms/Divider';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import type { MaterialIconName } from '@/components/atoms/MaterialIcon';

const getTriggerText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTriggerText).join(' ').trim();
  if (isValidElement<{ children?: ReactNode }>(node)) return getTriggerText(node.props.children);
  return '';
};

const composeClick = (
  original?: MouseEventHandler<HTMLElement>,
  next?: MouseEventHandler<HTMLElement>,
): MouseEventHandler<HTMLElement> => (event) => {
  original?.(event);
  if (!event.defaultPrevented) next?.(event);
};

const composeKeyDown = (
  original?: React.KeyboardEventHandler<HTMLElement>,
  next?: React.KeyboardEventHandler<HTMLElement>,
): React.KeyboardEventHandler<HTMLElement> => (event) => {
  original?.(event);
  if (!event.defaultPrevented) next?.(event);
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownItemProps {
  label: string;
  icon?: MaterialIconName;
  hint?: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownGroupProps {
  label?: string;
  children: ReactNode;
}

export interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
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
    {icon && <MaterialIcon name={icon} className="text-[16px] shrink-0 opacity-70" />}
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

  const focusTrigger = useCallback(() => {
    const focusable = triggerRef.current?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
  }, []);

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
        focusTrigger();
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
  }, [open, closeMenu, focusTrigger, updatePosition]);

  const handleTriggerKeyDown = useCallback((e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) {
        const next = getPosition();
        if (next) setPos(next);
        setOpen(true);
      } else {
        focusMenuItem(activeIndex + 1);
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        const next = getPosition();
        if (next) setPos(next);
        setOpen(true);
      } else {
        focusMenuItem(activeIndex - 1);
      }
    }
  }, [activeIndex, focusMenuItem, getPosition, open]);

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

  const triggerLabel = getTriggerText(trigger).replace(/\s+/g, ' ').trim() || 'Open menu';

  /* eslint-disable react-hooks/refs */
  const renderedTrigger = isValidElement(trigger)
    ? cloneElement(
        trigger as React.ReactElement<{
          onClick?: MouseEventHandler<HTMLElement>;
          onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
          className?: string;
          id?: string;
          'aria-haspopup'?: 'menu';
          'aria-expanded'?: boolean;
          'aria-controls'?: string;
          'aria-label'?: string;
        }>,
        {
          id: `${baseId}-trigger`,
          onClick: composeClick((trigger.props as { onClick?: MouseEventHandler<HTMLElement> }).onClick, () => toggleMenu()),
          onKeyDown: composeKeyDown(
            (trigger.props as { onKeyDown?: React.KeyboardEventHandler<HTMLElement> }).onKeyDown,
            handleTriggerKeyDown,
          ),
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          'aria-controls': `${baseId}-menu`,
          'aria-label': triggerLabel,
        },
      )
    : null;
  /* eslint-enable react-hooks/refs */

  return (
    <>
      <div
        ref={triggerRef}
        className={['inline-flex', className].filter(Boolean).join(' ')}
      >
        {renderedTrigger ?? (
          <button
            {...rest}
            type="button"
            onClick={toggleMenu}
            onKeyDown={handleTriggerKeyDown}
            id={`${baseId}-trigger`}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={`${baseId}-menu`}
            aria-label={triggerLabel}
          >
            {trigger}
          </button>
        )}
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          id={`${baseId}-menu`}
          role="menu"
          aria-labelledby={`${baseId}-trigger`}
          className="fixed z-50 py-1 bg-panel-dark border border-border-dark shadow-xl"
          style={{ top: pos.top, left: pos.left, width }}
          onClick={closeMenu}
          onKeyDown={handleMenuKeyDown}
          tabIndex={-1}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

const MemoDropdown = memo(Dropdown);
MemoDropdown.displayName = 'Dropdown';

export default MemoDropdown;
