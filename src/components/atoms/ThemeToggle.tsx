import { memo, type ButtonHTMLAttributes } from 'react';
import { useTheme, type Theme } from '@/foundations/ThemeContext';

export type ThemeToggleSize    = 'sm' | 'md' | 'lg';
export type ThemeToggleVariant = 'icon' | 'button' | 'pill';

export interface ThemeToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  size?:    ThemeToggleSize;
  variant?: ThemeToggleVariant;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_ICON: Record<ThemeToggleSize, string> = {
  sm: 'text-[14px]',
  md: 'text-[18px]',
  lg: 'text-[22px]',
};

const SIZE_PAD: Record<ThemeToggleSize, string> = {
  sm: 'px-2 py-1',
  md: 'px-2.5 py-1.5',
  lg: 'px-3 py-2',
};

const SIZE_TEXT: Record<ThemeToggleSize, string> = {
  sm: 'text-[9px]',
  md: 'text-[10px]',
  lg: 'text-[11px]',
};

const THEME_META: Record<Theme, { icon: string; label: string; next: string }> = {
  dark:  { icon: 'light_mode',  label: 'Light',  next: 'Switch to light mode' },
  light: { icon: 'dark_mode',   label: 'Dark',   next: 'Switch to dark mode'  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const ThemeToggle = ({ size = 'md', variant = 'button', className = '', ...rest }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const meta = THEME_META[theme];

  if (variant === 'icon') {
    return (
      <button
        {...rest}
        onClick={toggleTheme}
        title={meta.next}
        aria-label={meta.next}
        className={[
          'flex items-center justify-center transition-colors',
          'text-slate-500 hover:text-primary',
          SIZE_PAD[size],
          className,
        ].filter(Boolean).join(' ')}
      >
        <span className={`material-symbols-outlined ${SIZE_ICON[size]}`}>{meta.icon}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        {...rest}
        onClick={toggleTheme}
        title={meta.next}
        aria-label={meta.next}
        className={[
          'inline-flex items-center gap-3 border border-border-dark transition-colors',
          'bg-surface-terminal hover:border-primary/50',
          SIZE_PAD[size],
          className,
        ].filter(Boolean).join(' ')}
      >
        {/* Track */}
        <span className="relative flex items-center w-8 h-4 bg-bg-dark border border-border-dark shrink-0">
          {/* Thumb */}
          <span className={[
            'absolute w-2.5 h-2.5 bg-primary transition-all duration-300',
            theme === 'dark' ? 'left-0.5' : 'left-[18px]',
          ].join(' ')} />
        </span>
        <span className={['font-mono font-bold uppercase tracking-widest text-slate-400', SIZE_TEXT[size]].join(' ')}>
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  // Default: 'button'
  return (
    <button
      {...rest}
      onClick={toggleTheme}
      title={meta.next}
      aria-label={meta.next}
      className={[
        'inline-flex items-center gap-1.5 border border-border-dark transition-colors',
        'text-slate-400 hover:border-primary/50 hover:text-primary',
        SIZE_PAD[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className={`material-symbols-outlined ${SIZE_ICON[size]}`}>{meta.icon}</span>
      <span className={['font-mono font-bold uppercase tracking-widest', SIZE_TEXT[size]].join(' ')}>
        {meta.label}
      </span>
    </button>
  );
};

export default memo(ThemeToggle);
