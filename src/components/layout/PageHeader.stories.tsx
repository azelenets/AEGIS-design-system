import type { Meta, StoryObj } from '@storybook/react-vite';
import PageHeader from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    eyebrow: 'SECTION_01',
    titleMain: 'MISSION',
    titleAccent: 'LOG',
    description: 'A record of completed operations and tactical deployments.',
  },
};

export const Minimal: Story = {
  args: {
    titleMain: 'PROTOCOLS',
  },
};
