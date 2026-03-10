import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import Carousel, { CarouselSlide } from './Carousel';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const meta: Meta<typeof Carousel> = {
  title: 'Organisms/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
};
export default meta;

// ─── Shared slide content ─────────────────────────────────────────────────────

const slides = [
  { id: 'alpha',   label: 'Alpha Sector',   eyebrow: 'SECTOR-01', status: 'active',  threat: 'LOW',    color: 'text-primary',  bg: 'bg-primary/5',  border: 'border-primary/20' },
  { id: 'bravo',   label: 'Bravo Sector',   eyebrow: 'SECTOR-02', status: 'standby', threat: 'MED',    color: 'text-hazard',   bg: 'bg-hazard/5',   border: 'border-hazard/20' },
  { id: 'charlie', label: 'Charlie Sector', eyebrow: 'SECTOR-03', status: 'alert',   threat: 'HIGH',   color: 'text-alert',    bg: 'bg-alert/5',    border: 'border-alert/20' },
  { id: 'delta',   label: 'Delta Sector',   eyebrow: 'SECTOR-04', status: 'offline', threat: 'NONE',   color: 'text-slate-400',bg: 'bg-surface-terminal', border: 'border-border-dark' },
];

const TacticalSlide = ({ s }: { s: typeof slides[0] }) => (
  <div className={`${s.bg} border ${s.border} p-8 flex flex-col gap-4`}>
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{s.eyebrow}</span>
      <Badge
        label={s.status.toUpperCase()}
        variant={s.status === 'active' ? 'primary' : s.status === 'standby' ? 'hazard' : s.status === 'alert' ? 'alert' : 'ghost'}
        dot
      />
    </div>
    <h2 className={`font-display text-2xl font-bold tracking-widest uppercase ${s.color}`}>{s.label}</h2>
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Threat Level</span>
      <span className={`text-[11px] font-bold font-mono ${s.color}`}>{s.threat}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 mt-2">
      {['PERIMETER', 'INTEL', 'COMMS'].map(label => (
        <div key={label} className="bg-bg-dark border border-border-dark p-2 text-center">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{label}</p>
          <p className={`text-[11px] font-bold font-mono mt-1 ${s.color}`}>NOMINAL</p>
        </div>
      ))}
    </div>
  </div>
);

const ImageLikeSlide = ({ label, index }: { label: string; index: number }) => (
  <div className="relative bg-surface-terminal border border-border-dark overflow-hidden h-48 flex items-center justify-center">
    {/* Simulated image / media placeholder */}
    <div className="absolute inset-0 cyber-grid opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
    <div className="relative flex flex-col items-center gap-2">
      <span className="font-display text-4xl font-bold text-primary/20 tracking-widest">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    {/* Corner accent */}
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/40" />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/40" />
  </div>
);

const ControlledCarouselStory = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <div className="flex items-center gap-2">
        {slides.map((slide, index) => (
          <Button
            key={slide.id}
            variant={active === index ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActive(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <Carousel activeSlide={active} onSlideChange={setActive} indicators="numbers">
        {slides.map((slide) => (
          <TacticalSlide key={slide.id} s={slide} />
        ))}
      </Carousel>
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default = {
  render: () => (
    <div className="max-w-lg">
      <Carousel>
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const WithBarsIndicator = {
  render: () => (
    <div className="max-w-lg">
      <Carousel indicators="bars">
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const WithNumbersIndicator = {
  render: () => (
    <div className="max-w-lg">
      <Carousel indicators="numbers">
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const FadeTransition = {
  render: () => (
    <div className="max-w-lg">
      <Carousel transition="fade" indicators="bars">
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const AutoPlay = {
  render: () => (
    <div className="max-w-lg">
      <Carousel autoPlay interval={3000} indicators="bars">
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const NoLoop = {
  render: () => (
    <div className="max-w-lg">
      <Carousel loop={false} indicators="numbers">
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const MediaGallery = {
  render: () => (
    <div className="max-w-xl">
      <Carousel indicators="bars" transition="fade">
        {['Alpha Grid', 'Bravo Node', 'Charlie Hub', 'Delta Relay', 'Echo Station'].map((label, i) => (
          <ImageLikeSlide key={label} label={label} index={i} />
        ))}
      </Carousel>
    </div>
  ),
};

export const Controlled = {
  render: () => <ControlledCarouselStory />,
};

export const NoArrows = {
  render: () => (
    <div className="max-w-lg">
      <Carousel showArrows={false} indicators="dots" autoPlay interval={2500}>
        {slides.map(s => <TacticalSlide key={s.id} s={s} />)}
      </Carousel>
    </div>
  ),
};

export const WithCarouselSlide = {
  render: () => (
    <div className="max-w-lg">
      <Carousel indicators="bars">
        <CarouselSlide>
          <div className="bg-surface-terminal border border-primary/20 p-8 text-center">
            <p className="font-display text-xl text-primary tracking-widest uppercase">Mission Alpha</p>
            <p className="text-xs font-mono text-slate-400 mt-2">Primary objective: secure the perimeter.</p>
          </div>
        </CarouselSlide>
        <CarouselSlide>
          <div className="bg-surface-terminal border border-hazard/20 p-8 text-center">
            <p className="font-display text-xl text-hazard tracking-widest uppercase">Mission Bravo</p>
            <p className="text-xs font-mono text-slate-400 mt-2">Secondary objective: extract the asset.</p>
          </div>
        </CarouselSlide>
        <CarouselSlide>
          <div className="bg-surface-terminal border border-alert/20 p-8 text-center">
            <p className="font-display text-xl text-alert tracking-widest uppercase">Mission Charlie</p>
            <p className="text-xs font-mono text-slate-400 mt-2">Tertiary objective: neutralise the threat.</p>
          </div>
        </CarouselSlide>
      </Carousel>
    </div>
  ),
};
