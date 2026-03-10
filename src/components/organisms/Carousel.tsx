import {
  memo, useState, useEffect, useCallback, useRef,
  Children, type ReactNode,
} from 'react';
import Button from '@/components/atoms/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselIndicator = 'dots' | 'bars' | 'numbers' | 'none';
export type CarouselTransition = 'slide' | 'fade';

export interface CarouselProps {
  children: ReactNode;
  /** Controlled active index */
  activeSlide?: number;
  onSlideChange?: (index: number) => void;
  autoPlay?: boolean;
  /** Auto-play interval in ms (default: 4000) */
  interval?: number;
  /** Wrap around at edges (default: true) */
  loop?: boolean;
  /** Transition style (default: 'slide') */
  transition?: CarouselTransition;
  /** Indicator style (default: 'dots') */
  indicators?: CarouselIndicator;
  showArrows?: boolean;
  /** Pause auto-play on hover (default: true) */
  pauseOnHover?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Carousel = ({
  children,
  activeSlide: controlledSlide,
  onSlideChange,
  autoPlay = false,
  interval = 4000,
  loop = true,
  transition = 'slide',
  indicators = 'dots',
  showArrows = true,
  pauseOnHover = true,
  className = '',
}: CarouselProps) => {
  const slides = Children.toArray(children);
  const count  = slides.length;

  const [internal, setInternal] = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [dir,      setDir]      = useState<1 | -1>(1); // for fade direction hint

  const isControlled = controlledSlide !== undefined;
  const active       = isControlled ? controlledSlide : internal;

  const goTo = useCallback((index: number) => {
    if (!isControlled) setInternal(index);
    onSlideChange?.(index);
  }, [isControlled, onSlideChange]);

  const goPrev = useCallback(() => {
    setDir(-1);
    goTo(loop ? (active - 1 + count) % count : Math.max(0, active - 1));
  }, [active, count, loop, goTo]);

  const goNext = useCallback(() => {
    setDir(1);
    goTo(loop ? (active + 1) % count : Math.min(count - 1, active + 1));
  }, [active, count, loop, goTo]);

  // Auto-play
  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const timer = setInterval(() => goNextRef.current(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, paused, count, interval]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  const atStart = !loop && active === 0;
  const atEnd   = !loop && active === count - 1;

  const arrowBtn = (onClick: () => void, disabled: boolean, icon: string, label: string) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      variant="ghost"
      size="sm"
      className={[
        'shrink-0 w-8 h-8 min-w-0 border border-slate-600 px-0 py-0',
        'bg-bg-dark/80 border border-slate-600',
        'text-slate-400 transition-all duration-200',
        'hover:border-primary/50 hover:text-primary',
        'opacity-0 group-hover/carousel:opacity-100',
        disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : '',
      ].filter(Boolean).join(' ')}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </Button>
  );

  return (
    <div
      className={['group/carousel select-none', className].join(' ')}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* ── Row: prev arrow + slides track + next arrow ── */}
      <div className="flex items-center gap-2">
        {/* ── Prev arrow ── */}
        {showArrows && count > 1 && arrowBtn(goPrev, atStart, 'chevron_left', 'Previous slide')}

        {/* ── Slides track ── */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          {transition === 'slide' ? (
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className="w-full shrink-0 min-w-0">
                  {slide}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={[
                    'transition-opacity duration-500',
                    i === active ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none',
                  ].join(' ')}
                >
                  {slide}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Next arrow ── */}
        {showArrows && count > 1 && arrowBtn(goNext, atEnd, 'chevron_right', 'Next slide')}
      </div>

      {/* ── Indicators ── */}
      {indicators !== 'none' && count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {indicators === 'numbers' ? (
            <span className="text-[10px] font-mono text-slate-400 tabular-nums tracking-widest">
              <span className="text-primary">{String(active + 1).padStart(2, '0')}</span>
              {' / '}
              {String(count).padStart(2, '0')}
            </span>
          ) : (
            slides.map((_, i) => (
              <Button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                variant="ghost"
                size="sm"
                className={[
                  'min-w-0 border-0 px-0 py-0',
                  'transition-all duration-300',
                  indicators === 'bars'
                    ? ['h-0.5', i === active ? 'w-6 bg-primary' : 'w-3 bg-border-dark hover:bg-slate-600'].join(' ')
                    : ['h-1.5', i === active ? 'w-4 bg-primary' : 'w-1.5 bg-border-dark hover:bg-slate-600'].join(' '),
                ].join(' ')}
              />
            ))
          )}
        </div>
      )}

      {/* ── Auto-play progress bar ── */}
      {autoPlay && !paused && (
        <div className="h-px bg-border-dark overflow-hidden pointer-events-none mt-1">
          <div
            key={`${active}-${dir}`}
            className="h-full bg-primary/50 origin-left"
            style={{ animation: `aegis-progress ${interval}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(Carousel);

// ─── CarouselSlide ─────────────────────────────────────────────────────────────

export interface CarouselSlideProps {
  children: ReactNode;
  className?: string;
}

/** Semantic wrapper for carousel slide content */
export const CarouselSlide = memo(({ children, className = '' }: CarouselSlideProps) => (
  <div className={['w-full', className].join(' ')}>
    {children}
  </div>
));
CarouselSlide.displayName = 'CarouselSlide';
