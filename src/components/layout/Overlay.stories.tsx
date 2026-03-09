import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
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
};
