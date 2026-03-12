import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import VideoPlayer from './VideoPlayer';

const SAMPLE_MP4 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const SAMPLE_WEBM = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Molecules/VideoPlayer',
  component: VideoPlayer,
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

type MockMediaState = {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  ended: boolean;
};

const installVideoMock = (video: HTMLVideoElement, overrides?: Partial<MockMediaState>) => {
  const state: MockMediaState = {
    paused: true,
    currentTime: 0,
    duration: 245,
    volume: 1,
    muted: false,
    ended: false,
    ...overrides,
  };

  Object.defineProperties(video, {
    paused: {
      get: () => state.paused,
      configurable: true,
    },
    currentTime: {
      get: () => state.currentTime,
      set: (value: number) => { state.currentTime = value; },
      configurable: true,
    },
    duration: {
      get: () => state.duration,
      set: (value: number) => { state.duration = value; },
      configurable: true,
    },
    volume: {
      get: () => state.volume,
      set: (value: number) => { state.volume = value; },
      configurable: true,
    },
    muted: {
      get: () => state.muted,
      set: (value: boolean) => { state.muted = value; },
      configurable: true,
    },
    ended: {
      get: () => state.ended,
      set: (value: boolean) => { state.ended = value; },
      configurable: true,
    },
    play: {
      value: fn(async () => {
        state.paused = false;
        state.ended = false;
        fireEvent(video, new Event('play', { bubbles: true }));
      }),
      configurable: true,
    },
    pause: {
      value: fn(() => {
        state.paused = true;
        fireEvent(video, new Event('pause', { bubbles: true }));
      }),
      configurable: true,
    },
  });

  return state;
};

const dispatchLoadedMetadata = (video: HTMLVideoElement, duration = 245) => {
  Object.defineProperty(video, 'duration', {
    configurable: true,
    get: () => duration,
  });
  fireEvent(video, new Event('loadedmetadata', { bubbles: true }));
};

const dispatchTimeUpdate = (video: HTMLVideoElement, currentTime: number) => {
  video.currentTime = currentTime;
  fireEvent(video, new Event('timeupdate', { bubbles: true }));
};

const installFullscreenMock = (target: HTMLElement) => {
  let fullscreenElement: Element | null = null;

  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => fullscreenElement,
  });

  Object.defineProperty(target, 'requestFullscreen', {
    configurable: true,
    value: fn(async () => {
      fullscreenElement = target;
      fireEvent(document, new Event('fullscreenchange'));
    }),
  });

  Object.defineProperty(document, 'exitFullscreen', {
    configurable: true,
    value: fn(async () => {
      fullscreenElement = null;
      fireEvent(document, new Event('fullscreenchange'));
    }),
  });
};

const MatrixRow = ({
  prop,
  type,
  defaultValue,
  notes,
}: {
  prop: string;
  type: string;
  defaultValue: string;
  notes: string;
}) => (
  <tr className="border-t border-border-dark">
    <td className="px-3 py-2 text-[10px] font-mono text-primary align-top">{prop}</td>
    <td className="px-3 py-2 text-[10px] font-mono text-slate-300 align-top">{type}</td>
    <td className="px-3 py-2 text-[10px] font-mono text-slate-400 align-top">{defaultValue}</td>
    <td className="px-3 py-2 text-[10px] font-mono text-slate-400 align-top">{notes}</td>
  </tr>
);

