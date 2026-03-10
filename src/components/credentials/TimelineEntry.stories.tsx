import type { Meta, StoryObj } from '@storybook/react-vite';
import TimelineEntry from './TimelineEntry';

const meta: Meta<typeof TimelineEntry> = {
  title: 'Molecules/TimelineEntry',
  component: TimelineEntry,
};

export default meta;
type Story = StoryObj<typeof TimelineEntry>;

export const Default: Story = {
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
  args: {
    level: 'LEVEL-6',
    title: 'Master of Information Security',
    organization: 'National Technical University of Ukraine "KPI"',
    period: '2016 — 2018',
    fields: [
      { label: 'Specialisation', value: 'Cybersecurity & Cryptography' },
      { label: 'Thesis', value: 'Zero-Trust Architecture in Distributed Systems' },
      { label: 'GPA', value: '5.0 / 5.0' },
      { label: 'Format', value: 'Full-time' },
    ],
  },
};

export const Distinguished: Story = {
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
  args: {
    level: 'LEVEL-6',
    title: 'Master of Information Security',
    organization: 'National Technical University of Ukraine "KPI"',
    period: '2016 — 2018',
    distinguished: true,
    fields: [
      { label: 'Specialisation', value: 'Cybersecurity & Cryptography' },
      { label: 'Thesis', value: 'Zero-Trust Architecture in Distributed Systems' },
      { label: 'GPA', value: '5.0 / 5.0' },
      { label: 'Format', value: 'Full-time' },
    ],
  },
};
