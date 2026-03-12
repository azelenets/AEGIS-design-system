import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import AudioPlayer from './AudioPlayer';

const SAMPLE_MP3 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
const SAMPLE_OGG = 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.ogg';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Molecules/AudioPlayer',
  component: AudioPlayer,
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof AudioPlayer>;

type MockMediaState = {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  ended: boolean;
};

const installAudioMock = (audio: HTMLAudioElement, overrides?: Partial<MockMediaState>) => {
  const state: MockMediaState = {
    paused: true,
    currentTime: 0,
    duration: 185,
    volume: 1,
    muted: false,
    ended: false,
    ...overrides,
  };

  Object.defineProperties(audio, {
    paused: { get: () => state.paused, configurable: true },
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
        fireEvent(audio, new Event('play', { bubbles: true }));
      }),
      configurable: true,
    },
    pause: {
      value: fn(() => {
        state.paused = true;
        fireEvent(audio, new Event('pause', { bubbles: true }));
      }),
      configurable: true,
    },
  });
};

const dispatchLoadedMetadata = (audio: HTMLAudioElement, duration = 185) => {
  Object.defineProperty(audio, 'duration', {
    configurable: true,
    get: () => duration,
  });
  fireEvent(audio, new Event('loadedmetadata', { bubbles: true }));
};

const dispatchTimeUpdate = (audio: HTMLAudioElement, currentTime: number) => {
  audio.currentTime = currentTime;
  fireEvent(audio, new Event('timeupdate', { bubbles: true }));
};

export const Default: Story = {
  args: {
    title: 'Signal Archive',
    description: 'Recovered transmission routed through the AEGIS relay channel.',
    src: SAMPLE_MP3,
    caption: 'Encrypted source / channel 07',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio');

    await expect(audio).toBeInTheDocument();
    await expect(audio).not.toHaveAttribute('controls');
    await expect(canvas.getByRole('button', { name: 'Start playback' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Open volume controls' })).toBeVisible();
    await expect(canvas.getByText('Signal Archive')).toBeVisible();
  },
};

export const WithTracksAndArtwork: Story = {
  args: {
    title: 'Annotated Transmission',
    description: 'Tagged broadcast with custom artwork and metadata track.',
    src: SAMPLE_MP3,
    artwork: <span className="text-[10px] font-mono uppercase tracking-widest">RX-7</span>,
    tracks: [
      { src: '/transcripts/en.vtt', srcLang: 'en', label: 'English Transcript', kind: 'metadata', default: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tracks = canvasElement.querySelectorAll('track');

    await expect(canvas.getByText('RX-7')).toBeVisible();
    await expect(tracks).toHaveLength(1);
    await expect(tracks[0]).toHaveAttribute('kind', 'metadata');
    await expect(tracks[0]).toHaveAttribute('default');
  },
};

export const MultipleSources: Story = {
  args: {
    title: 'Redundant Broadcast',
    sources: [
      { src: SAMPLE_MP3, type: 'audio/mpeg' },
      { src: SAMPLE_OGG, type: 'audio/ogg' },
    ],
  },
  play: async ({ canvasElement }) => {
    const sources = canvasElement.querySelectorAll('source');
    await expect(sources).toHaveLength(2);
  },
};

export const AutoPlayMutedLoop: Story = {
  args: {
    title: 'Ambient Loop',
    src: SAMPLE_MP3,
    autoPlay: true,
    muted: true,
    loop: true,
  },
  play: async ({ canvasElement }) => {
    const audio = canvasElement.querySelector('audio');

    await expect(audio).toHaveAttribute('autoplay');
    await expect(audio).toHaveProperty('muted', true);
    await expect(audio).toHaveAttribute('loop');
  },
};

export const NativeControls: Story = {
  args: {
    title: 'Browser Audio Controls',
    src: SAMPLE_MP3,
    nativeControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio');

    await expect(audio).toHaveAttribute('controls');
    await expect(canvas.queryByRole('button', { name: 'Open volume controls' })).not.toBeInTheDocument();
  },
};

export const StyledControlsInteraction: Story = {
  args: {
    title: 'Styled Audio Controls',
    src: SAMPLE_MP3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement;
    installAudioMock(audio);
    dispatchLoadedMetadata(audio, 185);

    await userEvent.click(canvas.getByRole('button', { name: 'Start playback' }));
    await expect(canvas.getByRole('button', { name: 'Pause playback' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Open volume controls' }));
    await expect(canvas.getByRole('slider', { name: 'Audio volume' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Mute audio' }));
    await expect(canvas.getByRole('button', { name: 'Unmute audio' })).toBeVisible();
  },
};

export const MetadataAndSeekSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Metadata Probe',
    src: SAMPLE_MP3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement;
    installAudioMock(audio, { duration: 367 });

    dispatchLoadedMetadata(audio, 367);
    dispatchTimeUpdate(audio, 125);

    const seek = canvas.getByRole('slider', { name: 'Seek audio' });
    fireEvent.change(seek, { target: { value: '240' } });
    fireEvent(audio, new Event('timeupdate', { bubbles: true }));

    await expect(canvas.getByText('04:00')).toBeVisible();
    await expect(canvas.getByText('06:07')).toBeVisible();
  },
};

export const VolumeSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Volume Spec',
    src: SAMPLE_MP3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement;
    installAudioMock(audio);
    dispatchLoadedMetadata(audio, 185);

    const volumeTrigger = canvas.getByRole('button', { name: 'Open volume controls' });
    await userEvent.click(volumeTrigger);

    const volume = canvas.getByRole('slider', { name: 'Audio volume' });
    fireEvent.change(volume, { target: { value: '0.2' } });
    fireEvent(audio, new Event('volumechange', { bubbles: true }));

    await expect(volume).toHaveValue('0.2');
    await expect(canvas.getByRole('button', { name: 'Mute audio' })).toBeVisible();
  },
};

export const VolumePopoverDismissSpec: Story = {
  tags: ['!dev'],
  args: {
    title: 'Volume Popover Dismiss',
    src: SAMPLE_MP3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const audio = canvasElement.querySelector('audio') as HTMLAudioElement;
    installAudioMock(audio);
    dispatchLoadedMetadata(audio, 185);

    const trigger = canvas.getByRole('button', { name: 'Open volume controls' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('slider', { name: 'Audio volume' })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('slider', { name: 'Audio volume' })).not.toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
