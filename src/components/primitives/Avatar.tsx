import { memo } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'primary' | 'hazard' | 'alert' | 'ghost';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  icon?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  status?: 'online' | 'offline' | 'busy';
}

const SIZE_CLASSES: Record<AvatarSize, { container: string; text: string; icon: string; status: string }> = {
  sm: { container: 'w-7 h-7', text: 'text-[9px]', icon: 'text-[16px]', status: 'w-2 h-2 -bottom-0.5 -right-0.5' },
  md: { container: 'w-9 h-9', text: 'text-[11px]', icon: 'text-[20px]', status: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' },
  lg: { container: 'w-12 h-12', text: 'text-sm', icon: 'text-[24px]', status: 'w-3 h-3 bottom-0 right-0' },
  xl: { container: 'w-16 h-16', text: 'text-base', icon: 'text-[32px]', status: 'w-3.5 h-3.5 bottom-0.5 right-0.5' },
};

const VARIANT_CLASSES: Record<AvatarVariant, string> = {
  primary: 'border-primary/40 bg-primary/10 text-primary',
  hazard: 'border-hazard/40 bg-hazard/10 text-hazard',
  alert: 'border-alert/40 bg-alert/10 text-alert',
  ghost: 'border-border-dark bg-surface-terminal text-slate-400',
};

const STATUS_CLASSES: Record<'online' | 'offline' | 'busy', string> = {
  online: 'bg-emerald-400',
  offline: 'bg-slate-600',
  busy: 'bg-hazard',
};

const Avatar = ({
  src,
  alt = '',
  initials,
  icon,
  size = 'md',
  variant = 'primary',
  status,
}: AvatarProps) => {
  const sizes = SIZE_CLASSES[size];

  return (
    <span className={`relative inline-flex shrink-0 ${sizes.container}`}>
      <span
        className={`flex items-center justify-center w-full h-full border font-bold font-mono overflow-hidden ${VARIANT_CLASSES[variant]}`}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : icon ? (
          <span className={`material-symbols-outlined ${sizes.icon}`}>{icon}</span>
        ) : initials ? (
          <span className={sizes.text}>{initials.slice(0, 2).toUpperCase()}</span>
        ) : (
          <span className={`material-symbols-outlined ${sizes.icon}`}>person</span>
        )}
      </span>
      {status && (
        <span
          className={`absolute rounded-full border border-bg-dark ${STATUS_CLASSES[status]} ${sizes.status}`}
        />
      )}
    </span>
  );
};

export default memo(Avatar);
