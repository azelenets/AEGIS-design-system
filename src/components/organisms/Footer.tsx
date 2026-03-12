import { memo, type ReactNode, type HTMLAttributes } from 'react';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import type { MaterialIconName } from '@/components/atoms/MaterialIcon';

export interface FooterLink {
  id: string;
  label: string;
  href?: string;
  icon?: MaterialIconName;
  onClick?: () => void;
}

export interface FooterGroup {
  id: string;
  label: string;
  links: FooterLink[];
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  tagline?: string;
  groups?: FooterGroup[];
  bottom?: ReactNode;
  copyright?: string;
}

const Footer = ({ brand, tagline, groups = [], bottom, copyright, className = '', ...rest }: FooterProps) => (
  <footer {...rest} className={['w-full bg-panel-dark border-t border-border-dark', className].filter(Boolean).join(' ')}>
    {/* Main content */}
    {(brand || groups.length > 0) && (
      <div className="px-6 py-8 grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto]">
        {/* Brand column */}
        {brand && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">{brand}</div>
            {tagline && (
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                {tagline}
              </p>
            )}
          </div>
        )}

        {/* Link groups */}
        {groups.length > 0 && (
          <div className="flex flex-wrap gap-10">
            {groups.map((group) => (
              <div key={group.id} className="flex flex-col gap-3 min-w-[100px]">
                <span className="text-[9px] font-bold font-mono uppercase tracking-[0.2em] text-primary">
                  {group.label}
                </span>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => {
                    const Tag = link.href ? 'a' : 'button';
                    return (
                      <li key={link.id}>
                        <Tag
                          {...(link.href
                            ? { href: link.href }
                            : { type: 'button' as const, onClick: link.onClick })}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {link.icon && (
                            <MaterialIcon name={link.icon} className="text-[13px]" />
                          )}
                          {link.label}
                        </Tag>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Bottom bar */}
    <div className="flex items-center justify-between px-6 py-3 border-t border-border-dark/60">
      {copyright ? (
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{copyright}</span>
      ) : (
        <span />
      )}
      {bottom && <div className="flex items-center gap-3">{bottom}</div>}
    </div>
  </footer>
);

const MemoFooter = memo(Footer);
MemoFooter.displayName = 'Footer';

export default MemoFooter;
