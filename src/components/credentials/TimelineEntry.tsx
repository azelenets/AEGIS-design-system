import { memo, type HTMLAttributes } from 'react';
import MaterialIcon from '@/components/atoms/MaterialIcon';

export interface TimelineField {
  label: string;
  value: string;
}

export interface TimelineEntryProps extends HTMLAttributes<HTMLElement> {
  level: string;
  title: string;
  organization: string;
  period: string;
  distinguished?: boolean;
  fields: TimelineField[];
}

const TimelineEntry = ({ level, title, organization, period, distinguished, fields, className = '', ...rest }: TimelineEntryProps) => (
  <article {...rest} className={['relative pl-6 border-l border-primary/30', className].filter(Boolean).join(' ')}>
    <div className="absolute -left-[5px] top-0 size-2 bg-primary" />
    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">
          Authorization_Level: {level}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {distinguished ? (
            <span className="inline-flex items-center gap-1 border border-yellow-400/60 bg-yellow-400/10 text-yellow-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
              <MaterialIcon name="military_tech" className="text-[10px]" />
              Distinguished
            </span>
          ) : null}
        </div>
        <div className="text-sm text-slate-400">{organization}</div>
      </div>
      <span className="text-xs font-bold text-slate-400">{period}</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {fields.map(({ label, value }) => (
        <div key={label} className="bg-black/40 border border-white/5 p-3">
          <div className="text-[9px] text-primary uppercase mb-1">{label}</div>
          <div className="text-xs text-slate-400">{value}</div>
        </div>
      ))}
    </div>
  </article>
);

const MemoTimelineEntry = memo(TimelineEntry);
MemoTimelineEntry.displayName = 'TimelineEntry';

export default MemoTimelineEntry;
