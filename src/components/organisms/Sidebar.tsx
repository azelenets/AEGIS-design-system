import { memo, type ReactNode } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  badge?: string;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarNavItem[];
}

export interface SidebarProps {
  brand?: ReactNode;
  groups?: SidebarGroup[];
  footer?: ReactNode;
  collapsed?: boolean;
  onNavClick?: (item: SidebarNavItem) => void;
}

const Sidebar = ({ brand, groups = [], footer, collapsed = false, onNavClick }: SidebarProps) => (
  <aside
    className={[
      'flex flex-col bg-panel-dark border-r border-border-dark h-full shrink-0 transition-all',
      collapsed ? 'w-12' : 'w-52',
    ].join(' ')}
  >
    {/* Brand */}
    {brand && (
      <div className={`flex items-center h-12 border-b border-border-dark px-3 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        {brand}
      </div>
    )}

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-2">
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
          {group.label && !collapsed && (
            <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const Tag = item.href ? 'a' : 'button';
            return (
              <Tag
                key={item.id}
                {...(item.href ? { href: item.href } : { type: 'button' as const })}
                onClick={() => onNavClick?.(item)}
                title={collapsed ? item.label : undefined}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2 transition-colors border-l-2 text-left',
                  'text-[10px] font-bold uppercase tracking-widest font-mono',
                  item.active
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-primary/3',
                  collapsed ? 'justify-center' : '',
                ].join(' ')}
              >
                {item.icon && (
                  <span className={`material-symbols-outlined text-[18px] shrink-0 ${item.active ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                )}
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto px-1 py-0.5 text-[8px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                )}
              </Tag>
            );
          })}
        </div>
      ))}
    </nav>

    {/* Footer slot */}
    {footer && (
      <div className={`border-t border-border-dark p-3 flex ${collapsed ? 'justify-center' : 'flex-col'}`}>
        {footer}
      </div>
    )}
  </aside>
);

export default memo(Sidebar);
