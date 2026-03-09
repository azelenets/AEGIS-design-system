import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumbs from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const base = [
  { label: 'AEGIS', href: '#', icon: 'shield' },
  { label: 'Laboratory', href: '#' },
  { label: 'Signal Trace', href: '#' },
  { label: 'Config', },
];

export const ChevronSeparator: Story = {
  args: { items: base, separator: 'chevron' },
};

export const SlashSeparator: Story = {
  args: { items: base, separator: 'slash' },
};

export const DotSeparator: Story = {
  args: { items: base, separator: 'dot' },
};

export const ArrowSeparator: Story = {
  args: { items: base, separator: 'arrow' },
};

export const ShortPath: Story = {
  args: {
    items: [
      { label: 'AEGIS', href: '#', icon: 'shield' },
      { label: 'Dashboard' },
    ],
    separator: 'chevron',
  },
};

export const LongPathCollapsed: Story = {
  args: {
    items: [
      { label: 'AEGIS',       href: '#', icon: 'shield' },
      { label: 'Laboratory',  href: '#' },
      { label: 'Projects',    href: '#' },
      { label: 'Signal Trace', href: '#' },
      { label: 'Deployments', href: '#' },
      { label: 'v2.4.1' },
    ],
    separator: 'chevron',
    maxItems: 3,
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'AEGIS',      href: '#', icon: 'shield' },
      { label: 'Credentials', href: '#', icon: 'badge' },
      { label: 'Certifications', icon: 'verified' },
    ],
    separator: 'chevron',
  },
};

export const NoLinks: Story = {
  args: {
    items: [
      { label: 'AEGIS' },
      { label: 'Arsenal' },
      { label: 'Tech Stack' },
    ],
    separator: 'slash',
  },
};
