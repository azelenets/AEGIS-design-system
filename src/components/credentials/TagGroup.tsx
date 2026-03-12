import { memo, type HTMLAttributes } from 'react';

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  items: string[];
}

const TagGroup = ({ title, items, className = '', ...rest }: TagGroupProps) => (
  <section {...rest} className={['bg-white/5 border border-white/10 p-5', className].filter(Boolean).join(' ')}>
    <h3 className="text-[10px] text-primary font-bold mb-4 uppercase">{title}</h3>
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="list-none bg-black border border-primary/20 text-[10px] px-2 py-1 text-white">
          {item}
        </li>
      ))}
    </ul>
  </section>
);

const MemoTagGroup = memo(TagGroup);
MemoTagGroup.displayName = 'TagGroup';

export default MemoTagGroup;
