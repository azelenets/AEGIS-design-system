import { memo, type HTMLAttributes } from 'react';

export interface SpecCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle: string;
  img: string;
}

const SpecCard = ({ title, subtitle, img, className = '', ...rest }: SpecCardProps) => (
  <figure {...rest} className={['group relative overflow-hidden bg-surface-terminal border border-primary/10 aspect-video grayscale hover:grayscale-0 transition-all cursor-pointer', className].filter(Boolean).join(' ')}>
    <div className="absolute inset-0 bg-primary/20 z-10 opacity-40 group-hover:opacity-10 transition-opacity" />
    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${img}')` }} />
    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent z-20" />
    <figcaption className="absolute bottom-4 left-4 z-30">
      <h4 className="text-white font-bold uppercase text-sm tracking-tighter">{title}</h4>
      <p className="text-[9px] text-primary font-mono">{subtitle}</p>
    </figcaption>
  </figure>
);

const MemoSpecCard = memo(SpecCard);
MemoSpecCard.displayName = 'SpecCard';

export default MemoSpecCard;
