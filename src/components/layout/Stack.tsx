import { memo, type ElementType, type ReactNode, type HTMLAttributes } from 'react';

// ─── Shared types ─────────────────────────────────────────────────────────────

export type StackDirection = 'row' | 'col';
export type StackGap      = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
export type StackAlign    = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify  = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type ZStackAlign   = 'start' | 'center' | 'end' | 'stretch';

// ─── Class maps ───────────────────────────────────────────────────────────────

const GAP: Record<StackGap, string> = {
  0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4',
  5: 'gap-5', 6: 'gap-6', 8: 'gap-8', 10: 'gap-10', 12: 'gap-12', 16: 'gap-16',
};

const ALIGN: Record<StackAlign, string> = {
  start: 'items-start', center: 'items-center', end: 'items-end',
  stretch: 'items-stretch', baseline: 'items-baseline',
};

const JUSTIFY: Record<StackJustify, string> = {
  start: 'justify-start', center: 'justify-center', end: 'justify-end',
  between: 'justify-between', around: 'justify-around', evenly: 'justify-evenly',
};

const ZSTACK_PLACE: Record<ZStackAlign, string> = {
  start: 'place-items-start',
  center: 'place-items-center',
  end: 'place-items-end',
  stretch: 'place-items-stretch',
};

// ─── Stack ────────────────────────────────────────────────────────────────────

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  children: ReactNode;
}

const Stack = ({
  as: Tag = 'div',
  direction = 'col',
  gap = 4,
  align,
  justify,
  wrap = false,
  children,
  className = '',
  ...rest
}: StackProps) => (
  <Tag
    className={[
      'flex',
      direction === 'row' ? 'flex-row' : 'flex-col',
      GAP[gap],
      align   ? ALIGN[align]     : '',
      justify ? JUSTIFY[justify] : '',
      wrap    ? 'flex-wrap'      : '',
      className,
    ].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </Tag>
);

export default memo(Stack);

// ─── HStack ───────────────────────────────────────────────────────────────────
// Horizontal flex row — shorthand for Stack direction="row"

export type HStackProps = Omit<StackProps, 'direction'>;

export const HStack = memo(({ gap = 4, align = 'center', ...rest }: HStackProps) => (
  <Stack direction="row" gap={gap} align={align} {...rest} />
));
HStack.displayName = 'HStack';

// ─── VStack ───────────────────────────────────────────────────────────────────
// Vertical flex column — shorthand for Stack direction="col"

export type VStackProps = Omit<StackProps, 'direction'>;

export const VStack = memo(({ gap = 4, ...rest }: VStackProps) => (
  <Stack direction="col" gap={gap} {...rest} />
));
VStack.displayName = 'VStack';

// ─── ZStack ───────────────────────────────────────────────────────────────────
// Z-axis stack — children share the same grid cell, layered front-to-back.
// Container sizes to the largest child naturally; later children render on top.

export interface ZStackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Alignment of children within the shared cell (default: 'stretch') */
  align?: ZStackAlign;
  children: ReactNode;
}

export const ZStack = memo(({
  as: Tag = 'div',
  align = 'stretch',
  children,
  className = '',
  ...rest
}: ZStackProps) => (
  <Tag
    className={[
      'grid',
      ZSTACK_PLACE[align],
      // All direct children share grid area 1/1
      '[&>*]:[grid-area:1/1]',
      className,
    ].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </Tag>
));
ZStack.displayName = 'ZStack';

// ─── Spacer ───────────────────────────────────────────────────────────────────
// Flex spacer — absorbs remaining space in a Stack/HStack/VStack row or column.

export type SpacerProps = HTMLAttributes<HTMLDivElement>;

export const Spacer = memo(({ className = '', ...rest }: SpacerProps) => (
  <div className={['flex-1', className].join(' ')} aria-hidden="true" {...rest} />
));
Spacer.displayName = 'Spacer';

// ─── Center ───────────────────────────────────────────────────────────────────
// Centers children both axes via flex.

export interface CenterProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export const Center = memo(({ as: Tag = 'div', children, className = '', ...rest }: CenterProps) => (
  <Tag
    className={['flex items-center justify-center', className].join(' ')}
    {...rest}
  >
    {children}
  </Tag>
));
Center.displayName = 'Center';
