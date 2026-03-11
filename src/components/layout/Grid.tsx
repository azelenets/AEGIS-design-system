import { memo, type ElementType, type ReactNode, type HTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap  = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  cols?: GridCols;
  colsSm?: GridCols;
  colsMd?: GridCols;
  colsLg?: GridCols;
  gap?: GridGap;
  gapX?: GridGap;
  gapY?: GridGap;
  align?: GridAlign;
  justify?: GridJustify;
  children: ReactNode;
}

const COLS: Record<GridCols, string> = {
  1:  'grid-cols-1',
  2:  'grid-cols-2',
  3:  'grid-cols-3',
  4:  'grid-cols-4',
  5:  'grid-cols-5',
  6:  'grid-cols-6',
  12: 'grid-cols-12',
};

const COLS_SM: Record<GridCols, string> = {
  1:  'sm:grid-cols-1',
  2:  'sm:grid-cols-2',
  3:  'sm:grid-cols-3',
  4:  'sm:grid-cols-4',
  5:  'sm:grid-cols-5',
  6:  'sm:grid-cols-6',
  12: 'sm:grid-cols-12',
};

const COLS_MD: Record<GridCols, string> = {
  1:  'md:grid-cols-1',
  2:  'md:grid-cols-2',
  3:  'md:grid-cols-3',
  4:  'md:grid-cols-4',
  5:  'md:grid-cols-5',
  6:  'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const COLS_LG: Record<GridCols, string> = {
  1:  'lg:grid-cols-1',
  2:  'lg:grid-cols-2',
  3:  'lg:grid-cols-3',
  4:  'lg:grid-cols-4',
  5:  'lg:grid-cols-5',
  6:  'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const GAP: Record<GridGap, string> = {
  0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3',
  4: 'gap-4', 5: 'gap-5', 6: 'gap-6', 8: 'gap-8', 10: 'gap-10', 12: 'gap-12',
};

const GAP_X: Record<GridGap, string> = {
  0: 'gap-x-0', 1: 'gap-x-1', 2: 'gap-x-2', 3: 'gap-x-3',
  4: 'gap-x-4', 5: 'gap-x-5', 6: 'gap-x-6', 8: 'gap-x-8', 10: 'gap-x-10', 12: 'gap-x-12',
};

const GAP_Y: Record<GridGap, string> = {
  0: 'gap-y-0', 1: 'gap-y-1', 2: 'gap-y-2', 3: 'gap-y-3',
  4: 'gap-y-4', 5: 'gap-y-5', 6: 'gap-y-6', 8: 'gap-y-8', 10: 'gap-y-10', 12: 'gap-y-12',
};

const ALIGN_ITEMS: Record<GridAlign, string> = {
  start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch',
};

const JUSTIFY_ITEMS: Record<GridJustify, string> = {
  start: 'justify-items-start', center: 'justify-items-center',
  end: 'justify-items-end', stretch: 'justify-items-stretch',
};

const Grid = ({
  as: Tag = 'div',
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  gap,
  gapX,
  gapY,
  align,
  justify,
  children,
  className = '',
  ...rest
}: GridProps) => (
  <Tag
    className={[
      'grid',
      COLS[cols],
      colsSm ? COLS_SM[colsSm] : '',
      colsMd ? COLS_MD[colsMd] : '',
      colsLg ? COLS_LG[colsLg] : '',
      gap != null ? GAP[gap] : '',
      gapX != null ? GAP_X[gapX] : '',
      gapY != null ? GAP_Y[gapY] : '',
      align ? ALIGN_ITEMS[align] : '',
      justify ? JUSTIFY_ITEMS[justify] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
);

const MemoGrid = memo(Grid);
MemoGrid.displayName = 'Grid';

export default MemoGrid;

// ─── GridItem ─────────────────────────────────────────────────────────────────

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  span?: GridSpan;
  spanSm?: GridSpan;
  spanMd?: GridSpan;
  spanLg?: GridSpan;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

const SPAN: Record<GridSpan, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
  5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
  9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
  full: 'col-span-full',
};

const SPAN_SM: Record<GridSpan, string> = {
  1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3', 4: 'sm:col-span-4',
  5: 'sm:col-span-5', 6: 'sm:col-span-6', 7: 'sm:col-span-7', 8: 'sm:col-span-8',
  9: 'sm:col-span-9', 10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12',
  full: 'sm:col-span-full',
};

const SPAN_MD: Record<GridSpan, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
  5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
  9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
  full: 'md:col-span-full',
};

const SPAN_LG: Record<GridSpan, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4',
  5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8',
  9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
  full: 'lg:col-span-full',
};

const ROW_SPAN: Record<number, string> = {
  1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3',
  4: 'row-span-4', 5: 'row-span-5', 6: 'row-span-6',
};

export const GridItem = memo(({
  as: Tag = 'div',
  span,
  spanSm,
  spanMd,
  spanLg,
  rowSpan,
  children,
  className = '',
  ...rest
}: GridItemProps) => (
  <Tag
    className={[
      span ? SPAN[span] : '',
      spanSm ? SPAN_SM[spanSm] : '',
      spanMd ? SPAN_MD[spanMd] : '',
      spanLg ? SPAN_LG[spanLg] : '',
      rowSpan ? ROW_SPAN[rowSpan] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
));
GridItem.displayName = 'GridItem';
