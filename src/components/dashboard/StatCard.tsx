import { memo } from 'react';

export interface StatCardProps {
  id: string;
  label: string;
  value: string;
  progress: number;
  segmented?: boolean;
}

const SEGMENTS = 5;

const StatCard = ({ id, label, value, progress, segmented }: StatCardProps) => {
  const filledCount = Math.round((progress / 100) * SEGMENTS);
  return (
    <article className="bg-surface-terminal border border-primary/10 p-6 relative group overflow-hidden hover:border-primary/40 transition-colors">
      <div className="absolute top-0 right-0 p-1 text-[10px] text-primary/30">{id}</div>
      <p className="text-primary/60 text-[10px] uppercase mb-1">{label}</p>
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

export default memo(StatCard);
