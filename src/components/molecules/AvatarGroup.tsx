import { memo, type HTMLAttributes } from 'react';
import Avatar, { type AvatarProps } from '@/components/atoms/Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  avatars: Omit<AvatarProps, 'size'>[];
  max?: number;
  size?: AvatarProps['size'];
}

const COUNTER_SIZE: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-7 h-7 text-[9px]',
  md: 'w-9 h-9 text-[10px]',
  lg: 'w-12 h-12 text-xs',
  xl: 'w-16 h-16 text-sm',
};

const AvatarGroup = ({ avatars, max = 5, size = 'md', className = '', ...rest }: AvatarGroupProps) => {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div {...rest} className={['flex items-center gap-1', className].filter(Boolean).join(' ')}>
      {visible.map((av, i) => (
        <Avatar key={i} {...av} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className={`inline-flex items-center justify-center bg-surface-terminal border border-slate-600 font-bold font-mono text-slate-400 ${COUNTER_SIZE[size]}`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};

export default memo(AvatarGroup);
