import { memo, type ReactNode, type HTMLAttributes } from 'react';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import type { MaterialIconName } from '@/components/atoms/MaterialIcon';
import { aegisLayers } from '@/foundations/layers';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: MaterialIconName;
  active?: boolean;
  badge?: string;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  items?: NavItem[];
  actions?: ReactNode;
  sticky?: boolean;
  onNavClick?: (item: NavItem) => void;
}

const Navbar = ({ brand, items = [], actions, sticky = true, onNavClick, className = '', ...rest }: NavbarProps) => (
  <header
    {...rest}
    className={[
      'w-full bg-panel-dark border-b border-border-dark relative',
      sticky ? 'sticky top-0' : '',
      className,
    ].filter(Boolean).join(' ')}
    style={{ zIndex: aegisLayers.navbar, ...rest.style }}
  >
    <div className="flex items-center gap-4 px-4 h-12">
      {/* Brand */}
      {brand && <div className="flex items-center gap-2 shrink-0 mr-4">{brand}</div>}

      {/* Nav items */}
      <nav className="flex-1 flex items-center gap-0 overflow-x-auto">
        {items.map((item) => {
          const Tag = item.href ? 'a' : 'button';
          return (
            <Tag
              key={item.id}
              {...(item.href ? { href: item.href } : { type: 'button' as const })}
              onClick={() => onNavClick?.(item)}
              className={[
                'inline-flex items-center gap-1.5 px-3 h-12 text-[10px] font-bold uppercase tracking-widest font-mono',
                'border-b-2 transition-colors shrink-0',
                item.active
                  ? 'text-primary border-primary'
                  : 'text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600',
              ].join(' ')}
            >
              {item.icon && <MaterialIcon name={item.icon} className="text-[15px]" />}
              {item.label}
              {item.badge && (
                <span className="ml-1 px-1 py-0.5 text-[8px] font-bold bg-primary/15 text-primary border border-primary/30">
                  {item.badge}
                </span>
              )}
            </Tag>
          );
        })}
      </nav>

      {/* Right actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-auto">{actions}</div>
      )}
    </div>
  </header>
);

const MemoNavbar = memo(Navbar);
MemoNavbar.displayName = 'Navbar';

export default MemoNavbar;
