import {
  memo, useState, useEffect, useCallback, useRef, useMemo,
  Children, type ReactNode, type HTMLAttributes,
} from 'react';
import Button from '@/components/atoms/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselIndicator = 'dots' | 'bars' | 'numbers' | 'none';
export type CarouselTransition = 'slide' | 'fade';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
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
  ...rest
}: CarouselProps) => {
  const slides = useMemo(() => Children.toArray(children), [children]);
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

  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const timer = setInterval(() => goNextRef.current(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, paused, count, interval]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
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
      {...rest}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={['group/carousel select-none', className].filter(Boolean).join(' ')}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* ── Slides track with edge-mounted arrows ── */}
      <div className="relative">
        {/* ── Slides track ── */}
        <div className="overflow-hidden relative min-w-0">
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

        {/* ── Prev arrow — half outside left edge ── */}
        {showArrows && count > 1 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
            {arrowBtn(goPrev, atStart, 'chevron_left', 'Previous slide')}
          </div>
        )}

        {/* ── Next arrow — half outside right edge ── */}
        {showArrows && count > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
            {arrowBtn(goNext, atEnd, 'chevron_right', 'Next slide')}
          </div>
        )}
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

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Semantic wrapper for carousel slide content */
export const CarouselSlide = memo(({ children, className = '', ...rest }: CarouselSlideProps) => (
  <div {...rest} className={['w-full', className].filter(Boolean).join(' ')}>
    {children}
  </div>
));
CarouselSlide.displayName = 'CarouselSlide';
