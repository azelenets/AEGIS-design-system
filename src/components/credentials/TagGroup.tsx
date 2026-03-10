import { memo, type HTMLAttributes } from 'react';

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  items: string[];
}

const TagGroup = ({ title, items, className = '', ...rest }: TagGroupProps) => (
  <div {...rest} className={['bg-white/5 border border-white/10 p-5', className].filter(Boolean).join(' ')}>
    <div className="text-[10px] text-primary/70 font-bold mb-4 uppercase">{title}</div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="bg-black border border-primary/20 text-[10px] px-2 py-1 text-white">
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default memo(TagGroup);
