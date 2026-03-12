import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import Sidebar from './Sidebar';
import type { SidebarGroup } from './Sidebar';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';

const meta: Meta<typeof Sidebar> = { title: 'Organisms/Sidebar', component: Sidebar, parameters: { layout: 'fullscreen' } };
export default meta;

const brand = (
  <span className="flex items-center gap-2">
    <MaterialIcon name="shield" className="text-primary text-[20px]" />
    <span className="font-display font-bold text-white text-xs tracking-widest">AEGIS</span>
  </span>
);

const groups: SidebarGroup[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard',   icon: 'dashboard',    active: true },
      { id: 'lab',       label: 'Laboratory',  icon: 'science' },
      { id: 'missions',  label: 'Missions',    icon: 'radar',        badge: '3' },
    ],
  },
  {
    label: 'Config',
    items: [
      { id: 'arsenal',   label: 'Arsenal',     icon: 'inventory_2' },
      { id: 'creds',     label: 'Credentials', icon: 'badge' },
      { id: 'protocols', label: 'Protocols',   icon: 'account_tree' },
    ],
  },
];

const footer = <Avatar initials="OP" size="sm" variant="primary" status="online" />;

export const Default = {
  render: () => (
    <div className="h-screen flex">
      <Sidebar brand={brand} groups={groups} footer={footer} />
      <main className="flex-1 p-8 text-xs font-mono text-slate-400">Main content area</main>
    </div>
  ),
};

export const Collapsed = {
  render: () => (
    <div className="h-screen flex">
      <Sidebar brand={<MaterialIcon name="shield" className="text-primary text-[20px]" />} groups={groups} footer={footer} collapsed />
      <main className="flex-1 p-8 text-xs font-mono text-slate-400">Main content area</main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Laboratory' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Missions' })).toBeVisible();
  },
};

export const Toggleable = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="h-screen flex">
        <Sidebar brand={collapsed ? <MaterialIcon name="shield" className="text-primary text-[20px]" /> : brand} groups={groups} collapsed={collapsed}
          footer={<Button variant="ghost" size="sm" icon={collapsed ? 'chevron_right' : 'chevron_left'} onClick={() => setCollapsed((v) => !v)}>{collapsed ? '' : 'Collapse'}</Button>}
        />
        <main className="flex-1 p-8 text-xs font-mono text-slate-400">Click footer button to toggle sidebar.</main>
      </div>
    );
  },
};
