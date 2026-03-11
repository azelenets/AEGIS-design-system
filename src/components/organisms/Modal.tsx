import {
  memo,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
  type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';
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
  primary: 'text-primary/60',
  hazard:  'text-hazard/60',
  alert:   'text-alert/60',
};

const FOOTER_ALIGN: Record<'left' | 'right' | 'center', string> = {
  left:   'justify-start',
  right:  'justify-end',
  center: 'justify-center',
};

// ─── ModalHeader ──────────────────────────────────────────────────────────────

export const ModalHeader = memo(({ title, eyebrow, onClose, variant = 'primary', className = '', ...rest }: ModalHeaderProps) => (
  <div {...rest} className={['flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border-dark shrink-0', className].filter(Boolean).join(' ')}>
    <div className="flex flex-col gap-0.5 min-w-0">
      {eyebrow && (
        <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${VARIANT_EYEBROW[variant]}`}>
          {eyebrow}
        </span>
      )}
      <h2 className="text-base font-display font-bold text-white leading-tight truncate">{title}</h2>
    </div>
    {onClose && (
      <Button
        onClick={onClose}
        aria-label="Close dialog"
        variant="ghost"
        size="sm"
        className="shrink-0 min-w-0 border-0 px-1 py-1 text-slate-600 hover:text-slate-200 mt-0.5"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </Button>
    )}
  </div>
));

ModalHeader.displayName = 'ModalHeader';

// ─── ModalBody ────────────────────────────────────────────────────────────────

export const ModalBody = memo(({ children, className = '', ...rest }: ModalBodyProps) => (
  <div {...rest} className={['px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-400 font-mono leading-relaxed', className].filter(Boolean).join(' ')}>
    {children}
  </div>
));

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
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const handlePanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Prevent Escape from bubbling to backdrop when panel is focused
    if (e.key === 'Escape') e.stopPropagation();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: aegisLayers.modal }}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
        onClick={() => closeOnBackdrop && onClose()}
        aria-label="Close dialog backdrop"
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
      <div
        {...rest}
        role="presentation"
        onKeyDown={handlePanelKeyDown}
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
    </div>,
    document.body,
  );
};

const MemoModal = memo(Modal);
MemoModal.displayName = 'Modal';

export default MemoModal;
