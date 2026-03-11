import {
  memo,
  useState,
  useId,
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import Button from '@/components/atoms/Button';

// ─── Context ──────────────────────────────────────────────────────────────────

export type TabsVariant = 'line' | 'pill' | 'boxed';

interface TabsCtx {
  active: string;
  setActive: (id: string) => void;
  baseId: string;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsCtx | null>(null);

const useTabsCtx = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>.');
  return ctx;
};

// ─── Prop types ───────────────────────────────────────────────────────────────

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultTab: string;
  variant?: TabsVariant;
  children: ReactNode;
  onChange?: (id: string) => void;
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export interface TabTriggerProps {
  id: string;
  icon?: string;
  children: ReactNode;
  disabled?: boolean;
}

export interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const LIST_VARIANT: Record<TabsVariant, string> = {
  line:  'border-b border-border-dark gap-0',
  pill:  'bg-surface-terminal border border-border-dark p-1 gap-1',
  boxed: 'border-b border-border-dark gap-0',
};

const TRIGGER_BASE: Record<TabsVariant, string> = {
  line:  'px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest font-mono transition-colors border-b-2 -mb-px',
  pill:  'px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest font-mono transition-colors',
  boxed: 'px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest font-mono transition-colors border border-b-0 -mb-px',
};

const TRIGGER_ACTIVE: Record<TabsVariant, string> = {
  line:  'text-primary border-primary',
  pill:  'bg-primary/15 text-primary border border-primary/30',
  boxed: 'text-primary bg-panel-dark border-primary/30 border-b-panel-dark',
};

const TRIGGER_INACTIVE: Record<TabsVariant, string> = {
  line:  'text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600',
  pill:  'text-slate-400 border border-transparent hover:text-slate-300',
  boxed: 'text-slate-400 border-transparent hover:text-slate-300',
};

// ─── TabList ──────────────────────────────────────────────────────────────────

export const TabList = memo(({ children, className = '' }: TabListProps) => {
  const { variant } = useTabsCtx();
  return (
    <div
      role="tablist"
      className={`flex items-end ${LIST_VARIANT[variant]} ${className}`}
    >
      {children}
    </div>
  );
});

TabList.displayName = 'TabList';

// ─── TabTrigger ───────────────────────────────────────────────────────────────

export const TabTrigger = memo(({ id, icon, children, disabled = false }: TabTriggerProps) => {
  const { active, setActive, baseId, variant } = useTabsCtx();
  const isActive = active === id;

  return (
    <Button
      role="tab"
      id={`${baseId}-tab-${id}`}
      aria-controls={`${baseId}-panel-${id}`}
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActive(id)}
      variant="ghost"
      size="sm"
      className={[
        'shrink-0 outline-none border-0 normal-case tracking-normal',
        'focus-visible:ring-1 focus-visible:ring-primary/40',
        TRIGGER_BASE[variant],
        isActive ? TRIGGER_ACTIVE[variant] : TRIGGER_INACTIVE[variant],
      ].join(' ')}
    >
      {icon && (
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
      )}
      {children}
    </Button>
  );
});

TabTrigger.displayName = 'TabTrigger';

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export const TabPanel = memo(({ id, children, className = '' }: TabPanelProps) => {
  const { active, baseId } = useTabsCtx();
  if (active !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${id}`}
      aria-labelledby={`${baseId}-tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
});

TabPanel.displayName = 'TabPanel';

// ─── Tabs (root) ──────────────────────────────────────────────────────────────

const Tabs = ({ defaultTab, variant = 'line', onChange, children, className = '', ...rest }: TabsProps) => {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab);

  const handleChange = useCallback((id: string) => {
    setActive(id);
    onChange?.(id);
  }, [onChange]);
  const contextValue = useMemo(
    () => ({ active, setActive: handleChange, baseId, variant }),
    [active, handleChange, baseId, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div {...rest} className={['flex flex-col', className].filter(Boolean).join(' ')}>{children}</div>
    </TabsContext.Provider>
  );
};

const MemoTabs = memo(Tabs);
MemoTabs.displayName = 'Tabs';

export default MemoTabs;
