import type { Meta } from '@storybook/react-vite';
import Footer from './Footer';
import Badge from '@/components/atoms/Badge';

const meta: Meta<typeof Footer> = { title: 'Organisms/Footer', component: Footer, parameters: { layout: 'fullscreen' } };
export default meta;

const Brand = () => (
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
    <span className="font-display text-sm font-bold tracking-widest text-primary uppercase">AEGIS</span>
  </div>
);

const groups = [
  {
    id: 'system',
    label: 'System',
    links: [
      { id: 'dashboard', label: 'Dashboard', href: '#', icon: 'dashboard' },
      { id: 'missions', label: 'Missions', href: '#', icon: 'flag' },
      { id: 'lab', label: 'Laboratory', href: '#', icon: 'science' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    links: [
      { id: 'docs', label: 'Documentation', href: '#', icon: 'description' },
      { id: 'api', label: 'API Reference', href: '#', icon: 'api' },
      { id: 'changelog', label: 'Changelog', href: '#' },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [
      { id: 'terms', label: 'Terms of Service', href: '#' },
      { id: 'privacy', label: 'Privacy Policy', href: '#' },
    ],
  },
];

export const Default = {
  render: () => (
    <Footer
      brand={<Brand />}
      tagline="Advanced Engagement & Grid Intelligence System"
      groups={groups}
      copyright="© 2026 AEGIS OPS · All systems classified"
      bottom={
        <Badge label="SYSTEM NOMINAL" variant="primary" dot />
      }
    />
  ),
};

export const Minimal = {
  render: () => (
    <Footer
      brand={<Brand />}
      copyright="© 2026 AEGIS OPS"
    />
  ),
};

export const LinksOnly = {
  render: () => (
    <Footer
      groups={groups}
      copyright="© 2026 AEGIS OPS · Classified"
    />
  ),
};
