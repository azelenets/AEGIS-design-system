import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type VideoHTMLAttributes,
} from 'react';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';
import Slider from '@/components/atoms/Slider';

export type VideoPlayerAspectRatio = '16 / 9' | '4 / 3' | '1 / 1' | '21 / 9';
export type VideoPlayerFit = 'contain' | 'cover';

export interface VideoPlayerSource {
  src: string;
  type?: string;
}

export interface VideoPlayerTrack {
  src: string;
  srcLang: string;
  label: string;
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;
}

export interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'children'> {
  title?: string;
  description?: string;
  sources?: VideoPlayerSource[];
  tracks?: VideoPlayerTrack[];
  aspectRatio?: VideoPlayerAspectRatio;
  fit?: VideoPlayerFit;
  caption?: ReactNode;
  children?: ReactNode;
  nativeControls?: boolean;
}

const FIT_CLASS: Record<VideoPlayerFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const INTERACTIVE_CURSOR = 'cursor-pointer';

const VideoPlayer = ({
  title,
  description,
  sources,
  tracks,
  aspectRatio = '16 / 9',
  fit = 'cover',
  caption,
  src,
  className = '',
  controls = true,
  preload = 'metadata',
  children,
  nativeControls = false,
  autoPlay,
  muted,
  loop,
  poster,
  playsInline,
  onPlay,
  onPause,
  onVolumeChange,
  onTimeUpdate,
  onLoadedMetadata,
  ...rest
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const volumePopoverId = useId();
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
  const [isMuted, setIsMuted] = useState(Boolean(muted));
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const useStyledControls = controls && !nativeControls;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === videoRef.current?.parentElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  }, []);

  const handleSeek = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const handleVolume = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const nextVolume = Number(event.target.value);
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(video.muted);
  }, []);

  const handleToggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      const restoredVolume = volume > 0 ? volume : 1;
      video.muted = false;
      video.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
      return;
    }

    video.muted = true;
    setIsMuted(true);
  }, [volume]);

  const handleToggleFullscreen = useCallback(async () => {
    const frame = videoRef.current?.parentElement;
    if (!frame) return;

    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
      return;
    }

    if (frame.requestFullscreen) {
      await frame.requestFullscreen();
    }
  }, []);

  return (
    <figure className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <div
        className="relative overflow-hidden border border-border-dark bg-panel-dark"
        style={{ aspectRatio }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          {...rest}
          ref={videoRef}
          src={src}
          controls={nativeControls ? controls : false}
          preload={preload}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          poster={poster}
          playsInline={playsInline}
          className={['h-full w-full bg-black', FIT_CLASS[fit], useStyledControls ? INTERACTIVE_CURSOR : 'cursor-default'].join(' ')}
          onClick={(event) => {
            if (useStyledControls) {
              void handleTogglePlayback();
            }
            rest.onClick?.(event);
          }}
          onPlay={(event) => {
            setIsPlaying(true);
            onPlay?.(event);
          }}
          onPause={(event) => {
            setIsPlaying(false);
            onPause?.(event);
          }}
          onVolumeChange={(event) => {
            const video = event.currentTarget;
            setIsMuted(video.muted);
            setVolume(video.muted ? 0 : video.volume);
            onVolumeChange?.(event);
          }}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime || 0);
            onTimeUpdate?.(event);
          }}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            setDuration(video.duration || 0);
            setCurrentTime(video.currentTime || 0);
            setIsMuted(video.muted);
            setVolume(video.muted ? 0 : video.volume);
            onLoadedMetadata?.(event);
          }}
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
              kind={track.kind ?? 'subtitles'}
              default={track.default}
            />
          ))}
          {children}
          Your browser does not support the video tag.
        </video>

        {useStyledControls && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/10 to-transparent opacity-80" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 border-t border-primary/10 bg-bg-dark/85 px-4 py-3 backdrop-blur-sm">
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
                    aria-label="Seek video"
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

                <div ref={volumeControlRef} className="relative flex items-center">
                  {isVolumeOpen ? (
                    <div
                      id={volumePopoverId}
                      role="dialog"
                      aria-label="Volume controls"
                      className="absolute bottom-full right-0 mb-2 flex w-16 justify-center border border-border-dark bg-bg-dark/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Slider
                          aria-label="Video volume"
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
                          aria-label={isMuted || volume === 0 ? 'Unmute video' : 'Mute video'}
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

                <Button
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFullscreen}
                  className="min-w-0 border-border-dark bg-panel-dark/70 px-2 py-1 text-slate-300 hover:text-primary"
                >
                  <MaterialIcon name={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} className="text-[18px]" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {(title || description || caption) && (
        <figcaption className="flex flex-col gap-1">
          {title && (
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-primary">
              {title}
            </span>
          )}
          {description && (
            <span className="text-[11px] font-mono text-slate-400 leading-relaxed">
              {description}
            </span>
          )}
          {caption && (
            <div className="text-[10px] font-mono text-slate-500">
              {caption}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
};

const MemoVideoPlayer = memo(VideoPlayer);
MemoVideoPlayer.displayName = 'VideoPlayer';

export default MemoVideoPlayer;
