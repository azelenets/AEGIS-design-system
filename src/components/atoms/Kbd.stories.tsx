import type { Meta, StoryObj } from '@storybook/react-vite';
import Kbd from './Kbd';

const meta: Meta<typeof Kbd> = { title: 'Atoms/Kbd', component: Kbd };
export default meta;
type Story = StoryObj<typeof Kbd>;

export const Single: Story = { args: { children: '⌘' } };

export const Shortcut = {
  render: () => (
    <span className="inline-flex items-center gap-1">
      <Kbd>⌘</Kbd><Kbd>K</Kbd>
    </span>
  ),
};

export const CtrlShiftP = {
  render: () => (
    <span className="inline-flex items-center gap-1">
      <Kbd>Ctrl</Kbd><span className="text-slate-600 text-xs">+</span><Kbd>Shift</Kbd><span className="text-slate-600 text-xs">+</span><Kbd>P</Kbd>
    </span>
  ),
};

export const InContext = {
  render: () => (
    <p className="text-xs font-mono text-slate-400">
      Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open command palette.
    </p>
  ),
};
