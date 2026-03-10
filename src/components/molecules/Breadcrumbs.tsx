import { memo, useMemo, type ReactNode, type HTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'dot' | 'arrow';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: BreadcrumbSeparator;
  maxItems?: number;
}

// ─── Separator glyphs ─────────────────────────────────────────────────────────

const SEPARATOR_CONTENT: Record<BreadcrumbSeparator, ReactNode> = {
  slash:   <span className="text-slate-400 font-mono">/</span>,
  chevron: <span className="material-symbols-outlined text-[12px] text-slate-400">chevron_right</span>,
  dot:     <span className="w-1 h-1 rounded-full bg-slate-400 mt-px" />,
  arrow:   <span className="material-symbols-outlined text-[12px] text-slate-400">arrow_forward</span>,
};

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const Breadcrumbs = ({ items, separator = 'chevron', maxItems, className, ...rest }: BreadcrumbsProps) => {
  const { visible, collapsed } = useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return { visible: items, collapsed: false };
    }

    return {
      visible: [items[0], ...items.slice(-(maxItems - 1))],
      collapsed: true,
    };
  }, [items, maxItems]);

  return (
    <nav {...rest} aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1;
          const showCollapsed = collapsed && index === 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {/* Collapsed ellipsis before the truncated segment */}
              {showCollapsed && (
                <>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest px-1">···</span>
                  {SEPARATOR_CONTENT[separator]}
                </>
              )}

              {/* Crumb */}
              {isLast ? (
                <span
                  aria-current="page"
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest font-mono text-primary"
                >
                  {item.icon && (
                    <span className="material-symbols-outlined text-[13px]">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {item.icon && (
                    <span className="material-symbols-outlined text-[13px]">{item.icon}</span>
                  )}
                  {item.label}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400">
                  {item.icon && (
                    <span className="material-symbols-outlined text-[13px]">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}

              {/* Separator — not after last item */}
              {!isLast && (
                <span aria-hidden="true" className="flex items-center">
                  {SEPARATOR_CONTENT[separator]}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default memo(Breadcrumbs);
