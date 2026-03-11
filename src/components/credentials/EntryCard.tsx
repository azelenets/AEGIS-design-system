import { memo, type HTMLAttributes } from 'react';

export interface EntryCardProps extends HTMLAttributes<HTMLElement> {
  id: string;
  code: string;
  title: string;
  full?: boolean;
}

const EntryCard = ({ id, code, title, full, className = '', ...rest }: EntryCardProps) => (
  <article {...rest} className={['p-4 border border-white/10 bg-panel-dark hover:border-primary/50 transition-colors group relative overflow-hidden', full ? 'col-span-full' : '', className].filter(Boolean).join(' ')}>
    <div
      aria-hidden="true"
      className="absolute right-0 top-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='50'%3E%3Ctext fill='white' font-size='40' font-family='monospace' y='42'%3E${encodeURIComponent(id)}%3C/text%3E%3C/svg%3E")`,
        width: '80px',
        height: '50px',
      }}
    />
    <div className="text-primary text-[8px] font-bold tracking-widest mb-1">KEY_HASH: {code}</div>
    <div className="text-sm font-bold text-white uppercase">{title}</div>
    <div className="flex items-center gap-2 mt-3">
      <div className="h-1 flex-grow bg-white/5">
        <div className="h-full bg-primary w-full shadow-[0_0_8px_#00f3ff]" />
      </div>
      <span className="text-[8px] text-primary">VAL_OK</span>
    </div>
  </article>
);

const MemoEntryCard = memo(EntryCard);
MemoEntryCard.displayName = 'EntryCard';

export default MemoEntryCard;
