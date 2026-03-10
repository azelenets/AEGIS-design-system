import type { Meta, StoryObj } from '@storybook/react-vite';
import EducationEntry from './EducationEntry';

const meta: Meta<typeof EducationEntry> = {
  title: 'Molecules/EducationEntry',
  component: EducationEntry,
};

export default meta;
type Story = StoryObj<typeof EducationEntry>;

export const WithHonor: Story = {
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
  args: {
    level: 'LEVEL-6',
    title: 'Master of Information Security',
    institution: 'National Technical University of Ukraine "KPI"',
    years: '2016 — 2018',
    withHonor: true,
    fields: [
      { label: 'Specialisation', value: 'Cybersecurity & Cryptography' },
      { label: 'Thesis', value: 'Zero-Trust Architecture in Distributed Systems' },
      { label: 'GPA', value: '5.0 / 5.0' },
      { label: 'Format', value: 'Full-time' },
    ],
  },
};
