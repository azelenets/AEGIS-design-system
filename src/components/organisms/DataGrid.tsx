import { memo, useState, useMemo, useCallback, useEffect, useRef, Fragment, useDeferredValue, type ReactNode, type ChangeEvent, type HTMLAttributes } from 'react';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import { RadioOption } from '@/components/atoms/Radio';
import SearchInput from '@/components/atoms/SearchInput';
import Pagination from '@/components/molecules/Pagination';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DGSortDir    = 'asc' | 'desc';
export type DGAlign      = 'left' | 'center' | 'right';
export type DGDensity    = 'compact' | 'default' | 'comfortable';
export type DGSelectMode = 'none' | 'single' | 'multi';

export interface DataGridColumn<T extends Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  align?: DGAlign;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface DataGridProps<T extends Record<string, unknown>> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataGridColumn<T>[];
  data: T[];
  keyField: keyof T;
  /** Row selection mode (default: 'none') */
  selectionMode?: DGSelectMode;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  /** Render expanded detail panel below a row */
  renderExpanded?: (row: T) => ReactNode;
  /** Trailing actions rendered on row hover */
  actions?: (row: T) => ReactNode;
  /** Rows per page (default: 10) */
  pageSize?: number;
  /** Initial density */
  density?: DGDensity;
  striped?: boolean;
  searchable?: boolean;
  caption?: string;
  emptyLabel?: string;
  emptyIcon?: string;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALIGN: Record<DGAlign, string> = {
  left: 'text-left', center: 'text-center', right: 'text-right',
};

const CELL_PAD: Record<DGDensity, string> = {
  compact:     'py-1.5',
  default:     'py-3',
  comfortable: 'py-5',
};

const DENSITY_ICON: Record<DGDensity, string> = {
  compact:     'density_small',
  default:     'density_medium',
  comfortable: 'density_large',
};

// ─── DataGrid ─────────────────────────────────────────────────────────────────