export const Overview = {
  render: () => (
    <div className="flex flex-col gap-6">
      <section className="border border-border-dark bg-panel-dark p-5">
        <div className="mb-4 space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Video Player</p>
          <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-white">API + Behavior Matrix</h2>
          <p className="max-w-2xl text-[11px] font-mono leading-relaxed text-slate-400">
            HTML5 video wrapper with styled transport controls by default, native controls as an opt-in fallback,
            support for multiple sources and caption tracks, and layout options for ratio and fit.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <VideoPlayer
            title="Operational Feed"
            description="Default styled transport with poster, time scrubber, popover volume control, and fullscreen."
            src={SAMPLE_MP4}
            poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
            caption="Recommended for product surfaces where controls should match the AEGIS visual system."
          />

          <div className="space-y-4">
            <div className="border border-border-dark bg-bg-dark p-4">
              <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Recommended Usage</p>
              <pre className="overflow-x-auto text-[10px] font-mono leading-relaxed text-slate-300">
{`<VideoPlayer
  title="Operational Feed"
  description="Recon footage"
  src="https://…/video.mp4"
  poster="https://…/poster.jpg"
  tracks={[
    { src: '/captions/en.vtt', srcLang: 'en', label: 'English', kind: 'captions', default: true }
  ]}
/>`}
              </pre>
            </div>

            <div className="border border-border-dark bg-bg-dark p-4">
              <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Behavior Modes</p>
              <ul className="space-y-2 text-[10px] font-mono text-slate-400">
                <li className="list-none"><span className="text-slate-200">Styled controls:</span> default transport bar and center play overlay.</li>
                <li className="list-none"><span className="text-slate-200">Native controls:</span> set `nativeControls` to defer to the browser UI.</li>
                <li className="list-none"><span className="text-slate-200">Media sources:</span> use `src` for a single source or `sources` for multiple encodings.</li>
                <li className="list-none"><span className="text-slate-200">Tracks:</span> pass caption or subtitle <code>tracks</code> to render <code>{'<track>'}</code> elements.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <VideoPlayer
          title="Styled Controls"
          description="Default experience."
          src={SAMPLE_MP4}
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
        />
        <VideoPlayer
          title="Native Controls"
          description="Browser transport fallback."
          src={SAMPLE_MP4}
          nativeControls
        />
        <VideoPlayer
          title="Square Archive"
          description="Alternate ratio and framing."
          src={SAMPLE_MP4}
          aspectRatio="1 / 1"
          fit="contain"
          muted
        />
      </section>

      <section className="overflow-hidden border border-border-dark bg-panel-dark">
        <div className="border-b border-border-dark px-4 py-3">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Props Matrix</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-bg-dark">
              <tr>
                <th className="px-3 py-2 text-left text-[9px] font-mono uppercase tracking-widest text-slate-400">Prop</th>
                <th className="px-3 py-2 text-left text-[9px] font-mono uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-3 py-2 text-left text-[9px] font-mono uppercase tracking-widest text-slate-400">Default</th>
                <th className="px-3 py-2 text-left text-[9px] font-mono uppercase tracking-widest text-slate-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              <MatrixRow prop="src" type="string" defaultValue="-" notes="Primary media source for simple use." />
              <MatrixRow prop="sources" type="VideoPlayerSource[]" defaultValue="-" notes="Multiple source tags for codec/browser fallback." />
              <MatrixRow prop="tracks" type="VideoPlayerTrack[]" defaultValue="-" notes="Captions, subtitles, chapters, or metadata tracks." />
              <MatrixRow prop="nativeControls" type="boolean" defaultValue="false" notes="Use browser controls instead of the styled transport." />
              <MatrixRow prop="controls" type="boolean" defaultValue="true" notes="Disables all transport controls when false." />
              <MatrixRow prop="aspectRatio" type="'16 / 9' | '4 / 3' | '1 / 1' | '21 / 9'" defaultValue="'16 / 9'" notes="Frame ratio for the media viewport." />
              <MatrixRow prop="fit" type="'cover' | 'contain'" defaultValue="'cover'" notes="Maps to the video object-fit mode." />
              <MatrixRow prop="title / description / caption" type="ReactNode-compatible text" defaultValue="-" notes="Figcaption metadata displayed under the frame." />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('API + Behavior Matrix')).toBeVisible();
    await expect(canvas.getByText('Props Matrix')).toBeVisible();
    await expect(canvas.getByText('nativeControls')).toBeVisible();
    await expect(canvas.getByText('Styled Controls')).toBeVisible();
    await expect(canvas.getByText('Native Controls')).toBeVisible();
  },
};

