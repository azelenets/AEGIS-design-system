import { memo } from 'react';

export interface PaginationProps {
  page: number;
  total: number;       // total number of pages
  siblings?: number;   // pages shown each side of current (default 1)
  onChange: (page: number) => void;
  showEdges?: boolean; // always show first/last page
}

// ─── Page range helper ────────────────────────────────────────────────────────

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const buildPages = (page: number, total: number, siblings: number): (number | '…')[] => {
  const left  = Math.max(1, page - siblings);
  const right = Math.min(total, page + siblings);
  const pages: (number | '…')[] = [];

  if (left > 2) pages.push(1, '…');
  else pages.push(...range(1, left - 1));

  pages.push(...range(left, right));

  if (right < total - 1) pages.push('…', total);
  else pages.push(...range(right + 1, total));

  return pages;
};

// ─── Component ────────────────────────────────────────────────────────────────

const Pagination = ({ page, total, siblings = 1, onChange, showEdges = true }: PaginationProps) => {
  const pages = showEdges ? buildPages(page, total, siblings) : range(1, total);
  const prev = page > 1;
  const next = page < total;

  const btn = (content: React.ReactNode, target: number | null, active = false, disabled = false) => (
    <button
      type="button"
      disabled={disabled || target === null}
      onClick={() => target !== null && onChange(target)}
      aria-current={active ? 'page' : undefined}
      className={[
        'flex items-center justify-center min-w-[2rem] h-8 px-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors border',
        active
          ? 'bg-primary/15 border-primary/40 text-primary'
          : 'bg-transparent border-border-dark text-slate-500 hover:border-primary/40 hover:text-slate-300',
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
    </button>
  );

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1 flex-wrap">
      {btn(<span className="material-symbols-outlined text-[14px]">chevron_left</span>,  prev ? page - 1 : null, false, !prev)}
      {pages.map((p, i) =>
        p === '…'
          ? <span key={`ellipsis-${i}`} className="flex items-end justify-center w-8 h-8 pb-1 text-slate-700 font-mono text-xs">···</span>
          : btn(p, p as number, p === page),
      )}
      {btn(<span className="material-symbols-outlined text-[14px]">chevron_right</span>, next ? page + 1 : null, false, !next)}
    </nav>
  );
};

export default memo(Pagination);
