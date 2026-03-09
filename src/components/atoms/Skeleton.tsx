import { memo } from 'react';

export type SkeletonShape = 'text' | 'box' | 'circle' | 'avatar';

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
  lines?: number;   // for shape="text"
  size?: number;    // px shorthand for circle/avatar
  className?: string;
}

const BASE = 'bg-surface-terminal aegis-shimmer';

const Line = ({ width = '100%', className = '' }: { width?: string; className?: string }) => (
  <span
    className={`block h-2 ${BASE} ${className}`}
    style={{ width }}
  />
);

const Skeleton = ({ shape = 'text', width, height, lines = 3, size, className = '' }: SkeletonProps) => {
  if (shape === 'circle' || shape === 'avatar') {
    const px = size ?? (shape === 'avatar' ? 40 : 32);
    return (
      <span
        className={`block rounded-full ${BASE} ${className}`}
        style={{ width: px, height: px, minWidth: px }}
      />
    );
  }

  if (shape === 'box') {
    return (
      <span
        className={`block ${BASE} ${className}`}
        style={{ width: width ?? '100%', height: height ?? '4rem' }}
      />
    );
  }

  // shape === 'text' — render N lines, last one shorter
  return (
    <span className={`flex flex-col gap-2 ${className}`} style={width ? { width } : undefined}>
      {Array.from({ length: lines }, (_, i) => (
        <Line key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </span>
  );
};

export default memo(Skeleton);