export const Default: Story = {
  args: {
    title: 'Tactical Feed',
    description: 'Live reconnaissance feed routed through the AEGIS media channel.',
    src: SAMPLE_MP4,
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('figure video');

    await expect(video).toBeInTheDocument();
    await expect(video).not.toHaveAttribute('controls');
    await expect(canvas.getByRole('button', { name: 'Open volume controls' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Start playback' })).toBeVisible();
    await expect(canvas.getByText('Tactical Feed')).toBeVisible();
  },
};

export const MultipleSources: Story = {
  args: {
    title: 'Redundant Encoding',
    description: 'MP4 and WebM sources supplied for browser compatibility.',
    sources: [
      { src: SAMPLE_MP4, type: 'video/mp4' },
      { src: SAMPLE_WEBM, type: 'video/webm' },
    ],
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  play: async ({ canvasElement }) => {
    const video = canvasElement.querySelector('video');
    const sources = canvasElement.querySelectorAll('source');

    await expect(video).toBeInTheDocument();
    await expect(sources).toHaveLength(2);
  },
};

export const WithTracks: Story = {
  args: {
    title: 'Captioned Feed',
    src: SAMPLE_MP4,
    tracks: [
      { src: '/captions/en.vtt', srcLang: 'en', label: 'English', kind: 'captions', default: true },
      { src: '/captions/de.vtt', srcLang: 'de', label: 'Deutsch', kind: 'subtitles' },
    ],
  },
  play: async ({ canvasElement }) => {
    const tracks = canvasElement.querySelectorAll('track');

    await expect(tracks).toHaveLength(2);
    await expect(tracks[0]).toHaveAttribute('kind', 'captions');
    await expect(tracks[0]).toHaveAttribute('default');
  },
};

export const AutoPlayMuted: Story = {
  args: {
    title: 'Ambient Loop',
    src: SAMPLE_MP4,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    fit: 'contain',
  },
  play: async ({ canvasElement }) => {
    const video = canvasElement.querySelector('video');

    await expect(video).toHaveAttribute('autoplay');
    await expect(video).toHaveProperty('muted', true);
    await expect(video).toHaveAttribute('loop');
  },
};

export const SquareFrame: Story = {
  args: {
    title: 'Square Capture',
    description: 'Alternate framing for profile and laboratory recordings.',
    src: SAMPLE_MP4,
    aspectRatio: '1 / 1',
    fit: 'cover',
    caption: 'Source: AEGIS archive / recut 01',
  },
};

export const NativeControls: Story = {
  args: {
    title: 'Browser Controls',
    src: SAMPLE_MP4,
    nativeControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video');

    await expect(video).toHaveAttribute('controls');
    await expect(canvas.queryByRole('button', { name: 'Open volume controls' })).not.toBeInTheDocument();
  },
};

export const StyledControlsInteraction: Story = {
  args: {
    title: 'Styled Controls',
    src: SAMPLE_MP4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    installVideoMock(video);
    dispatchLoadedMetadata(video, 245);
    const startPlayback = canvas.getByRole('button', { name: 'Start playback' });
    const volumeTrigger = canvas.getByRole('button', { name: 'Open volume controls' });

    await expect(startPlayback).toBeVisible();
    await userEvent.click(video);
    await expect(canvas.getByRole('button', { name: 'Pause playback' })).toBeVisible();
    await expect(canvas.queryByRole('slider', { name: 'Video volume' })).not.toBeInTheDocument();
    await userEvent.click(volumeTrigger);
    await expect(canvas.getByRole('slider', { name: 'Video volume' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Mute video' }));
    await expect(canvas.getByRole('button', { name: 'Unmute video' })).toBeVisible();
    await userEvent.click(video);
    await expect(canvas.getByRole('button', { name: 'Start playback' })).toBeVisible();
    await expect(canvas.getByRole('slider', { name: 'Seek video' })).toBeInTheDocument();
    await expect(volumeTrigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const MetadataAndTimeSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Metadata Probe',
    src: SAMPLE_MP4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    installVideoMock(video, { duration: 367 });

    dispatchLoadedMetadata(video, 367);
    dispatchTimeUpdate(video, 125);

    await expect(canvas.getByText('02:05')).toBeVisible();
    await expect(canvas.getByText('06:07')).toBeVisible();
  },
};

export const SeekSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Seek Spec',
    src: SAMPLE_MP4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    installVideoMock(video, { duration: 300 });
    dispatchLoadedMetadata(video, 300);

    const seek = canvas.getByRole('slider', { name: 'Seek video' });
    fireEvent.change(seek, { target: { value: '120' } });
    fireEvent(video, new Event('timeupdate', { bubbles: true }));

    await expect(canvas.getByText('02:00')).toBeVisible();
    await expect(seek).toHaveValue('120');
  },
};

export const VolumeSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Volume Spec',
    src: SAMPLE_MP4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    installVideoMock(video);
    dispatchLoadedMetadata(video, 245);

    const volumeTrigger = canvas.getByRole('button', { name: 'Open volume controls' });
    await expect(canvas.queryByRole('slider', { name: 'Video volume' })).not.toBeInTheDocument();
    await userEvent.click(volumeTrigger);

    const volume = canvas.getByRole('slider', { name: 'Video volume' });
    fireEvent.change(volume, { target: { value: '0.25' } });
    fireEvent(video, new Event('volumechange', { bubbles: true }));

    await expect(canvas.getByRole('button', { name: 'Mute video' })).toBeVisible();
    await expect(volume).toHaveValue('0.25');

    await userEvent.click(canvas.getByRole('button', { name: 'Mute video' }));
    await expect(canvas.getByRole('button', { name: 'Unmute video' })).toBeVisible();
    await expect(volumeTrigger).toHaveAttribute('aria-expanded', 'true');
  },
};

export const FullscreenSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Fullscreen Spec',
    src: SAMPLE_MP4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvasElement.querySelector('figure > div') as HTMLDivElement;
    installFullscreenMock(frame);

    await userEvent.click(canvas.getByRole('button', { name: 'Enter fullscreen' }));
    await expect(canvas.getByRole('button', { name: 'Exit fullscreen' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Exit fullscreen' }));
    await expect(canvas.getByRole('button', { name: 'Enter fullscreen' })).toBeVisible();
  },
};