const DataGridInner = <T extends Record<string, unknown>>({
  columns: colDefs,
  data,
  keyField,
  selectionMode = 'none',
  selectedIds: controlledIds,
  onSelectionChange,
  renderExpanded,
  actions,
  pageSize: pageSizeProp = 10,
  density: densityProp = 'default',
  striped = false,
  searchable = false,
  caption,
  emptyLabel = 'No data',
  emptyIcon = 'inbox',
  className = '',
  ...rest
}: DataGridProps<T>) => {

  // ── Column visibility ────────────────────────────────────────────────────
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    () => new Set(colDefs.filter(c => c.hidden).map(c => c.key as string)),
  );
  const [colPanelOpen, setColPanelOpen] = useState(false);
  const colPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colPanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (colPanelRef.current && !colPanelRef.current.contains(e.target as Node))
        setColPanelOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [colPanelOpen]);

  // ── Density ──────────────────────────────────────────────────────────────
  const [density, setDensity] = useState<DGDensity>(densityProp);

  // ── Sort ─────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<DGSortDir>('asc');

  // ── Search + per-column filters ───────────────────────────────────────────
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Selection ─────────────────────────────────────────────────────────────
  const [internalIds, setInternalIds] = useState<Set<string>>(new Set());
  const isControlled = controlledIds !== undefined;
  const selectedIds  = isControlled ? controlledIds : internalIds;

  const setSelected = useCallback((ids: Set<string>) => {
    if (!isControlled) setInternalIds(ids);
    onSelectionChange?.(ids);
  }, [isControlled, onSelectionChange]);

  // ── Expansion ─────────────────────────────────────────────────────────────
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // ── Derived: visible columns ───────────────────────────────────────────────
  const visibleCols = useMemo(
    () => colDefs.filter(c => !hiddenCols.has(c.key as string)),
    [colDefs, hiddenCols],
  );

  // ── Pipeline: search → filter → sort → paginate ────────────────────────────
  const filtered = useMemo(() => {
    let rows = data;
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      rows = rows.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q)));
    }
    Object.entries(filters).forEach(([k, v]) => {
      if (!v.trim()) return;
      const q = v.toLowerCase();
      rows = rows.filter(r => String(r[k] ?? '').toLowerCase().includes(q));
    });
    return rows;
  }, [data, deferredSearch, filters]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSizeProp));
  const safePage   = Math.min(page, totalPages);
  const paged      = useMemo(() => {
    const start = (safePage - 1) * pageSizeProp;
    return sorted.slice(start, start + pageSizeProp);
  }, [sorted, safePage, pageSizeProp]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSort = useCallback((col: DataGridColumn<T>) => {
    if (!col.sortable) return;
    const k = col.key as string;
    const dir: DGSortDir = sortKey === k && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(k);
    setSortDir(dir);
    setPage(1);
  }, [sortKey, sortDir]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleFilter = useCallback((key: string, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    if (selectionMode === 'none') return;
    if (selectionMode === 'single') {
      setSelected(selectedIds.has(id) ? new Set() : new Set([id]));
      return;
    }
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }, [selectionMode, selectedIds, setSelected]);

  const toggleSelectAll = useCallback(() => {
    if (selectionMode !== 'multi') return;
    const pageIds = paged.map(r => String(r[keyField]));
    const allSel  = pageIds.every(id => selectedIds.has(id));
    const next    = new Set(selectedIds);
    if (allSel) {
      pageIds.forEach(id => next.delete(id));
    } else {
      pageIds.forEach(id => next.add(id));
    }
    setSelected(next);
  }, [selectionMode, paged, keyField, selectedIds, setSelected]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleColVisibility = useCallback((key: string) => {
    setHiddenCols(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // ── Derived flags ─────────────────────────────────────────────────────────
  const pageIds       = useMemo(() => paged.map(r => String(r[keyField])), [paged, keyField]);
  const allPageSel    = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  const somePageSel   = pageIds.some(id => selectedIds.has(id));
  const hasExpand     = Boolean(renderExpanded);
  const hasActions    = Boolean(actions);
  const hasCheckbox   = selectionMode !== 'none';
  const hasFiltersRow = useMemo(() => colDefs.some(c => c.filterable), [colDefs]);
  const hasFiltersSet = useMemo(() => Object.values(filters).some(v => v.trim()), [filters]);
  const cellPad       = CELL_PAD[density];
  const totalCols     = visibleCols.length
    + (hasCheckbox ? 1 : 0)
    + (hasExpand   ? 1 : 0)
    + (hasActions  ? 1 : 0);

  return (
    <div {...rest} className={['flex flex-col border border-border-dark bg-bg-dark', className].filter(Boolean).join(' ')}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-dark bg-surface-terminal">
        {searchable && (
          <SearchInput
            value={search}
            onChange={handleSearch}
            onClear={() => {
              setSearch('');
              setPage(1);
            }}
            placeholder="Search..."
            containerClassName="flex-1 max-w-xs"
            className="bg-bg-dark px-2 py-1 text-[11px] text-slate-300 placeholder:text-slate-700"
          />
        )}

        <div className="ml-auto flex items-center gap-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mr-2 select-none">
            {filtered.length} rows
          </span>

          {/* Density */}
          {(['compact', 'default', 'comfortable'] as DGDensity[]).map(d => (
            <Button
              key={d}
              onClick={() => setDensity(d)}
              title={d}
              variant="ghost"
              size="sm"
              className={['min-w-0 border-0 px-1 py-1', density === d ? 'text-primary' : 'text-slate-400 hover:text-slate-300'].join(' ')}
            >
              <span className="material-symbols-outlined text-[16px]">{DENSITY_ICON[d]}</span>
            </Button>
          ))}

          {/* Filter toggle */}
          {hasFiltersRow && (
            <Button
              onClick={() => setShowFilters(v => !v)}
              title="Toggle filters"
              variant="ghost"
              size="sm"
              className={['min-w-0 border-0 px-1 py-1', showFilters || hasFiltersSet ? 'text-primary' : 'text-slate-400 hover:text-slate-300'].join(' ')}
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
            </Button>
          )}

          {/* Column visibility */}
          <div className="relative" ref={colPanelRef}>
            <Button
              onClick={() => setColPanelOpen(v => !v)}
              title="Columns"
              variant="ghost"
              size="sm"
              className={['min-w-0 border-0 px-1 py-1', colPanelOpen || hiddenCols.size > 0 ? 'text-primary' : 'text-slate-400 hover:text-slate-300'].join(' ')}
            >
              <span className="material-symbols-outlined text-[16px]">view_column</span>
            </Button>
            {colPanelOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 flex min-w-[160px] flex-col items-stretch bg-panel-dark py-1 text-left border border-border-dark">
                <p className="border-b border-border-dark px-3 py-1.5 text-left text-[9px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  Columns
                </p>
                {colDefs.map(col => {
                  const k       = col.key as string;
                  const visible = !hiddenCols.has(k);
                  return (
                    <Button
                      key={k}
                      onClick={() => toggleColVisibility(k)}
                      variant="ghost"
                      size="sm"
                      className="flex w-full items-center justify-start gap-2 self-stretch border-0 px-3 py-1.5 text-left text-[11px] normal-case tracking-normal hover:bg-primary/10"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${visible ? 'text-primary' : 'text-slate-400'}`}>
                        {visible ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className={`flex-1 text-left ${visible ? 'text-slate-300' : 'text-slate-400'}`}>{col.header}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Caption ── */}
      {caption && (
        <div className="px-4 py-2 border-b border-border-dark text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-surface-terminal">
          {caption}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm font-mono">

          <thead>
            {/* Header */}
            <tr className="border-b border-primary/20 bg-surface-terminal">
                  {hasExpand && (
                    <th className="w-9 px-2" scope="col">
                      <span className="sr-only">Expand row</span>
                    </th>
                  )}
                  {hasCheckbox && (
                    <th className="w-9 px-2 py-3 text-center" scope="col">
                      <span className="sr-only">
                        {selectionMode === 'multi' ? 'Select rows' : 'Select row'}
                      </span>
                      {selectionMode === 'multi' && (
                        <Checkbox
                          checked={allPageSel}
                          indeterminate={!allPageSel && somePageSel}
                          onChange={toggleSelectAll}
                          aria-label="Select all rows"
                          className="justify-center"
                        />
                      )}
                    </th>
                  )}
              {visibleCols.map(col => {
                const k       = col.key as string;
                const isSorted = sortKey === k;
                return (
                  <th
                    key={k}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    onClick={() => handleSort(col)}
                    className={[
                      'px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400',
                      ALIGN[col.align ?? 'left'],
                      col.sortable ? 'cursor-pointer select-none hover:text-primary transition-colors' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className={`material-symbols-outlined text-[12px] ${isSorted ? 'text-primary' : 'opacity-30'}`}>
                          {isSorted ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
                  {hasActions && (
                    <th className="w-16 px-4 py-3" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
            </tr>

            {/* Filter row */}
            {showFilters && (
              <tr className="border-b border-border-dark bg-bg-dark">
                {hasExpand   && <td />}
                {hasCheckbox && <td />}
                {visibleCols.map(col => (
                  <td key={col.key as string} className="px-2 py-1.5">
                    {col.filterable ? (
                      <input
                        type="text"
                        value={filters[col.key as string] ?? ''}
                        onChange={e => handleFilter(col.key as string, e.target.value)}
                        placeholder="Filter…"
                        className="w-full bg-surface-terminal border border-border-dark px-2 py-1 text-[10px] font-mono text-slate-300 placeholder-slate-700 outline-none focus:border-primary/50 transition-colors"
                      />
                    ) : null}
                  </td>
                ))}
                {hasActions && <td />}
              </tr>
            )}
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-[32px]">{emptyIcon}</span>
                    <span className="text-[10px] uppercase tracking-widest">{emptyLabel}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, rowIndex) => {
                const id         = String(row[keyField]);
                const isSelected = selectedIds.has(id);
                const isExpanded = expandedIds.has(id);

                return (
                  <Fragment key={id}>
                    <tr
                      className={[
                        'border-b border-border-dark transition-colors group/row',
                        'hover:bg-primary/[0.06] hover:border-primary/20',
                        isSelected ? 'bg-primary/10 border-primary/20' : '',
                        striped && !isSelected && rowIndex % 2 !== 0 ? 'bg-surface-terminal/40' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {/* Expand toggle */}
                      {hasExpand && (
                        <td className="w-9 px-2 text-center">
                          <Button
                            onClick={() => toggleExpand(id)}
                            variant="ghost"
                            size="sm"
                            className="min-w-0 border-0 px-1 py-1 text-slate-400 hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </Button>
                        </td>
                      )}

                      {/* Selection checkbox / radio */}
                      {hasCheckbox && (
                        <td className="w-9 px-2 text-center">
                          {selectionMode === 'single' ? (
                            <RadioOption
                              checked={isSelected}
                              onChange={() => toggleSelect(id)}
                              aria-label={`Select row ${id}`}
                              className="justify-center"
                            />
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelect(id)}
                              aria-label={`Select row ${id}`}
                              className="justify-center"
                            />
                          )}
                        </td>
                      )}

                      {/* Data cells */}
                      {visibleCols.map((col, colIdx) => {
                        const k         = col.key as string;
                        const raw       = row[k];
                        const content   = col.render ? col.render(raw, row, rowIndex) : raw != null ? String(raw) : '—';
                        const isFirstCol = colIdx === 0;

                        return (
                          <td
                            key={k}
                            className={[
                              `px-4 ${cellPad} text-xs text-slate-300 transition-colors`,
                              'group-hover/row:text-slate-100',
                              isFirstCol
                                ? isSelected
                                  ? 'border-l-2 border-l-primary'
                                  : 'border-l-2 border-l-transparent group-hover/row:border-l-primary'
                                : '',
                              ALIGN[col.align ?? 'left'],
                            ].filter(Boolean).join(' ')}
                          >
                            {content}
                          </td>
                        );
                      })}

                      {/* Row actions */}
                      {hasActions && (
                        <td className={`px-4 ${cellPad} text-right`}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            {actions!(row)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Expanded panel */}
                    {isExpanded && renderExpanded && (
                      <tr className="border-b border-border-dark bg-bg-dark">
                        <td colSpan={totalCols} className="px-6 py-4 border-l-2 border-l-primary/40">
                          {renderExpanded(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-terminal min-h-[40px]">
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest select-none">
          {selectionMode !== 'none' && selectedIds.size > 0 ? `${selectedIds.size} selected · ` : ''}
          {filtered.length} of {data.length} rows
        </span>
        {totalPages > 1 && (
          <Pagination
            page={safePage}
            total={totalPages}
            onChange={p => { setPage(p); }}
            siblings={1}
          />
        )}
      </div>
    </div>
  );
};

// memo cast preserves generics
const DataGrid = memo(DataGridInner) as typeof DataGridInner & { displayName?: string };
DataGrid.displayName = 'DataGrid';

export default DataGrid;
