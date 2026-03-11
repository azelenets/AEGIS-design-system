import { memo, type ButtonHTMLAttributes } from 'react';

export interface FilterButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  active?: boolean;
  label: string;
  onClick?: () => void;
}

const FilterButton = ({ active, label, onClick, className = '', ...rest }: FilterButtonProps) => (
  <button
    type="button"
    {...rest}
    onClick={onClick}
    className={[
      'shrink-0 px-4 py-1 text-[10px] font-bold uppercase transition-all',
      active ? 'bg-primary text-black' : 'border border-primary/30 text-primary/70 hover:bg-primary/10',
      className,
    ].filter(Boolean).join(' ')}
  >
    {label}
  </button>
);

const MemoFilterButton = memo(FilterButton);
MemoFilterButton.displayName = 'FilterButton';

export default MemoFilterButton;
