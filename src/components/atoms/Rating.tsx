import { memo, useState, type HTMLAttributes } from 'react';

export type RatingVariant = 'primary' | 'hazard';

export interface RatingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  value?: number;          // controlled
  defaultValue?: number;   // uncontrolled
  max?: number;
  variant?: RatingVariant;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  label?: string;
}

const COLOR: Record<RatingVariant, { filled: string; empty: string }> = {
  primary: { filled: 'text-primary',    empty: 'text-primary/20' },
  hazard:  { filled: 'text-hazard',     empty: 'text-hazard/20' },
};

const Rating = ({
  value,
  defaultValue = 0,
  max = 5,
  variant = 'hazard',
  readOnly = false,
  onChange,
  label,
  className = '',
  ...rest
}: RatingProps) => {
  const [hovered, setHovered] = useState(0);
  const [internal, setInternal] = useState(defaultValue);

  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const display = readOnly ? current : (hovered || current);
  const c = COLOR[variant];

  const handleClick = (i: number) => {
    if (readOnly) return;
    if (!controlled) setInternal(i);
    onChange?.(i);
  };

  return (
    <span {...rest} className={['inline-flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">{label}</span>
      )}
      <span
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => !readOnly && setHovered(0)}
        role={readOnly ? undefined : 'radiogroup'}
        aria-label={label}
      >
        {Array.from({ length: max }, (_, i) => {
          const star = i + 1;
          const filled = star <= display;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              role={readOnly ? undefined : 'radio'}
              aria-checked={readOnly ? undefined : star === current}
              aria-label={`${star} of ${max}`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readOnly && setHovered(star)}
              className={[
                'material-symbols-outlined text-[20px] transition-colors',
                filled ? c.filled : c.empty,
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform',
              ].join(' ')}
              style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </button>
          );
        })}
      </span>
    </span>
  );
};

const MemoRating = memo(Rating);
MemoRating.displayName = 'Rating';

export default MemoRating;
