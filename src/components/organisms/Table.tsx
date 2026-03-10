import { memo, type ReactNode, type HTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';
export type ColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T extends Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  align?: ColumnAlign;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: keyof T;
  sortKey?: string;
  sortDir?: SortDirection;
  onSort?: (key: string, dir: SortDirection) => void;
  striped?: boolean;
  emptyLabel?: string;
  emptyIcon?: string;
  caption?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALIGN_TH: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const ALIGN_TD: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ─── Table ───────────────────────────────────────────────────────────────────

const TableInner = <T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  sortKey,
  sortDir,
  onSort,
  striped = false,
  emptyLabel = 'No data',
  emptyIcon = 'inbox',
  caption,
  className = '',
  ...rest
}: TableProps<T>) => {
  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable || !onSort) return;
    const key = col.key as string;
    const next: SortDirection = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(key, next);
  };

  return (
    <div {...rest} className={['w-full overflow-x-auto border border-border-dark', className].filter(Boolean).join(' ')}>
      <table className="w-full border-collapse text-sm font-mono">
        {caption && (
          <caption className="text-[10px] text-slate-400 uppercase tracking-widest text-left px-4 py-2 border-b border-border-dark">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-primary/20 bg-surface-terminal">
            {columns.map((col) => {
              const key = col.key as string;
              const isSorted = sortKey === key;
              const sortIcon = isSorted
                ? sortDir === 'asc'
                  ? 'arrow_upward'
                  : 'arrow_downward'
                : 'unfold_more';

              return (
                <th
                  key={key}
                  style={col.width ? { width: col.width } : undefined}
                  className={[
                    'px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400',
                    ALIGN_TH[col.align ?? 'left'],
                    col.sortable ? 'cursor-pointer select-none hover:text-primary transition-colors' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span
                        className={`material-symbols-outlined text-[12px] ${isSorted ? 'text-primary' : 'opacity-30'}`}
                      >
                        {sortIcon}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-[32px]">{emptyIcon}</span>
                  <span className="text-[10px] uppercase tracking-widest">{emptyLabel}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = keyField ? String(row[keyField]) : rowIndex;
              return (
                <tr
                  key={rowKey}
                  className={[
                    'border-b border-border-dark transition-colors group/row',
                    'hover:bg-primary/[0.06] hover:border-primary/20',
                    striped && rowIndex % 2 !== 0 ? 'bg-surface-terminal/50' : 'bg-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {columns.map((col) => {
                    const key = col.key as string;
                    const rawValue = row[key];
                    const content = col.render
                      ? col.render(rawValue, row, rowIndex)
                      : rawValue != null
                        ? String(rawValue)
                        : '—';

                    const isFirst = col === columns[0];
                    return (
                      <td
                        key={key}
                        className={[
                          'px-4 py-3 text-xs text-slate-300 transition-colors',
                          'group-hover/row:text-slate-100',
                          isFirst ? 'border-l-2 border-l-transparent group-hover/row:border-l-primary' : '',
                          ALIGN_TD[col.align ?? 'left'],
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

const Table = memo(TableInner) as typeof TableInner;

export default Table;
