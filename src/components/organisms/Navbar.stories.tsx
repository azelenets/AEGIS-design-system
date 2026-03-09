import type { Meta } from '@storybook/react-vite';
import Navbar from './Navbar';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';

const meta: Meta<typeof Navbar> = { title: 'Organisms/Navbar', component: Navbar, parameters: { layout: 'fullscreen' } };
export default meta;

const brand = (
  <span className="flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
    <span className="font-display font-bold text-white text-sm tracking-widest">AEGIS</span>
  </span>
);

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true },
  { id: 'lab',       label: 'Laboratory', icon: 'science' },
  { id: 'missions',  label: 'Missions',   icon: 'radar',  badge: '3' },
  { id: 'arsenal',   label: 'Arsenal',    icon: 'inventory_2' },
];

export const Default = {
  render: () => (
    <Navbar
      brand={brand}
      items={navItems}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon="notifications">Alerts</Button>
          <Avatar initials="OP" size="sm" variant="primary" status="online" />
        </div>
      }
    />
  ),
};

export const NoActions = { render: () => <Navbar brand={brand} items={navItems} /> };
export const NoBrand = { render: () => <Navbar items={navItems} /> };
export const NonSticky = { render: () => <Navbar brand={brand} items={navItems} sticky={false} /> };
