import { memo, type HTMLAttributes } from 'react';

export type SkeletonShape = 'text' | 'box' | 'circle' | 'avatar';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
  lines?: number;   // for shape="text"
  size?: number;    // px shorthand for circle/avatar
}

const BASE = 'bg-surface-terminal aegis-shimmer';

const Line = ({ width = '100%', className = '' }: { width?: string; className?: string }) => (
  <span
    className={`block h-2 ${BASE} ${className}`}
    style={{ width }}
  />
);

const Skeleton = ({ shape = 'text', width, height, lines = 3, size, className = '', style, ...rest }: SkeletonProps) => {
  if (shape === 'circle' || shape === 'avatar') {
    const px = size ?? (shape === 'avatar' ? 40 : 32);
    return (
      <span
        {...rest}
        className={['block rounded-full', BASE, className].filter(Boolean).join(' ')}
        style={{ width: px, height: px, minWidth: px, ...style }}
      />
    );
  }

  if (shape === 'box') {
    return (
      <span
        {...rest}
        className={['block', BASE, className].filter(Boolean).join(' ')}
        style={{ width: width ?? '100%', height: height ?? '4rem', ...style }}
      />
    );
  }

  // shape === 'text' — render N lines, last one shorter
  return (
    <span {...rest} className={['flex flex-col gap-2', className].filter(Boolean).join(' ')} style={width ? { width, ...style } : style}>
      {Array.from({ length: lines }, (_, i) => (
        <Line key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </span>
  );
};

export default memo(Skeleton);
