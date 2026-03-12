import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import { aegisLayers } from '@/foundations/layers';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'primary' | 'hazard' | 'alert';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  variant?: ModalVariant;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
}

// ─── Sub-component prop types ─────────────────────────────────────────────────

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  eyebrow?: string;
  onClose?: () => void;
  variant?: ModalVariant;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface ModalContextValue {
  titleId: string;
  descriptionId: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm:   'max-w-sm w-full',
  md:   'max-w-md w-full',
  lg:   'max-w-lg w-full',
  xl:   'max-w-2xl w-full',
  full: 'max-w-[calc(100vw-2rem)] w-full',
};

const VARIANT_BORDER: Record<ModalVariant, string> = {
  primary: 'border-primary/25',
  hazard:  'border-hazard/25',
  alert:   'border-alert/25',
};

const VARIANT_EYEBROW: Record<ModalVariant, string> = {
  primary: 'text-primary',
  hazard:  'text-hazard',
  alert:   'text-alert',
};

const FOOTER_ALIGN: Record<'left' | 'right' | 'center', string> = {
  left:   'justify-start',
  right:  'justify-end',
  center: 'justify-center',
};

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal sub-components must be used inside <Modal>.');
  return context;
};

// ─── ModalHeader ──────────────────────────────────────────────────────────────

export const ModalHeader = memo(({ title, eyebrow, onClose, variant = 'primary', className = '', ...rest }: ModalHeaderProps) => {
  const { titleId } = useModalContext();

  return (
    <div {...rest} className={['flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border-dark shrink-0', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-0.5 min-w-0">
        {eyebrow && (
          <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${VARIANT_EYEBROW[variant]}`}>
            {eyebrow}
          </span>
        )}
        <h2 id={titleId} className="text-base font-display font-bold text-white leading-tight truncate">{title}</h2>
      </div>
      {onClose && (
        <Button
          onClick={onClose}
          aria-label="Close dialog"
          variant="ghost"
          size="sm"
          className="shrink-0 min-w-0 border-0 px-1 py-1 text-slate-600 hover:text-slate-200 mt-0.5"
        >
          <MaterialIcon name="close" className="text-[20px]" />
        </Button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

// ─── ModalBody ────────────────────────────────────────────────────────────────

export const ModalBody = memo(({ children, className = '', ...rest }: ModalBodyProps) => {
  const { descriptionId } = useModalContext();

  return (
    <div id={descriptionId} {...rest} className={['px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-400 font-mono leading-relaxed', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
});

ModalBody.displayName = 'ModalBody';

// ─── ModalFooter ──────────────────────────────────────────────────────────────

export const ModalFooter = memo(({ children, align = 'right', className = '', ...rest }: ModalFooterProps) => (
  <div {...rest} className={['flex flex-wrap items-center gap-3 px-6 py-4 border-t border-border-dark shrink-0', FOOTER_ALIGN[align], className].filter(Boolean).join(' ')}>
    {children}
  </div>
));

ModalFooter.displayName = 'ModalFooter';

// ─── Modal ────────────────────────────────────────────────────────────────────

const Modal = ({
  open,
  onClose,
  size = 'md',
  variant = 'primary',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = '',
  ...rest
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const modalId = useId();
  const contextValue = useMemo(
    () => ({ titleId: `${modalId}-title`, descriptionId: `${modalId}-description` }),
    [modalId],
  );

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') onClose();
    },
    [closeOnEscape, onClose],
  );

  // Scroll lock + key listener
  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const panel = panelRef.current;
    if (panel) {
      const focusable = panel.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? panel).focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const handlePanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      return;
    }

    if (e.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusable.length === 0) {
      e.preventDefault();
      panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey && activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: aegisLayers.modal }}
      >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
        onClick={() => closeOnBackdrop && onClose()}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Scanline overlay on backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.4))',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Panel */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={contextValue.titleId}
        aria-describedby={contextValue.descriptionId}
        onKeyDown={handlePanelKeyDown}
        tabIndex={-1}
        className={[
          'relative flex flex-col max-h-[90vh]',
          'bg-panel-dark border hud-border',
          VARIANT_BORDER[variant],
          SIZE_CLASSES[size],
          className,
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
};

const MemoModal = memo(Modal);
MemoModal.displayName = 'Modal';

export default MemoModal;
