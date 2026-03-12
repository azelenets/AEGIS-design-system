import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type AudioHTMLAttributes,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import Slider from '@/components/atoms/Slider';

export interface AudioPlayerSource {
  src: string;
  type?: string;
}

export interface AudioPlayerTrack {
  src: string;
  srcLang: string;
  label: string;
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;
}

export interface AudioPlayerProps extends Omit<AudioHTMLAttributes<HTMLAudioElement>, 'children'> {
  title?: string;
  description?: string;
  caption?: ReactNode;
  artwork?: ReactNode;
  sources?: AudioPlayerSource[];
  tracks?: AudioPlayerTrack[];
  children?: ReactNode;
  nativeControls?: boolean;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const AudioPlayer = ({
  title,
  description,
  caption,
  artwork,
  sources,
  tracks,
  src,
  className = '',
  controls = true,
  preload = 'metadata',
  children,
  nativeControls = false,
  autoPlay,
  muted,
  loop,
  onPlay,
  onPause,
  onVolumeChange,
  onTimeUpdate,
  onLoadedMetadata,
  ...rest
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const volumePopoverId = useId();
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
  const [isMuted, setIsMuted] = useState(Boolean(muted));
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const useStyledControls = controls && !nativeControls;

  useEffect(() => {
    if (!isVolumeOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (volumeControlRef.current?.contains(event.target as Node)) return;
      setIsVolumeOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVolumeOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVolumeOpen]);

  const handleTogglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.ended) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  }, []);

  const handleSeek = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const handleVolume = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextVolume = Number(event.target.value);
    audio.volume = nextVolume;
    audio.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(audio.muted);
  }, []);

  const handleToggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.muted || audio.volume === 0) {
      const restoredVolume = volume > 0 ? volume : 1;
      audio.muted = false;
      audio.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
      return;
    }

    audio.muted = true;
    setIsMuted(true);
  }, [volume]);

  return (
    <figure className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <div className="border border-border-dark bg-panel-dark">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          {...rest}
          ref={audioRef}
          src={src}
          controls={nativeControls ? controls : false}
          preload={preload}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onPlay={(event) => {
            setIsPlaying(true);
            onPlay?.(event);
          }}
          onPause={(event) => {
            setIsPlaying(false);
            onPause?.(event);
          }}
          onVolumeChange={(event) => {
            const audio = event.currentTarget;
            setIsMuted(audio.muted);
            setVolume(audio.muted ? 0 : audio.volume);
            onVolumeChange?.(event);
          }}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime || 0);
            onTimeUpdate?.(event);
          }}
          onLoadedMetadata={(event) => {
            const audio = event.currentTarget;
            setDuration(audio.duration || 0);
            setCurrentTime(audio.currentTime || 0);
            setIsMuted(audio.muted);
            setVolume(audio.muted ? 0 : audio.volume);
            onLoadedMetadata?.(event);
          }}
          className={nativeControls ? 'w-full' : 'hidden'}
        >
          {sources?.map((source) => (
            <source key={`${source.src}-${source.type ?? 'default'}`} src={source.src} type={source.type} />
          ))}
          {tracks?.map((track) => (
            <track
              key={`${track.src}-${track.srcLang}`}
              src={track.src}
              srcLang={track.srcLang}
              label={track.label}
              kind={track.kind ?? 'metadata'}
              default={track.default}
            />
          ))}
          {children}
          Your browser does not support the audio tag.
        </audio>

        {useStyledControls ? (
          <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,rgba(var(--color-bg-dark),0.96),rgba(var(--color-panel-dark),0.94))] p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-primary/15 bg-bg-dark text-primary">
                {artwork ?? <MaterialIcon name="play_arrow" className="text-[28px]" />}
              </div>
              <div className="min-w-0 flex-1">
                {title ? (
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">{title}</p>
                ) : null}
                {description ? (
                  <p className="mt-1 text-[11px] font-mono leading-relaxed text-slate-400">{description}</p>
                ) : null}
                {caption ? (
                  <div className="mt-2 text-[10px] font-mono text-slate-500">{caption}</div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
                variant="ghost"
                size="sm"
                onClick={handleTogglePlayback}
                className="min-w-0 border-border-dark bg-panel-dark/70 px-2 py-1 text-slate-300 hover:text-primary"
              >
                <MaterialIcon name={isPlaying ? 'pause_circle' : 'play_arrow'} className="text-[18px]" />
              </Button>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="w-[44px] shrink-0 text-[10px] font-mono tabular-nums text-slate-400">
                  {formatTime(currentTime)}
                </span>
                <input
                  aria-label="Seek audio"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  style={{
                    background: `linear-gradient(to right, rgb(var(--color-primary)) ${progress}%, rgb(var(--color-surface-terminal)) ${progress}%)`,
                  }}
                  className={[
                    'h-1.5 w-full cursor-pointer appearance-none',
                    '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent',
                    '[&::-webkit-slider-thumb]:-mt-[3px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary',
                    '[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary',
                  ].join(' ')}
                />
                <span className="w-[44px] shrink-0 text-right text-[10px] font-mono tabular-nums text-slate-400">
                  {formatTime(duration)}
                </span>
              </div>

              <div ref={volumeControlRef} className="relative z-10 flex items-center">
                {isVolumeOpen ? (
                  <div
                    id={volumePopoverId}
                    role="dialog"
                    aria-label="Volume controls"
                    className="absolute bottom-full right-0 z-20 mb-2 flex w-full min-w-full justify-center border border-border-dark bg-bg-dark/95 px-1 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Slider
                        aria-label="Audio volume"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        orientation="vertical"
                        showValue={false}
                        className="shrink-0"
                      />
                      <Button
                        aria-label={isMuted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleMute}
                        className="w-full min-w-0 justify-center border-border-dark bg-panel-dark/70 px-2 py-1 text-slate-300 hover:text-primary"
                      >
                        <MaterialIcon
                          name={isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                          className="text-[18px]"
                        />
                      </Button>
                    </div>
                  </div>
                ) : null}

                <Button
                  aria-label="Open volume controls"
                  aria-expanded={isVolumeOpen}
                  aria-haspopup="dialog"
                  aria-controls={volumePopoverId}
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVolumeOpen((open) => !open)}
                  className="min-w-0 border-border-dark bg-panel-dark/70 px-2 py-1 text-slate-300 hover:text-primary"
                >
                  <MaterialIcon
                    name={isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                    className="text-[18px]"
                  />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </figure>
  );
};

const MemoAudioPlayer = memo(AudioPlayer);
MemoAudioPlayer.displayName = 'AudioPlayer';

export default MemoAudioPlayer;
