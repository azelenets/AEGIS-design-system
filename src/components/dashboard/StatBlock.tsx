import { memo, type HTMLAttributes } from 'react';

export interface StatBlockProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  barColor: string;
  width: string;
}

const StatBlock = ({ label, value, barColor, width, className = '', ...rest }: StatBlockProps) => (
  <div {...rest} className={['space-y-1', className].filter(Boolean).join(' ')}>
    <div className="text-[10px] text-primary font-bold tracking-widest uppercase">{label}</div>
    <div className="text-3xl font-display font-black text-white">{value}</div>
    <div className="h-1 bg-white/5 w-full mt-2">
      <div className={`h-full ${barColor}`} style={{ width }} />
    </div>
  </div>
);

const MemoStatBlock = memo(StatBlock);
MemoStatBlock.displayName = 'StatBlock';

export default MemoStatBlock;
