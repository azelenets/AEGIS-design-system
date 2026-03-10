import {
  memo,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;   // ms; 0 = sticky
}

interface ToastCtx {
  toast: (opts: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, { border: string; icon: string; iconColor: string; titleColor: string; bg: string }> = {
  info:    { border: 'border-primary/30',       bg: 'bg-panel-dark',  icon: 'info',         iconColor: 'text-primary',     titleColor: 'text-primary' },
  success: { border: 'border-emerald-400/30',   bg: 'bg-panel-dark',  icon: 'check_circle', iconColor: 'text-emerald-400', titleColor: 'text-emerald-400' },
  warning: { border: 'border-hazard/30',        bg: 'bg-panel-dark',  icon: 'warning',      iconColor: 'text-hazard',      titleColor: 'text-hazard' },
  danger:  { border: 'border-alert/30',         bg: 'bg-panel-dark',  icon: 'error',        iconColor: 'text-alert',       titleColor: 'text-alert' },
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-right':     'top-4 right-4 items-end',
  'top-left':      'top-4 left-4 items-start',
  'bottom-right':  'bottom-4 right-4 items-end',
  'bottom-left':   'bottom-4 left-4 items-start',
  'top-center':    'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

const DEFAULT_DURATION = 4000;

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastCtx | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

const ToastItem = memo(({ data, onDismiss }: { data: ToastData; onDismiss: (id: string) => void }) => {
  const { duration = DEFAULT_DURATION } = data;
  const cfg = VARIANT_CONFIG[data.variant ?? 'info'];

  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(() => onDismiss(data.id), duration);
    return () => clearTimeout(t);
  }, [data.id, duration, onDismiss]);

  return (
    <div className={`flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] border ${cfg.border} ${cfg.bg} p-4 shadow-xl`}>
      <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${cfg.iconColor}`}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        {data.title && (
          <p className={`text-[10px] font-bold uppercase tracking-widest font-mono mb-0.5 ${cfg.titleColor}`}>{data.title}</p>
        )}
        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{data.message}</p>
      </div>
      <Button
        onClick={() => onDismiss(data.id)}
        aria-label="Dismiss"
        variant="ghost"
        size="sm"
        className="shrink-0 min-w-0 border-0 px-1 py-1 text-slate-700 hover:text-slate-300"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </Button>
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

// ─── Toaster ──────────────────────────────────────────────────────────────────

export const Toaster = memo(({ position = 'bottom-right' }: { position?: ToastPosition }) => {
  const { } = useContext(ToastContext) ?? {};
  const ctx = useContext(ToastContext);
  // Pull toasts from provider — Toaster reads from shared state via context
  // We re-export the dismiss from provider, toasts list comes from provider state
  // The provider passes toasts + dismiss to context, Toaster reads them
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    // Subscribe to toasts via a global emitter pattern
    const handler = (e: CustomEvent<ToastData[]>) => setToasts(e.detail);
    window.addEventListener('aegis-toasts', handler as EventListener);
    return () => window.removeEventListener('aegis-toasts', handler as EventListener);
  }, []);

  const dismiss = (id: string) => {
    ctx?.dismiss(id);
  };

  return createPortal(
    <div className={`fixed z-[60] flex flex-col gap-2 pointer-events-none ${POSITION_CLASSES[position]}`}>
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem data={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body,
  );
});

Toaster.displayName = 'Toaster';

// ─── ToastProvider ────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const emit = (list: ToastData[]) => {
    window.dispatchEvent(new CustomEvent('aegis-toasts', { detail: list }));
  };

  const toast = useCallback((opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => {
      const next = [...prev, { ...opts, id }];
      emit(next);
      return next;
    });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => {
      const next = prev.filter((t) => t.id !== id);
      emit(next);
      return next;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastItem;
