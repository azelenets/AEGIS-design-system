import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { expect, within } from 'storybook/test';
import MaterialIcon from './MaterialIcon';

const meta: Meta<typeof MaterialIcon> = {
  title: 'Atoms/MaterialIcon',
  component: MaterialIcon,
  decorators: [(Story) => <div className="max-w-xl p-4"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof MaterialIcon>;

const MediaIconCell = ({ name, label }: { name: ComponentProps<typeof MaterialIcon>['name']; label: string }) => (
  <div className="flex items-center gap-3 border border-border-dark bg-panel-dark p-3">
    <MaterialIcon name={name} aria-label={label} className="text-2xl text-primary" />
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">{name}</span>
  </div>
);

export const MediaControlsSpec: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      <MediaIconCell name="play_arrow" label="Play icon" />
      <MediaIconCell name="pause_circle" label="Pause icon" />
      <MediaIconCell name="volume_off" label="Muted icon" />
      <MediaIconCell name="volume_down" label="Low volume icon" />
      <MediaIconCell name="volume_up" label="High volume icon" />
      <MediaIconCell name="fullscreen" label="Enter fullscreen icon" />
      <MediaIconCell name="fullscreen_exit" label="Exit fullscreen icon" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Play icon')).toBeVisible();
    await expect(canvas.getByLabelText('Pause icon')).toBeVisible();
    await expect(canvas.getByLabelText('Muted icon')).toBeVisible();
    await expect(canvas.getByLabelText('Low volume icon')).toBeVisible();
    await expect(canvas.getByLabelText('High volume icon')).toBeVisible();
    await expect(canvas.getByLabelText('Enter fullscreen icon')).toBeVisible();
    await expect(canvas.getByLabelText('Exit fullscreen icon')).toBeVisible();
  },
};
