import { memo } from 'react';

export type TagVariant = 'primary' | 'hazard' | 'alert' | 'ghost' | 'success';

export interface TagProps {
  label: string;
  variant?: TagVariant;
  icon?: string;
  onRemove?: () => void;
}

const VARIANT: Record<TagVariant, { tag: string; remove: string }> = {
  primary: { tag: 'text-primary border-primary/30 bg-primary/5',   remove: 'hover:text-primary' },
  hazard:  { tag: 'text-hazard  border-hazard/30  bg-hazard/5',    remove: 'hover:text-hazard' },
  alert:   { tag: 'text-alert   border-alert/30   bg-alert/5',     remove: 'hover:text-alert' },
  ghost:   { tag: 'text-slate-400 border-border-dark bg-transparent', remove: 'hover:text-slate-200' },
  success: { tag: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5', remove: 'hover:text-emerald-400' },
};

const Tag = ({ label, variant = 'ghost', icon, onRemove }: TagProps) => {
  const v = VARIANT[variant];
  return (
    <span className={`inline-flex items-center gap-1 pl-2 ${onRemove ? 'pr-1' : 'pr-2'} py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono border ${v.tag}`}>
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={`ml-0.5 text-current opacity-50 ${v.remove} transition-colors`}
        >
          <span className="material-symbols-outlined text-[12px]">close</span>
        </button>
      )}
    </span>
  );
};

export default memo(Tag);
