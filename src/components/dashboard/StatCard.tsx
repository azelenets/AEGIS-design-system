import { memo, type HTMLAttributes } from 'react';

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  id: string;
  label: string;
  value: string;
  progress: number;
  segmented?: boolean;
}

const SEGMENTS = 5;

const StatCard = ({ id, label, value, progress, segmented, className = '', ...rest }: StatCardProps) => {
  const filledCount = Math.round((progress / 100) * SEGMENTS);
  return (
    <article {...rest} className={['bg-surface-terminal border border-primary/10 p-6 relative group overflow-hidden hover:border-primary/40 transition-colors', className].filter(Boolean).join(' ')}>
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="20"><text fill="#00f3ff" fill-opacity="0.3" font-size="10" font-family="monospace" x="4" y="14">${id}</text></svg>`)}")`,
          width: '60px',
          height: '20px',
        }}
      />
      <p className="text-primary text-[10px] uppercase mb-1">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
      <div className="h-1 w-full mt-4 flex gap-1">
        {segmented ? (
          Array.from({ length: SEGMENTS }, (_, i) => (
            <div key={i} className={`h-full flex-1 ${i < filledCount ? 'bg-primary' : 'bg-primary/20'}`} />
          ))
        ) : (
          <div className="h-full w-full bg-primary/10 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </article>
  );
};

const MemoStatCard = memo(StatCard);
MemoStatCard.displayName = 'StatCard';

export default MemoStatCard;
