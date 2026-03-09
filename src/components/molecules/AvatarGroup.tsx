import { memo } from 'react';
import Avatar, { type AvatarProps } from '@/components/atoms/Avatar';

export interface AvatarGroupProps {
  avatars: Omit<AvatarProps, 'size'>[];
  max?: number;
  size?: AvatarProps['size'];
  overlap?: 'sm' | 'md' | 'lg';
}

const OVERLAP: Record<'sm' | 'md' | 'lg', string> = {
  sm: '-ml-1',
  md: '-ml-2',
  lg: '-ml-3',
};

const COUNTER_SIZE: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-7 h-7 text-[9px]',
  md: 'w-9 h-9 text-[10px]',
  lg: 'w-12 h-12 text-xs',
  xl: 'w-16 h-16 text-sm',
};

const AvatarGroup = ({ avatars, max = 5, size = 'md', overlap = 'md' }: AvatarGroupProps) => {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const offsetClass = OVERLAP[overlap];

  return (
    <div className="flex items-center">
      {visible.map((av, i) => (
        <span key={i} className={`relative ${i > 0 ? offsetClass : ''} ring-2 ring-bg-dark`}>
          <Avatar {...av} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={`relative ${offsetClass} ring-2 ring-bg-dark inline-flex items-center justify-center bg-surface-terminal border border-border-dark font-bold font-mono text-slate-400 ${COUNTER_SIZE[size]}`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};

export default memo(AvatarGroup);
