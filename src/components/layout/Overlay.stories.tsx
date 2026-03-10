import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import Overlay from './Overlay';
import Button from '@/components/atoms/Button';

const meta: Meta<typeof Overlay> = { title: 'Layout/Overlay', component: Overlay, parameters: { layout: 'fullscreen' } };
export default meta;

export const Default = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="min-h-screen p-8">
        <Button variant="secondary" onClick={() => setVisible(true)}>Show Overlay</Button>
        <Overlay visible={visible} onClick={() => setVisible(false)} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show Overlay' }));
    const overlay = document.body.querySelector('.bg-bg-dark\\/70');
    await expect(overlay).not.toBeNull();

    await userEvent.click(overlay as HTMLElement);
    await expect(document.body.querySelector('.bg-bg-dark\\/70')).toBeNull();
  },
};

export const WithBlur = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="min-h-screen p-8">
        <Button variant="secondary" onClick={() => setVisible(true)}>Show Blurred Overlay</Button>
        <Overlay visible={visible} onClick={() => setVisible(false)} blur />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show Blurred Overlay' }));
    const overlay = document.body.querySelector('.bg-bg-dark\\/70.backdrop-blur-sm');
    await expect(overlay).not.toBeNull();

    await userEvent.click(overlay as HTMLElement);
    await expect(document.body.querySelector('.bg-bg-dark\\/70')).toBeNull();
  },
};

export const StaticOverlay = {
  render: () => (
    <div className="min-h-screen p-8">
      <Overlay visible blur data-testid="static-overlay" />
    </div>
  ),
  play: async () => {
    const overlay = document.body.querySelector('[data-testid="static-overlay"]');
    await expect(overlay).not.toBeNull();
    await expect(overlay).not.toHaveClass('cursor-pointer');
  },
};
