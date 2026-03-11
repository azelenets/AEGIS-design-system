import {
  memo,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useId,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import type { MaterialIconName } from '@/components/atoms/MaterialIcon';
import { aegisLayers } from '@/foundations/layers';

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
  toasts: ToastData[];
  toast: (opts: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, { border: string; icon: MaterialIconName; iconColor: string; titleColor: string; bg: string }> = {
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
      <MaterialIcon name={cfg.icon} className={`text-[20px] shrink-0 mt-0.5 ${cfg.iconColor}`} />
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
        <MaterialIcon name="close" className="text-[16px]" />
      </Button>
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

// ─── Toaster ──────────────────────────────────────────────────────────────────

export const Toaster = memo(({ position = 'bottom-right' }: { position?: ToastPosition }) => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('Toaster must be used inside <ToastProvider>.');

  return createPortal(
    <div className={`fixed flex flex-col gap-2 pointer-events-none ${POSITION_CLASSES[position]}`} style={{ zIndex: aegisLayers.toast }}>
      {ctx.toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem data={t} onDismiss={ctx.dismiss} />
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
  const toastId = useId();

  const toast = useCallback((opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${toastId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...opts, id }]);
    return id;
  }, [toastId]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastItem;
